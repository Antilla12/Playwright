import { test, expect } from '@playwright/test';

// notice: no login steps at all — session is already saved!
test('access inventory page without logging in again', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  // should go straight to inventory, not redirect to login
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.title')).toHaveText('Products');
});

test('add to cart without logging in again', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  await page.locator('.btn_inventory').first().click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});