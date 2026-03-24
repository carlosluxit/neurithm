import { test, expect } from '@playwright/test'

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------

test.describe('Contact form', () => {
  test('fills and submits contact form, shows success message', async ({
    page,
  }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })

    // Wait for the form to be visible
    await expect(page.locator('form')).toBeVisible({ timeout: 15_000 })

    // Fill required fields
    await page.fill('#name', 'E2E Test User')
    await page.fill('#email', 'e2e@testcompany.com')
    await page.fill('#company', 'Test Corp')
    await page.fill('#message', 'This is an automated E2E test submission.')

    // Fill optional fields
    await page.fill('#role', 'QA Engineer')
    await page.selectOption('#industry', 'Technology')
    await page.selectOption('#company_size', '51-200 employees')

    // Intercept the API call so we don't hit a real database
    await page.route('/api/leads', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [{ id: 'test-lead' }] }),
      })
    })

    // Submit the form
    await page.click('button[type="submit"]')

    // Verify success state
    await expect(page.locator('text=Message Received')).toBeVisible({
      timeout: 10_000,
    })
    await expect(
      page.locator('text=Thank you for reaching out')
    ).toBeVisible()
  })

  test('submit button is present and labeled correctly', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('form')).toBeVisible({ timeout: 15_000 })

    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toContainText('Send Message')
  })
})

// ---------------------------------------------------------------------------
// Newsletter subscribe (on /blog)
// ---------------------------------------------------------------------------

test.describe('Newsletter subscription', () => {
  test('blog page has newsletter email input and subscribe button', async ({
    page,
  }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded' })

    // Find the newsletter section
    await expect(
      page.locator('text=Stay Ahead of the AI Curve')
    ).toBeVisible({ timeout: 15_000 })

    // Find the email input near the subscribe section
    const emailInput = page.locator('input[type="email"][placeholder*="email"]')
    await expect(emailInput).toBeVisible()

    // Find the subscribe button
    const subscribeBtn = page.locator('button:has-text("Subscribe")')
    await expect(subscribeBtn).toBeVisible()

    // Fill in the email
    await emailInput.fill('newsletter-test@example.com')

    // Verify the value was set
    await expect(emailInput).toHaveValue('newsletter-test@example.com')
  })
})

// ---------------------------------------------------------------------------
// Assessment flow
// ---------------------------------------------------------------------------

test.describe('Assessment flow', () => {
  test('completes full assessment: 6 questions, contact form, sees score', async ({
    page,
  }) => {
    await page.goto('/assessment', { waitUntil: 'domcontentloaded' })

    // Verify intro screen
    await expect(page.locator('text=AI-Ready')).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.locator('text=Start Assessment')).toBeVisible({
      timeout: 10_000,
    })

    // Click "Start Assessment"
    await page.click('button:has-text("Start Assessment")')

    // Answer 6 questions — click the first option for each
    for (let q = 1; q <= 6; q++) {
      // Wait for the question screen to appear (progress indicator shows "X of 6")
      await expect(page.locator(`text=${q} of 6`)).toBeVisible({
        timeout: 10_000,
      })

      // Click the first option (value=1) for each question
      const options = page.locator(
        'button.w-full.text-left'
      )
      await options.first().click()

      // Wait briefly for the selection to register
      await page.waitForTimeout(300)

      // Click Next (or "See Results" on the last question)
      if (q < 6) {
        await page.click('button:has-text("Next")')
      } else {
        await page.click('button:has-text("See Results")')
      }
    }

    // Now we should be on the contact form step
    await expect(page.locator('text=Your Score is Ready')).toBeVisible({
      timeout: 10_000,
    })

    // Fill in the contact form
    await page
      .locator('input[placeholder="Jane Smith"]')
      .fill('Assessment Tester')
    await page
      .locator('input[placeholder="jane@company.com"]')
      .fill('assess@test.com')
    await page.locator('input[placeholder="Acme Inc"]').fill('Test Company')
    await page
      .locator('input[placeholder="VP Operations"]')
      .fill('Test Role')

    // Intercept the API call
    await page.route('/api/leads', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [{ id: 'test-assess' }] }),
      })
    })

    // Submit
    await page.click('button:has-text("Get My Score")')

    // Verify results screen shows a score
    await expect(page.locator('text=Dimension Breakdown')).toBeVisible({
      timeout: 10_000,
    })

    // The score circle should show a number out of 100
    await expect(page.locator('text=/100')).toBeVisible()

    // Should show one of the score labels
    const scoreLabels = [
      'AI-Ready Leader',
      'AI-Prepared',
      'AI-Emerging',
      'AI-Exploring',
    ]
    const bodyText = await page.locator('body').textContent()
    const hasScoreLabel = scoreLabels.some((label) =>
      bodyText?.includes(label)
    )
    expect(hasScoreLabel).toBe(true)
  })

  test('back button works during assessment', async ({ page }) => {
    await page.goto('/assessment', { waitUntil: 'domcontentloaded' })

    await page.click('button:has-text("Start Assessment")')

    // On question 1
    await expect(page.locator('text=1 of 6')).toBeVisible({ timeout: 10_000 })

    // Select first option and go to next
    await page.locator('button.w-full.text-left').first().click()
    await page.waitForTimeout(300)
    await page.click('button:has-text("Next")')

    // On question 2
    await expect(page.locator('text=2 of 6')).toBeVisible({ timeout: 10_000 })

    // Click Back
    await page.click('button:has-text("Back")')

    // Should be back on question 1
    await expect(page.locator('text=1 of 6')).toBeVisible({ timeout: 10_000 })
  })
})
