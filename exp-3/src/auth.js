const SECRET = 'jwt-demo-secret-key'

const ROLE_PRIORITY = {
  user: 1,
  editor: 2,
  admin: 3,
}

function toBase64Url(value) {
  const encoded = btoa(
    typeof value === 'string'
      ? value
      : JSON.stringify(value),
  )
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return atob(padded)
}

function hashText(value) {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0).toString(36)
}

function signChunk(input) {
  return hashText(`${SECRET}:${input}`)
}

export function createToken(user) {
  const safeUser = {
    username: user?.username || 'guest',
    role: ROLE_PRIORITY[user?.role] ? user.role : 'user',
    iat: Date.now(),
  }

  const header = toBase64Url({ alg: 'HS256', typ: 'JWT' })
  const payload = toBase64Url(safeUser)
  const signature = signChunk(`${header}.${payload}`)

  return `${header}.${payload}.${signature}`
}

export function verifyToken(token) {
  if (typeof token !== 'string' || !token.trim()) {
    throw new Error('Invalid token format')
  }

  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('Invalid JWT structure')
  }

  const [header, payload, signature] = parts
  const expectedSignature = signChunk(`${header}.${payload}`)

  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature')
  }

  try {
    const decodedPayload = JSON.parse(fromBase64Url(payload))
    return decodedPayload
  } catch {
    throw new Error('Invalid token payload')
  }
}

export function hasAccess(payload, requiredRole = 'user') {
  const currentRole = payload?.role || 'user'
  const requiredPriority = ROLE_PRIORITY[requiredRole] || 1
  const currentPriority = ROLE_PRIORITY[currentRole] || 1

  return currentPriority >= requiredPriority
}
