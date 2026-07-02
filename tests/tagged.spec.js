import { test, expect } from '@playwright/test';

test('login page loads @smoke', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('valid login works @smoke @regression', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('invalid login shows error @regression', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('wrong_user');
  await page.locator('#password').fill('wrong_password');
  await page.locator('#login-button').click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});

test('add to cart works @regression', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.locator('.btn_inventory').first().click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('fetch posts API @api', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  expect(response.status()).toBe(200);
});