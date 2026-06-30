import { test, expect } from '@playwright/test';

test('take a screenshot manually', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.screenshot({ path: 'screenshots/login-page.png' });
  await expect(page).toHaveTitle(/Swag Labs/);
});

// changed test() to test.skip() so it doesn't break CI, but you can still
// remove .skip and run it manually anytime to see the failure report
test.skip('intentionally failing test to see auto-screenshot', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await expect(page).toHaveTitle(/Wrong Title/);
});