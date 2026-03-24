import { test, expect } from '@playwright/test';

// ── home page e2e tests ────────────────────────────────────────────────────
test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/demo-app/i);
  });

  test('renders welcome heading', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('uses dark theme by default', async ({ page }) => {
    const body = page.locator('body');
    const bg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    // Dark background should be very dark
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });
});
