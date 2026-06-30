import { test, expect } from '@playwright/test';

test('login with valid credentials', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  console.log('Valid login passed!');
});

test('login with invalid credentials', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.locator('#user-name').fill('wrong_user');
  await page.locator('#password').fill('wrong_password');
  await page.locator('#login-button').click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  console.log('Invalid login error shown!');
});

test('login with empty credentials', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.locator('#login-button').click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  console.log('Empty login error shown!');
});