import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('exposes Hero 4 Gotham metadata without template branding', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const title = await page.title()

    expect(title).not.toContain('Payload Website Template')
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      title,
    )
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      'Hero 4 Gotham',
    )
    await expect(page.locator('meta[name="twitter:creator"]')).toHaveCount(0)
  })
})
