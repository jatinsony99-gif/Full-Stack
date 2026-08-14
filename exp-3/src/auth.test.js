import { describe, expect, it } from 'vitest'
import { createToken, hasAccess, verifyToken } from './auth.js'

describe('jwt auth helpers', () => {
  it('creates a valid JWT payload with user metadata', () => {
    const token = createToken({ username: 'adminUser', role: 'admin' })

    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)

    const payload = verifyToken(token)
    expect(payload.username).toBe('adminUser')
    expect(payload.role).toBe('admin')
  })

  it('rejects tokens that have been tampered with', () => {
    const token = createToken({ username: 'student', role: 'user' })
    const tampered = `${token.slice(0, -1)}Z`

    expect(() => verifyToken(tampered)).toThrow(/invalid|signature/i)
  })

  it('blocks access when the user role is insufficient', () => {
    const token = createToken({ username: 'student', role: 'user' })
    const payload = verifyToken(token)

    expect(hasAccess(payload, 'admin')).toBe(false)
    expect(hasAccess(payload, 'user')).toBe(true)
  })
})
