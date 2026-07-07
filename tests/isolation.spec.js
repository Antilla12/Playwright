import { test, expect } from '@playwright/test';

// BAD EXAMPLE - tests that depend on each other
// (just for demonstration - never do this in real projects)
test.describe('BAD - tests that share state', () => {
  test('step 1 - add item to cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    console.log('BAD step 1: added item to cart');
    // problem: next test assumes cart has 1 item
    // but if THIS test fails, the next test will also fail
  });

  test('step 2 - depends on step 1 having run first', async ({ page }) => {
    // BAD: this test assumes the previous test already ran
    // if tests run in different order this will fail
    await page.goto('https://www.saucedemo.com/inventory.html');
    console.log('BAD step 2: assuming cart already has item from step 1');
  });
});

// GOOD EXAMPLE - each test is fully independent
test.describe('GOOD - fully isolated tests', () => {
  // runs before EACH test in this describe block
  test.beforeEach(async ({ page }) => {
    // always start fresh from login
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await page.waitForURL('https://www.saucedemo.com/inventory.html');
    console.log('beforeEach: fresh login done');
  });

  // runs after EACH test to clean up
  test.afterEach(async ({ page }) => {
    // reset cart after every test
    await page.goto('https://www.saucedemo.com/cart.html');
    const removeButtons = page.locator('[data-test^="remove"]');
    const count = await removeButtons.count();
    for (let i = 0; i < count; i++) {
      await removeButtons.first().click();
    }
    console.log(`afterEach: removed ${count} items from cart`);
  });

  test('test A - add first item to cart', async ({ page }) => {
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    console.log('GOOD test A: cart has 1 item');
  });

  test('test B - cart starts empty regardless of test A', async ({ page }) => {
    // this test doesn't care what test A did
    // beforeEach guarantees a fresh state every time
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveCount(0);
    console.log('GOOD test B: cart is empty as expected');
  });

  test('test C - add multiple items', async ({ page }) => {
    const addButtons = page.locator('.btn_inventory');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    await addButtons.nth(2).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
    console.log('GOOD test C: cart has 3 items');
  });

  test('test D - cart still starts empty', async ({ page }) => {
    // afterEach from test C cleaned up the 3 items
    // so this test starts fresh again
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveCount(0);
    console.log('GOOD test D: cart is empty even after test C added 3 items');
  });
});

// GOOD EXAMPLE - using test.describe with isolated storage state
test.describe('GOOD - overriding storage state per describe block', () => {
  // override the global auth state for this block
  test.use({ storageState: { cookies: [], origins: [] } });

  test('starts completely logged out', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    // should redirect to login since we cleared auth state
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    console.log('GOOD: confirmed fresh state with no auth');
  });
});