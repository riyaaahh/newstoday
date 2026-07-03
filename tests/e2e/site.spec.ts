import { expect, test } from '@playwright/test'

// These tests assume the dev database has been seeded (scripts/seed.ts):
// a published Malayalam article at /keralam/kerala-mazha-sakthamayi (breaking).

test.describe('Home & navigation', () => {
  test('Malayalam home renders with a lead story', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'ml')
    await expect(page.locator('.brand').first()).toBeVisible()
    await expect(page.locator('.card-lead')).toBeVisible()
  })

  test('language switcher goes to the English edition', async ({ page }) => {
    await page.goto('/')
    await page.locator('.lang-switch').click()
    await expect(page).toHaveURL(/\/en$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('videos hub loads', async ({ page }) => {
    await page.goto('/videos')
    await expect(page.locator('h1.page-title')).toBeVisible()
  })

  test('privacy page loads and is linked from the footer', async ({ page }) => {
    await page.goto('/')
    await page.locator('.footer-link').click()
    await expect(page).toHaveURL(/\/privacy$/)
    await expect(page.locator('h1.article-title')).toBeVisible()
  })
})

test.describe('Article', () => {
  test('renders title, share buttons, and comments', async ({ page }) => {
    await page.goto('/keralam/kerala-mazha-sakthamayi')
    await expect(page.locator('h1.article-title')).toContainText('കേരള')
    await expect(page.locator('.share')).toBeVisible()
    await expect(page.locator('.comments')).toBeVisible()
    await expect(page.locator('.comment-form')).toBeVisible()
  })
})

test.describe('Search', () => {
  test('header search returns matching articles', async ({ page }) => {
    await page.goto('/')
    const input = page.locator('.search-box input[name="q"]')
    await input.fill('മഴ')
    await input.press('Enter')
    await expect(page).toHaveURL(/\/search\?q=/)
    await expect(page.locator('.grid .card').first()).toBeVisible()
  })
})

test.describe('Breaking banner', () => {
  test('shows and can be dismissed', async ({ page }) => {
    await page.goto('/')
    const banner = page.locator('.breaking')
    await expect(banner).toBeVisible()
    await banner.locator('.breaking-close').click()
    await expect(banner).toHaveCount(0)
  })
})

test.describe('Newsletter', () => {
  test('signup shows a confirmation', async ({ page }) => {
    await page.goto('/')
    const form = page.locator('.newsletter-form')
    await form.locator('input[type="email"]').fill('pwtest@example.com')
    await form.locator('button[type="submit"]').click()
    await expect(page.locator('.newsletter-done')).toBeVisible()
  })
})
