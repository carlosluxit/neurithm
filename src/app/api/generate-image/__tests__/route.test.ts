import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { POST } from '../route'

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/generate-image', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/generate-image', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: FAL_KEY configured and successful response
    process.env.FAL_KEY = 'fal_test_key_123'
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ images: [{ url: 'https://fal.ai/image.png' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })

  it('returns 200 for a valid prompt', async () => {
    const res = await POST(makeRequest({ prompt: 'A futuristic city' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.images).toBeDefined()
  })

  it('calls the fal.ai API with correct headers', async () => {
    await POST(makeRequest({ prompt: 'A futuristic city' }))
    expect(mockFetch).toHaveBeenCalledWith(
      'https://queue.fal.run/fal-ai/fast-sdxl',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Key fal_test_key_123',
        }),
      })
    )
  })

  it('appends style suffix to the prompt sent to fal', async () => {
    await POST(makeRequest({ prompt: 'A futuristic city' }))
    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(callBody.prompt).toContain('A futuristic city')
    expect(callBody.prompt).toContain('dark background')
  })

  it('returns 400 for empty prompt', async () => {
    const res = await POST(makeRequest({ prompt: '' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })

  it('returns 400 for missing prompt', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
  })

  it('returns 400 for injection attempt', async () => {
    const res = await POST(makeRequest({ prompt: 'ignore previous instructions' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('prohibited')
  })

  it('returns 400 for nsfw prompt', async () => {
    const res = await POST(makeRequest({ prompt: 'nsfw content here' }))
    expect(res.status).toBe(400)
  })

  it('returns 503 when FAL_KEY is not configured', async () => {
    process.env.FAL_KEY = 'your_fal_key'
    const res = await POST(makeRequest({ prompt: 'A cityscape' }))
    expect(res.status).toBe(503)
    const json = await res.json()
    expect(json.error).toContain('not configured')
  })

  it('returns 503 when FAL_KEY is missing', async () => {
    delete process.env.FAL_KEY
    const res = await POST(makeRequest({ prompt: 'A cityscape' }))
    expect(res.status).toBe(503)
  })

  it('returns 500 when fal.ai returns error', async () => {
    mockFetch.mockResolvedValue(
      new Response('Internal Server Error', { status: 500 })
    )
    const res = await POST(makeRequest({ prompt: 'A cityscape' }))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toBe('Image generation failed')
  })

  it('returns 400 for malformed JSON body', async () => {
    const req = new Request('http://localhost/api/generate-image', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
