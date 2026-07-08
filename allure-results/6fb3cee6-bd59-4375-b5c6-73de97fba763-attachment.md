# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: network.spec.js >> compare load time with and without images
- Location: tests/network.spec.js:28:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.inventory_item')
Expected: 6
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.inventory_item')
    14 × locator resolved to 0 elements
       - unexpected value "0"

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('block images to speed up page load', async ({ page }) => {
  4  |   await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', route => route.abort());
  5  | 
  6  |   const start = Date.now();
  7  |   await page.goto('https://www.saucedemo.com/inventory.html');
  8  |   const duration = Date.now() - start;
  9  | 
  10 |   console.log(`Page loaded in ${duration}ms without images`);
  11 | 
  12 |   await expect(page.locator('.title')).toHaveText('Products');
  13 |   await expect(page.locator('.inventory_item')).toHaveCount(6);
  14 | });
  15 | 
  16 | test('block images and css to load even faster', async ({ page }) => {
  17 |   await page.route('**/*.{png,jpg,jpeg,gif,svg,webp,css}', route => route.abort());
  18 | 
  19 |   const start = Date.now();
  20 |   await page.goto('https://www.saucedemo.com/inventory.html');
  21 |   const duration = Date.now() - start;
  22 | 
  23 |   console.log(`Page loaded in ${duration}ms without images or CSS`);
  24 | 
  25 |   await expect(page.locator('.inventory_item')).toHaveCount(6);
  26 | });
  27 | 
  28 | test('compare load time with and without images', async ({ page }) => {
  29 |   // first load WITH images
  30 |   const start1 = Date.now();
  31 |   await page.goto('https://www.saucedemo.com/inventory.html');
  32 |   const withImages = Date.now() - start1;
  33 |   console.log(`With images: ${withImages}ms`);
  34 | 
  35 |   // now block images
  36 |   await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', route => route.abort());
  37 | 
  38 |   // reload WITHOUT images
  39 |   const start2 = Date.now();
  40 |   await page.reload();
  41 |   const withoutImages = Date.now() - start2;
  42 |   console.log(`Without images: ${withoutImages}ms`);
  43 | 
  44 |   console.log(`Time saved: ${withImages - withoutImages}ms`);
  45 | 
  46 |   // just log results — timing comparisons are unreliable due to caching
  47 |   // the important thing is both loads complete successfully
> 48 |   await expect(page.locator('.inventory_item')).toHaveCount(6);
     |                                                 ^ Error: expect(locator).toHaveCount(expected) failed
  49 | });
  50 | 
  51 | test('intercept and modify a request', async ({ page }) => {
  52 |   // intercept and return our own data directly (works on all browsers)
  53 |   await page.route('**/posts/1', async route => {
  54 |     await route.fulfill({
  55 |       status: 200,
  56 |       contentType: 'application/json',
  57 |       body: JSON.stringify({
  58 |         id: 1,
  59 |         title: 'INTERCEPTED AND MODIFIED',
  60 |         body: 'This is fake data',
  61 |         userId: 1,
  62 |       }),
  63 |     });
  64 |   });
  65 | 
  66 |   const response = await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  67 |   const body = await response.json();
  68 | 
  69 |   expect(body.title).toBe('INTERCEPTED AND MODIFIED');
  70 |   console.log('Modified title:', body.title);
  71 | });
  72 | 
  73 | test('log all network requests', async ({ page }) => {
  74 |   const requests = [];
  75 | 
  76 |   page.on('request', request => {
  77 |     requests.push({
  78 |       url: request.url(),
  79 |       method: request.method(),
  80 |     });
  81 |   });
  82 | 
  83 |   await page.goto('https://www.saucedemo.com');
  84 | 
  85 |   console.log(`\nTotal requests made: ${requests.length}`);
  86 |   console.log('First 5 requests:');
  87 |   requests.slice(0, 5).forEach(r => {
  88 |     console.log(`  ${r.method} ${r.url}`);
  89 |   });
  90 | 
  91 |   expect(requests.length).toBeGreaterThan(0);
  92 | });
```