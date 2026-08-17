import { describe, expect, it } from 'vitest'
import { canPerformAction, createToken, hasAccess, verifyToken } from './auth.js'

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
    const token = createToken({ username: 'student', role: 'viewer' })
    const tampered = `${token.slice(0, -1)}Z`

    expect(() => verifyToken(tampered)).toThrow(/invalid|signature/i)
  })

  it('blocks access when the user role is insufficient', () => {
    const token = createToken({ username: 'student', role: 'viewer' })
    const payload = verifyToken(token)

    expect(hasAccess(payload, 'admin')).toBe(false)
    expect(hasAccess(payload, 'viewer')).toBe(true)
  })

  it('allows admin full post permissions while editor cannot delete and viewer can only read', () => {
    const adminPayload = verifyToken(createToken({ username: 'admin', role: 'admin' }))
    const editorPayload = verifyToken(createToken({ username: 'editor', role: 'editor' }))
    const viewerPayload = verifyToken(createToken({ username: 'viewer', role: 'viewer' }))

    expect(canPerformAction(adminPayload, 'create')).toBe(true)
    expect(canPerformAction(adminPayload, 'edit')).toBe(true)
    expect(canPerformAction(adminPayload, 'delete')).toBe(true)

    expect(canPerformAction(editorPayload, 'create')).toBe(true)
    expect(canPerformAction(editorPayload, 'edit')).toBe(true)
    expect(canPerformAction(editorPayload, 'delete')).toBe(false)

    expect(canPerformAction(viewerPayload, 'view')).toBe(true)
    expect(canPerformAction(viewerPayload, 'create')).toBe(false)
    expect(canPerformAction(viewerPayload, 'edit')).toBe(false)
    expect(canPerformAction(viewerPayload, 'delete')).toBe(false)
  })
})
