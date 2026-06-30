import { test, expect } from '@playwright/test';

test('take a screenshot manually', async ({ page }) => {
  await page.goto('https://saucedemo.com');

  // take a screenshot and save it
  await page.screenshot({ path: 'screenshots/login-page.png' });

  await expect(page).toHaveTitle(/Swag Labs/);
});

test('intentionally failing test to see auto-screenshot', async ({ page }) => {
  await page.goto('https://saucedemo.com');

  // this will fail on purpose so we can see what Playwright captures
  await expect(page).toHaveTitle(/Wrong Title/);
});