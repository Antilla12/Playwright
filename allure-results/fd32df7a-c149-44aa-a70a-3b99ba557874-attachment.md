# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tagged.spec.js >> add to cart works @regression
- Location: tests/tagged.spec.js:24:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.btn_inventory').first()

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
  3  | test('login page loads @smoke', async ({ page }) => {
  4  |   await page.goto('https://www.saucedemo.com');
  5  |   await expect(page).toHaveTitle(/Swag Labs/);
  6  | });
  7  | 
  8  | test('valid login works @smoke @regression', async ({ page }) => {
  9  |   await page.goto('https://www.saucedemo.com');
  10 |   await page.locator('#user-name').fill('standard_user');
  11 |   await page.locator('#password').fill('secret_sauce');
  12 |   await page.locator('#login-button').click();
  13 |   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  14 | });
  15 | 
  16 | test('invalid login shows error @regression', async ({ page }) => {
  17 |   await page.goto('https://www.saucedemo.com');
  18 |   await page.locator('#user-name').fill('wrong_user');
  19 |   await page.locator('#password').fill('wrong_password');
  20 |   await page.locator('#login-button').click();
  21 |   await expect(page.locator('[data-test="error"]')).toBeVisible();
  22 | });
  23 | 
  24 | test('add to cart works @regression', async ({ page }) => {
  25 |   await page.goto('https://www.saucedemo.com/inventory.html');
> 26 |   await page.locator('.btn_inventory').first().click();
     |                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  27 |   await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  28 | });
  29 | 
  30 | test('fetch posts API @api', async ({ request }) => {
  31 |   const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  32 |   expect(response.status()).toBe(200);
  33 | });
```