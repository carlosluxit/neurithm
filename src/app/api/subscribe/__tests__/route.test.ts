import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('resend', () => {
  const sendFn = vi.fn().mockResolvedValue({ data: { id: 'email-1' }, error: null })
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: sendFn },
    })),
    __mockSend: sendFn,
  }
})

vi.mock('@/lib/supabase', () => {
  const insertFn = vi.fn(() => ({ error: null }))
  const fromFn = vi.fn(() => ({ insert: insertFn }))
  return {
    supabase: { from: fromFn },
    __mockFrom: fromFn,
    __mockInsert: insertFn,
  }
})

import { POST } from '../route'
import { supabase } from '@/lib/supabase'

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: successful insert
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn(() => ({ error: null })),
    } as never)
    // No resend key by default
    delete process.env.RESEND_API_KEY
  })

  it('returns 200 for a valid subscription', async () => {
    const res = await POST(makeRequest({ email: 'user@example.com', name: 'Jane' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('calls supabase with subscribers table', async () => {
    await POST(makeRequest({ email: 'user@example.com', name: 'Jane' }))
    expect(supabase.from).toHaveBeenCalledWith('subscribers')
  })

  it('returns 400 for missing email', async () => {
    const res = await POST(makeRequest({ email: '', name: 'Jane' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.details).toContain('Email is required')
  })

  it('returns 400 for invalid email', async () => {
    const res = await POST(makeRequest({ email: 'invalid', name: 'Jane' }))
    expect(res.status).toBe(400)
  })

  it('returns success with message for duplicate subscriber (23505)', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn(() => ({ error: { code: '23505', message: 'duplicate' } })),
    } as never)

    const res = await POST(makeRequest({ email: 'user@example.com', name: 'Jane' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.message).toBe('Already subscribed')
  })

  it('returns 500 for non-duplicate supabase errors', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn(() => ({ error: { code: '500', message: 'DB error' } })),
    } as never)

    const res = await POST(makeRequest({ email: 'user@example.com', name: 'Jane' }))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Failed to subscribe')
  })

  it('returns 400 for malformed JSON body', async () => {
    const req = new Request('http://localhost/api/subscribe', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
