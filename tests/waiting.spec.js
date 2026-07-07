import { test, expect } from '@playwright/test';

test('BAD practice - hardcoded wait (never do this)', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // BAD: just guessing 2 seconds is enough
  // too short = flaky, too long = slow
  await page.waitForTimeout(2000);

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  console.log('BAD: used hardcoded wait');
});

test('GOOD practice - wait for URL to change', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // GOOD: wait for exactly what you need
  await page.waitForURL('https://www.saucedemo.com/inventory.html');

  await expect(page.locator('.title')).toHaveText('Products');
  console.log('GOOD: waited for URL change');
});

test('wait for an element to appear', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  // wait for a specific element to be visible before interacting
  await page.waitForSelector('.inventory_item');

  const items = page.locator('.inventory_item');
  await expect(items).toHaveCount(6);
  console.log('Waited for inventory items to appear!');
});

test('wait for element to be visible', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // wait for cart icon to be visible after login
  const cartIcon = page.locator('.shopping_cart_link');
  await cartIcon.waitFor({ state: 'visible' });

  await expect(cartIcon).toBeVisible();
  console.log('Waited for cart icon to be visible!');
});

test('wait for element to be hidden', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // error message should not be visible initially
  const errorMessage = page.locator('[data-test="error"]');
  await errorMessage.waitFor({ state: 'hidden' });

  await expect(errorMessage).toBeHidden();
  console.log('Confirmed error message is hidden!');
});

test('wait for network request to complete', async ({ page }) => {
  // wait for all network requests to finish before checking
  await page.goto('https://www.saucedemo.com', {
    waitUntil: 'networkidle', // wait until no network requests for 500ms
  });

  await expect(page).toHaveTitle(/Swag Labs/);
  console.log('Page fully loaded with no pending network requests!');
});

test('wait for a function to return true', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  // wait until there are exactly 6 items on the page
  await page.waitForFunction(() => {
    const items = document.querySelectorAll('.inventory_item');
    return items.length === 6;
  });

  console.log('Page has exactly 6 items!');
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('automatic waiting - built into Playwright', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // Playwright AUTOMATICALLY waits for these conditions before acting:
  // - element is visible
  // - element is enabled
  // - element is stable (not animating)
  // - element is in viewport
  // you don't need to add any extra waits for these!

  await page.locator('#user-name').fill('standard_user'); // auto-waits
  await page.locator('#password').fill('secret_sauce');   // auto-waits
  await page.locator('#login-button').click();            // auto-waits

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  console.log('Playwright handled all waiting automatically!');
});