import { test, expect } from '@playwright/test';

test('login page works on mobile', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // check page title
  await expect(page).toHaveTitle(/Swag Labs/);

  // check login form is visible on mobile
  await expect(page.locator('#user-name')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.locator('#login-button')).toBeVisible();

  // log viewport size
  const viewportSize = page.viewportSize();
  console.log(`Viewport: ${viewportSize.width}x${viewportSize.height}`);
});

test('can login on mobile', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  console.log('Mobile login successful!');
});

test('products are visible on mobile', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  // check products load on mobile
  const products = page.locator('.inventory_item');
  await expect(products).toHaveCount(6);

  // check add to cart works on mobile
  await page.locator('.btn_inventory').first().click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  console.log('Mobile products and cart working!');
});