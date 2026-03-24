import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn().mockResolvedValue(new Response('ok'))
vi.stubGlobal('fetch', mockFetch)

vi.mock('@/lib/supabase', () => {
  const insertFn = vi.fn(() => ({ data: [{ id: '1' }], error: null }))
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
  return new Request('http://localhost/api/whitepaper', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

const validBody = {
  email: 'user@example.com',
  name: 'Jane Doe',
  company: 'Acme',
  whitepaper_id: 'state-of-ai-2026',
}

describe('POST /api/whitepaper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn(() => ({ data: [{ id: '1' }], error: null })),
    } as never)
  })

  it('returns 200 for a valid whitepaper download request', async () => {
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('inserts into leads table with source whitepaper', async () => {
    await POST(makeRequest(validBody))
    expect(supabase.from).toHaveBeenCalledWith('leads')
  })

  it('attempts to log download', async () => {
    await POST(makeRequest(validBody))
    expect(supabase.from).toHaveBeenCalledWith('downloads')
  })

  it('returns 400 for missing email', async () => {
    const res = await POST(makeRequest({ ...validBody, email: '' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.details).toContain('Email is required')
  })

  it('returns 400 for invalid whitepaper_id', async () => {
    const res = await POST(makeRequest({ ...validBody, whitepaper_id: 'fake-paper' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.details).toContain('Invalid whitepaper ID')
  })

  it('returns 400 for missing whitepaper_id', async () => {
    const res = await POST(makeRequest({ ...validBody, whitepaper_id: '' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.details).toContain('Whitepaper ID is required')
  })

  it('returns 400 for malformed JSON', async () => {
    const req = new Request('http://localhost/api/whitepaper', {
      method: 'POST',
      body: '{bad',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('does not export a GET handler', async () => {
    const mod = await import('../route')
    expect((mod as Record<string, unknown>).GET).toBeUndefined()
  })
})
