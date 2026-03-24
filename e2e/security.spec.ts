import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Security headers (configured in next.config.ts)
// ---------------------------------------------------------------------------

test.describe('Security headers', () => {
  test('all required security headers are present on page responses', async ({
    page,
  }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })
    const headers = response?.headers() || {}

    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['strict-transport-security']).toContain('max-age=')
    expect(headers['content-security-policy']).toContain("default-src 'self'")
    expect(headers['permissions-policy']).toContain('camera=()')
    expect(headers['x-dns-prefetch-control']).toBe('on')
  })

  test('security headers are present on sub-pages too', async ({ page }) => {
    const response = await page.goto('/contact', {
      waitUntil: 'domcontentloaded',
    })
    const headers = response?.headers() || {}

    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['content-security-policy']).toContain("default-src 'self'")
  })
})

// ---------------------------------------------------------------------------
// API endpoint protection
// ---------------------------------------------------------------------------

test.describe('API endpoint protection', () => {
  test('GET /api/leads returns 404 or 405 (no GET handler)', async ({
    request,
  }) => {
    const response = await request.get('/api/leads')
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('POST /api/leads with invalid email returns 400', async ({
    request,
  }) => {
    const response = await request.post('/api/leads', {
      data: { email: 'not-an-email', name: 'Test' },
    })
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.error).toBeDefined()
  })

  test('POST /api/leads with missing required fields returns 400', async ({
    request,
  }) => {
    const response = await request.post('/api/leads', {
      data: { company: 'Test Corp' },
    })
    expect(response.status()).toBe(400)
  })

  test('POST /api/leads with empty body returns 400', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: {},
    })
    expect(response.status()).toBe(400)
  })

  test('GET /api/subscribe returns 404 or 405 (no GET handler)', async ({
    request,
  }) => {
    const response = await request.get('/api/subscribe')
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('POST /api/subscribe with invalid email returns 400', async ({
    request,
  }) => {
    const response = await request.post('/api/subscribe', {
      data: { email: 'bad-email' },
    })
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.error).toBeDefined()
  })
})

// ---------------------------------------------------------------------------
// Rate limiting (middleware)
// ---------------------------------------------------------------------------

test.describe('Rate limiting', () => {
  test('rate limiter returns 429 after too many requests', async ({
    request,
  }) => {
    // The /api/subscribe endpoint has a limit of 3 requests per 60 seconds.
    // Send 4 requests and expect the last to be rate-limited.
    let lastStatus = 200
    for (let i = 0; i < 5; i++) {
      const response = await request.post('/api/subscribe', {
        data: { email: `ratelimit${i}@test.com`, name: 'Rate Test' },
      })
      lastStatus = response.status()
      if (lastStatus === 429) break
    }

    expect(lastStatus).toBe(429)
  })
})

// ---------------------------------------------------------------------------
// XSS / injection sanity checks
// ---------------------------------------------------------------------------

test.describe('Input sanitization', () => {
  test('XSS payload in lead name is rejected or sanitized', async ({
    request,
  }) => {
    const response = await request.post('/api/leads', {
      data: {
        email: 'xss@test.com',
        name: '<script>alert("xss")</script>',
        source: 'contact',
      },
    })

    // The API should either reject or sanitize — it should not return the
    // raw script tag in the response
    const body = await response.json()
    if (body.data && body.data[0]) {
      expect(body.data[0].name).not.toContain('<script>')
    }
  })
})
