import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch globally for the email trigger inside the leads route
const mockFetch = vi.fn().mockResolvedValue(new Response('ok'))
vi.stubGlobal('fetch', mockFetch)

vi.mock('@/lib/supabase', () => {
  const insertFn = vi.fn(() => ({
    select: vi.fn(() => ({ data: [{ id: 'lead-1' }], error: null })),
  }))
  const fromFn = vi.fn(() => ({
    insert: insertFn,
  }))
  return {
    supabase: { from: fromFn },
    __mockFrom: fromFn,
    __mockInsert: insertFn,
  }
})

import { POST } from '../route'
import { supabase } from '@/lib/supabase'

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/leads', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

const validBody = {
  email: 'test@example.com',
  name: 'Test User',
  company: 'Acme',
  role: 'CTO',
  industry: 'Technology',
  company_size: '11-50',
  phone: '+1 555-1234',
  source: 'contact',
}

describe('POST /api/leads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the default successful mock
    const insertFn = vi.fn(() => ({
      select: vi.fn(() => ({ data: [{ id: 'lead-1' }], error: null })),
    }))
    vi.mocked(supabase.from).mockReturnValue({
      insert: insertFn,
    } as never)
  })

  it('returns 200 for a valid lead', async () => {
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toEqual([{ id: 'lead-1' }])
  })

  it('calls supabase.from with leads table', async () => {
    await POST(makeRequest(validBody))
    expect(supabase.from).toHaveBeenCalledWith('leads')
  })

  it('returns 400 for missing email', async () => {
    const res = await POST(makeRequest({ ...validBody, email: '' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Validation failed')
    expect(json.details).toContain('Email is required')
  })

  it('returns 400 for invalid email', async () => {
    const res = await POST(makeRequest({ ...validBody, email: 'notanemail' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.details).toContain('Invalid email format')
  })

  it('returns 400 for missing name', async () => {
    const res = await POST(makeRequest({ ...validBody, name: '' }))
    expect(res.status).toBe(400)
  })

  it('returns 500 when supabase errors', async () => {
    const insertFn = vi.fn(() => ({
      select: vi.fn(() => ({ data: null, error: { message: 'DB down', code: '500' } })),
    }))
    vi.mocked(supabase.from).mockReturnValue({ insert: insertFn } as never)

    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Failed to save lead')
  })

  it('returns 400 for malformed JSON body', async () => {
    const req = new Request('http://localhost/api/leads', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Invalid request')
  })

  it('does not export a GET handler', async () => {
    const routeModule = await import('../route')
    expect((routeModule as Record<string, unknown>).GET).toBeUndefined()
  })
})
