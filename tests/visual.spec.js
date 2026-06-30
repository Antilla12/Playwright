import { test, expect } from '@playwright/test';

test('login page visual check', async ({ page }) => {
  await page.goto('https://saucedemo.com');

  // takes a screenshot and compares it to a saved baseline
  await expect(page).toHaveScreenshot('login-page.png');
});

test('inventory page visual check', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveScreenshot('inventory-page.png');
});