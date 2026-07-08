# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance.spec.js >> measure inventory page load time
- Location: tests/performance.spec.js:29:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.inventory_item') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - generic [ref=e5]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - textbox "Username" [ref=e11]
        - img [ref=e12]
      - generic [ref=e14]:
        - textbox "Password" [ref=e15]
        - img [ref=e16]
      - 'heading "Epic sadface: You can only access ''/inventory.html'' when you are logged in." [level=3] [ref=e19]':
        - button [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - text: "Epic sadface: You can only access '/inventory.html' when you are logged in."
      - button "Login" [ref=e23] [cursor=pointer]
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "Accepted usernames are:" [level=4] [ref=e27]
        - text: standard_user
        - text: locked_out_user
        - text: problem_user
        - text: performance_glitch_user
        - text: error_user
        - text: visual_user
      - generic [ref=e28]:
        - heading "Password for all users:" [level=4] [ref=e29]
        - text: secret_sauce
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test('measure page load time', async ({ page }) => {
  4   |   test.setTimeout(60000); // give webkit extra time to start up
  5   | 
  6   |   const start = Date.now();
  7   |   await page.goto('https://www.saucedemo.com');
  8   |   const loadTime = Date.now() - start;
  9   | 
  10  |   console.log(`Page load time: ${loadTime}ms`);
  11  |   expect(loadTime).toBeLessThan(5000);
  12  | });
  13  | 
  14  | test('measure time to interact', async ({ page }) => {
  15  |   await page.goto('https://www.saucedemo.com');
  16  | 
  17  |   // measure how long login takes
  18  |   const start = Date.now();
  19  |   await page.locator('#user-name').fill('standard_user');
  20  |   await page.locator('#password').fill('secret_sauce');
  21  |   await page.locator('#login-button').click();
  22  |   await page.waitForURL('https://www.saucedemo.com/inventory.html');
  23  |   const loginTime = Date.now() - start;
  24  | 
  25  |   console.log(`Login flow time: ${loginTime}ms`);
  26  |   expect(loginTime).toBeLessThan(5000);
  27  | });
  28  | 
  29  | test('measure inventory page load time', async ({ page }) => {
  30  |   const start = Date.now();
  31  |   await page.goto('https://www.saucedemo.com/inventory.html');
  32  | 
  33  |   // wait for all products to load
> 34  |   await page.waitForSelector('.inventory_item');
      |              ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  35  |   const loadTime = Date.now() - start;
  36  | 
  37  |   console.log(`Inventory page load time: ${loadTime}ms`);
  38  |   expect(loadTime).toBeLessThan(5000);
  39  | });
  40  | 
  41  | test('use performance API to get detailed metrics', async ({ page }) => {
  42  |   await page.goto('https://www.saucedemo.com');
  43  | 
  44  |   // get performance metrics directly from the browser
  45  |   const metrics = await page.evaluate(() => {
  46  |     const timing = performance.timing;
  47  |     return {
  48  |       // total page load time
  49  |       pageLoad: timing.loadEventEnd - timing.navigationStart,
  50  |       // time until DOM is ready
  51  |       domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
  52  |       // time until first byte received from server
  53  |       ttfb: timing.responseStart - timing.navigationStart,
  54  |       // time to parse and load DOM
  55  |       domParsing: timing.domComplete - timing.domLoading,
  56  |     };
  57  |   });
  58  | 
  59  |   console.log('Performance metrics:');
  60  |   console.log(`  Page load:   ${metrics.pageLoad}ms`);
  61  |   console.log(`  DOM ready:   ${metrics.domReady}ms`);
  62  |   console.log(`  TTFB:        ${metrics.ttfb}ms`);
  63  |   console.log(`  DOM parsing: ${metrics.domParsing}ms`);
  64  | 
  65  |   // assert each metric is within acceptable range
  66  |   expect(metrics.pageLoad).toBeLessThan(10000);
  67  |   expect(metrics.domReady).toBeLessThan(8000);
  68  |   expect(metrics.ttfb).toBeLessThan(3000);
  69  | });
  70  | 
  71  | test('compare performance before and after login', async ({ page }) => {
  72  |   // measure login page load
  73  |   const start1 = Date.now();
  74  |   await page.goto('https://www.saucedemo.com');
  75  |   const loginPageLoad = Date.now() - start1;
  76  | 
  77  |   // login
  78  |   await page.locator('#user-name').fill('standard_user');
  79  |   await page.locator('#password').fill('secret_sauce');
  80  |   await page.locator('#login-button').click();
  81  | 
  82  |   // measure inventory page load
  83  |   const start2 = Date.now();
  84  |   await page.waitForURL('https://www.saucedemo.com/inventory.html');
  85  |   await page.waitForSelector('.inventory_item');
  86  |   const inventoryPageLoad = Date.now() - start2;
  87  | 
  88  |   console.log(`Login page load:     ${loginPageLoad}ms`);
  89  |   console.log(`Inventory page load: ${inventoryPageLoad}ms`);
  90  |   console.log(`Difference:          ${Math.abs(loginPageLoad - inventoryPageLoad)}ms`);
  91  | 
  92  |   expect(loginPageLoad).toBeLessThan(5000);
  93  |   expect(inventoryPageLoad).toBeLessThan(5000);
  94  | });
  95  | 
  96  | test('measure checkout flow performance', async ({ page }) => {
  97  |   const timings = {};
  98  | 
  99  |   // measure each step of checkout
  100 |   let start = Date.now();
  101 |   await page.goto('https://www.saucedemo.com/inventory.html');
  102 |   timings.inventoryLoad = Date.now() - start;
  103 | 
  104 |   start = Date.now();
  105 |   await page.locator('.btn_inventory').first().click();
  106 |   await page.locator('.shopping_cart_link').click();
  107 |   await page.waitForURL('https://www.saucedemo.com/cart.html');
  108 |   timings.cartLoad = Date.now() - start;
  109 | 
  110 |   start = Date.now();
  111 |   await page.locator('#checkout').click();
  112 |   await page.waitForURL('https://www.saucedemo.com/checkout-step-one.html');
  113 |   timings.checkoutLoad = Date.now() - start;
  114 | 
  115 |   start = Date.now();
  116 |   await page.locator('#first-name').fill('John');
  117 |   await page.locator('#last-name').fill('Doe');
  118 |   await page.locator('#postal-code').fill('12345');
  119 |   await page.locator('#continue').click();
  120 |   await page.waitForURL('https://www.saucedemo.com/checkout-step-two.html');
  121 |   timings.summaryLoad = Date.now() - start;
  122 | 
  123 |   start = Date.now();
  124 |   await page.locator('#finish').click();
  125 |   await page.waitForURL('https://www.saucedemo.com/checkout-complete.html');
  126 |   timings.completeLoad = Date.now() - start;
  127 | 
  128 |   console.log('Checkout flow timings:');
  129 |   console.log(`  Inventory:  ${timings.inventoryLoad}ms`);
  130 |   console.log(`  Cart:       ${timings.cartLoad}ms`);
  131 |   console.log(`  Checkout:   ${timings.checkoutLoad}ms`);
  132 |   console.log(`  Summary:    ${timings.summaryLoad}ms`);
  133 |   console.log(`  Complete:   ${timings.completeLoad}ms`);
  134 |   console.log(`  Total:      ${Object.values(timings).reduce((a, b) => a + b, 0)}ms`);
```