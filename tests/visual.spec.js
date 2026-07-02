import { test, expect } from '@playwright/test';

// skip visual tests on mobile browsers
// mobile visual testing needs separate baseline screenshots per device
test.skip(({ isMobile }) => isMobile, 'Visual tests run on desktop only');

test('login page visual check', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveScreenshot('login-page.png');
});

test('inventory page visual check', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveScreenshot('inventory-page.png');
});