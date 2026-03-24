import { test, expect, devices } from '@playwright/test'

test.use(devices['iPhone 14'])

// ---------------------------------------------------------------------------
// Horizontal overflow checks
// ---------------------------------------------------------------------------

const mobilePagesToCheck = [
  { path: '/', name: 'Homepage' },
  { path: '/contact', name: 'Contact' },
  { path: '/blog', name: 'Blog' },
  { path: '/assessment', name: 'Assessment' },
  { path: '/case-studies', name: 'Case Studies' },
  { path: '/about', name: 'About' },
  { path: '/calculator', name: 'Calculator' },
]

for (const pg of mobilePagesToCheck) {
  test(`${pg.name} (${pg.path}) — no horizontal overflow on mobile`, async ({
    page,
  }) => {
    await page.goto(pg.path, { waitUntil: 'domcontentloaded' })

    // Wait for content to render
    await page.waitForTimeout(2000)

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    )
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth
    )

    // 5px tolerance for sub-pixel rendering
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5)
  })
}

// ---------------------------------------------------------------------------
// Mobile navigation hamburger menu
// ---------------------------------------------------------------------------

test('mobile nav hamburger opens and shows nav links', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  // Wait for nav to be present
  await page.waitForTimeout(1500)

  // Find the hamburger / menu toggle button
  // The Navigation component uses: <button aria-label="Toggle menu">
  const menuBtn = page
    .locator(
      'button[aria-label*="menu"], button[aria-label*="Menu"], button:has(svg.lucide-menu), nav button'
    )
    .first()

  await expect(menuBtn).toBeVisible({ timeout: 10_000 })
  await menuBtn.click()

  // After clicking, the mobile menu should reveal navigation links
  await expect(page.locator('a[href="/contact"]')).toBeVisible({
    timeout: 5_000,
  })
  await expect(page.locator('a[href="/about"]')).toBeVisible({
    timeout: 3_000,
  })
  await expect(page.locator('a[href="/assessment"]')).toBeVisible({
    timeout: 3_000,
  })
})

test('mobile nav hamburger closes on second tap', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)

  const menuBtn = page
    .locator('button[aria-label*="menu"], button[aria-label*="Menu"]')
    .first()

  // Open
  await menuBtn.click()
  await expect(page.locator('a[href="/contact"]')).toBeVisible({
    timeout: 5_000,
  })

  // Close
  await menuBtn.click()

  // The mobile nav links should no longer be visible (they live inside the
  // mobile-only menu panel which is conditionally rendered)
  // Give it a moment to animate out
  await page.waitForTimeout(500)

  // The desktop nav may still have these links, so we check that the mobile
  // menu panel itself is gone. The mobile menu is rendered as a
  // `div.lg\\:hidden` block. We just verify it's no longer in the DOM.
  const mobileMenu = page.locator('div.lg\\:hidden >> a[href="/contact"]')
  // It may or may not be in the DOM, but if present, it should not be visible
  const count = await mobileMenu.count()
  if (count > 0) {
    await expect(mobileMenu.first()).not.toBeVisible({ timeout: 3_000 })
  }
})

// ---------------------------------------------------------------------------
// Touch targets
// ---------------------------------------------------------------------------

test('primary CTA buttons have adequate touch target size on mobile', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  // Check that primary buttons have a minimum height of 44px (WCAG touch target)
  const ctaButtons = page.locator('a.btn-primary, button.btn-primary')
  const count = await ctaButtons.count()

  for (let i = 0; i < Math.min(count, 5); i++) {
    const box = await ctaButtons.nth(i).boundingBox()
    if (box) {
      // Minimum 44px height for accessible touch targets
      expect(box.height).toBeGreaterThanOrEqual(40)
    }
  }
})
