# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile.spec.js >> products are visible on mobile
- Location: tests/mobile.spec.js:30:5

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
  3  | test('login page works on mobile', async ({ page }) => {
  4  |   await page.goto('https://www.saucedemo.com');
  5  | 
  6  |   // check page title
  7  |   await expect(page).toHaveTitle(/Swag Labs/);
  8  | 
  9  |   // check login form is visible on mobile
  10 |   await expect(page.locator('#user-name')).toBeVisible();
  11 |   await expect(page.locator('#password')).toBeVisible();
  12 |   await expect(page.locator('#login-button')).toBeVisible();
  13 | 
  14 |   // log viewport size
  15 |   const viewportSize = page.viewportSize();
  16 |   console.log(`Viewport: ${viewportSize.width}x${viewportSize.height}`);
  17 | });
  18 | 
  19 | test('can login on mobile', async ({ page }) => {
  20 |   await page.goto('https://www.saucedemo.com');
  21 | 
  22 |   await page.locator('#user-name').fill('standard_user');
  23 |   await page.locator('#password').fill('secret_sauce');
  24 |   await page.locator('#login-button').click();
  25 | 
  26 |   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  27 |   console.log('Mobile login successful!');
  28 | });
  29 | 
  30 | test('products are visible on mobile', async ({ page }) => {
  31 |   await page.goto('https://www.saucedemo.com/inventory.html');
  32 | 
  33 |   // check products load on mobile
  34 |   const products = page.locator('.inventory_item');
> 35 |   await expect(products).toHaveCount(6);
     |                          ^ Error: expect(locator).toHaveCount(expected) failed
  36 | 
  37 |   // check add to cart works on mobile
  38 |   await page.locator('.btn_inventory').first().click();
  39 |   await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  40 | 
  41 |   console.log('Mobile products and cart working!');
  42 | });
```