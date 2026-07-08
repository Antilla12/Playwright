import { test, expect } from '@playwright/test';

test('measure page load time', async ({ page }) => {
  test.setTimeout(60000); // give webkit extra time to start up

  const start = Date.now();
  await page.goto('https://www.saucedemo.com');
  const loadTime = Date.now() - start;

  console.log(`Page load time: ${loadTime}ms`);
  expect(loadTime).toBeLessThan(5000);
});

test('measure time to interact', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // measure how long login takes
  const start = Date.now();
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForURL('https://www.saucedemo.com/inventory.html');
  const loginTime = Date.now() - start;

  console.log(`Login flow time: ${loginTime}ms`);
  expect(loginTime).toBeLessThan(5000);
});

test('measure inventory page load time', async ({ page }) => {
  const start = Date.now();
  await page.goto('https://www.saucedemo.com/inventory.html');

  // wait for all products to load
  await page.waitForSelector('.inventory_item');
  const loadTime = Date.now() - start;

  console.log(`Inventory page load time: ${loadTime}ms`);
  expect(loadTime).toBeLessThan(5000);
});

test('use performance API to get detailed metrics', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // get performance metrics directly from the browser
  const metrics = await page.evaluate(() => {
    const timing = performance.timing;
    return {
      // total page load time
      pageLoad: timing.loadEventEnd - timing.navigationStart,
      // time until DOM is ready
      domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
      // time until first byte received from server
      ttfb: timing.responseStart - timing.navigationStart,
      // time to parse and load DOM
      domParsing: timing.domComplete - timing.domLoading,
    };
  });

  console.log('Performance metrics:');
  console.log(`  Page load:   ${metrics.pageLoad}ms`);
  console.log(`  DOM ready:   ${metrics.domReady}ms`);
  console.log(`  TTFB:        ${metrics.ttfb}ms`);
  console.log(`  DOM parsing: ${metrics.domParsing}ms`);

  // assert each metric is within acceptable range
  expect(metrics.pageLoad).toBeLessThan(10000);
  expect(metrics.domReady).toBeLessThan(8000);
  expect(metrics.ttfb).toBeLessThan(3000);
});

test('compare performance before and after login', async ({ page }) => {
  // measure login page load
  const start1 = Date.now();
  await page.goto('https://www.saucedemo.com');
  const loginPageLoad = Date.now() - start1;

  // login
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // measure inventory page load
  const start2 = Date.now();
  await page.waitForURL('https://www.saucedemo.com/inventory.html');
  await page.waitForSelector('.inventory_item');
  const inventoryPageLoad = Date.now() - start2;

  console.log(`Login page load:     ${loginPageLoad}ms`);
  console.log(`Inventory page load: ${inventoryPageLoad}ms`);
  console.log(`Difference:          ${Math.abs(loginPageLoad - inventoryPageLoad)}ms`);

  expect(loginPageLoad).toBeLessThan(5000);
  expect(inventoryPageLoad).toBeLessThan(5000);
});

test('measure checkout flow performance', async ({ page }) => {
  const timings = {};

  // measure each step of checkout
  let start = Date.now();
  await page.goto('https://www.saucedemo.com/inventory.html');
  timings.inventoryLoad = Date.now() - start;

  start = Date.now();
  await page.locator('.btn_inventory').first().click();
  await page.locator('.shopping_cart_link').click();
  await page.waitForURL('https://www.saucedemo.com/cart.html');
  timings.cartLoad = Date.now() - start;

  start = Date.now();
  await page.locator('#checkout').click();
  await page.waitForURL('https://www.saucedemo.com/checkout-step-one.html');
  timings.checkoutLoad = Date.now() - start;

  start = Date.now();
  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Doe');
  await page.locator('#postal-code').fill('12345');
  await page.locator('#continue').click();
  await page.waitForURL('https://www.saucedemo.com/checkout-step-two.html');
  timings.summaryLoad = Date.now() - start;

  start = Date.now();
  await page.locator('#finish').click();
  await page.waitForURL('https://www.saucedemo.com/checkout-complete.html');
  timings.completeLoad = Date.now() - start;

  console.log('Checkout flow timings:');
  console.log(`  Inventory:  ${timings.inventoryLoad}ms`);
  console.log(`  Cart:       ${timings.cartLoad}ms`);
  console.log(`  Checkout:   ${timings.checkoutLoad}ms`);
  console.log(`  Summary:    ${timings.summaryLoad}ms`);
  console.log(`  Complete:   ${timings.completeLoad}ms`);
  console.log(`  Total:      ${Object.values(timings).reduce((a, b) => a + b, 0)}ms`);

  // each step should complete within 3 seconds
  Object.entries(timings).forEach(([step, time]) => {
    expect(time, `${step} took too long`).toBeLessThan(3000);
  });
});