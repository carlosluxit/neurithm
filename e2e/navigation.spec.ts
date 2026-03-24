import { test, expect } from '@playwright/test'

const pages = [
  { path: '/', heading: 'EVERY REVOLUTION NEEDS A RHYTHM' },
  { path: '/about', heading: 'About' },
  { path: '/assessment', heading: 'AI-Ready' },
  { path: '/calculator', heading: 'ROI' },
  { path: '/contact', heading: 'Contact' },
  { path: '/blog', heading: 'Behind the Breakthrough' },
  { path: '/case-studies', heading: 'Real Results' },
]

for (const page of pages) {
  test(`${page.path} loads and contains expected heading`, async ({ page: p }) => {
    // Collect console errors before navigation
    const errors: string[] = []
    p.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    const response = await p.goto(page.path, { waitUntil: 'domcontentloaded' })

    // Page should return a successful status
    expect(response?.status()).toBeLessThan(400)

    // Verify the expected heading text is present on the page
    await expect(p.locator('body')).toContainText(page.heading, {
      timeout: 15_000,
    })

    // Allow a brief moment for any deferred console errors to fire
    await p.waitForTimeout(1000)

    // Filter out Next.js hydration warnings — those are non-critical in dev mode
    const realErrors = errors.filter(
      (e) =>
        !e.includes('hydration') &&
        !e.includes('Hydration') &&
        !e.includes('NEXT_') &&
        !e.includes('next-dev')
    )
    expect(realErrors).toHaveLength(0)
  })
}

test('404 page returns proper status for unknown route', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist', {
    waitUntil: 'domcontentloaded',
  })
  expect(response?.status()).toBe(404)
})
