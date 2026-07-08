# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-reuse.spec.js >> add to cart without logging in again
- Location: tests/auth-reuse.spec.js:12:5

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
  3  | // notice: no login steps at all — session is already saved!
  4  | test('access inventory page without logging in again', async ({ page }) => {
  5  |   await page.goto('https://www.saucedemo.com/inventory.html');
  6  | 
  7  |   // should go straight to inventory, not redirect to login
  8  |   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  9  |   await expect(page.locator('.title')).toHaveText('Products');
  10 | });
  11 | 
  12 | test('add to cart without logging in again', async ({ page }) => {
  13 |   await page.goto('https://www.saucedemo.com/inventory.html');
  14 | 
> 15 |   await page.locator('.btn_inventory').first().click();
     |                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  16 |   await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  17 | });
```