import { test, expect } from '../support/fixtures';

// Minimal smoke: verifies the app serves and basic UI is reachable.
// BASE_URL comes from playwright.config (defaults http://localhost:3000).

test.describe('Smoke', () => {
  test('app serves homepage', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/http:\/\/localhost:3000\/.*/);
  });
});
