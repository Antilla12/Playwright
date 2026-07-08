# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: waiting.spec.js >> wait for an element to appear
- Location: tests/waiting.spec.js:32:5

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
  3   | test('BAD practice - hardcoded wait (never do this)', async ({ page }) => {
  4   |   await page.goto('https://www.saucedemo.com');
  5   | 
  6   |   await page.locator('#user-name').fill('standard_user');
  7   |   await page.locator('#password').fill('secret_sauce');
  8   |   await page.locator('#login-button').click();
  9   | 
  10  |   // BAD: just guessing 2 seconds is enough
  11  |   // too short = flaky, too long = slow
  12  |   await page.waitForTimeout(2000);
  13  | 
  14  |   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  15  |   console.log('BAD: used hardcoded wait');
  16  | });
  17  | 
  18  | test('GOOD practice - wait for URL to change', async ({ page }) => {
  19  |   await page.goto('https://www.saucedemo.com');
  20  | 
  21  |   await page.locator('#user-name').fill('standard_user');
  22  |   await page.locator('#password').fill('secret_sauce');
  23  |   await page.locator('#login-button').click();
  24  | 
  25  |   // GOOD: wait for exactly what you need
  26  |   await page.waitForURL('https://www.saucedemo.com/inventory.html');
  27  | 
  28  |   await expect(page.locator('.title')).toHaveText('Products');
  29  |   console.log('GOOD: waited for URL change');
  30  | });
  31  | 
  32  | test('wait for an element to appear', async ({ page }) => {
  33  |   await page.goto('https://www.saucedemo.com/inventory.html');
  34  | 
  35  |   // wait for a specific element to be visible before interacting
> 36  |   await page.waitForSelector('.inventory_item');
      |              ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  37  | 
  38  |   const items = page.locator('.inventory_item');
  39  |   await expect(items).toHaveCount(6);
  40  |   console.log('Waited for inventory items to appear!');
  41  | });
  42  | 
  43  | test('wait for element to be visible', async ({ page }) => {
  44  |   await page.goto('https://www.saucedemo.com');
  45  | 
  46  |   await page.locator('#user-name').fill('standard_user');
  47  |   await page.locator('#password').fill('secret_sauce');
  48  |   await page.locator('#login-button').click();
  49  | 
  50  |   // wait for cart icon to be visible after login
  51  |   const cartIcon = page.locator('.shopping_cart_link');
  52  |   await cartIcon.waitFor({ state: 'visible' });
  53  | 
  54  |   await expect(cartIcon).toBeVisible();
  55  |   console.log('Waited for cart icon to be visible!');
  56  | });
  57  | 
  58  | test('wait for element to be hidden', async ({ page }) => {
  59  |   await page.goto('https://www.saucedemo.com');
  60  | 
  61  |   // error message should not be visible initially
  62  |   const errorMessage = page.locator('[data-test="error"]');
  63  |   await errorMessage.waitFor({ state: 'hidden' });
  64  | 
  65  |   await expect(errorMessage).toBeHidden();
  66  |   console.log('Confirmed error message is hidden!');
  67  | });
  68  | 
  69  | test('wait for network request to complete', async ({ page }) => {
  70  |   // wait for all network requests to finish before checking
  71  |   await page.goto('https://www.saucedemo.com', {
  72  |     waitUntil: 'networkidle', // wait until no network requests for 500ms
  73  |   });
  74  | 
  75  |   await expect(page).toHaveTitle(/Swag Labs/);
  76  |   console.log('Page fully loaded with no pending network requests!');
  77  | });
  78  | 
  79  | test('wait for a function to return true', async ({ page }) => {
  80  |   await page.goto('https://www.saucedemo.com/inventory.html');
  81  | 
  82  |   // wait until there are exactly 6 items on the page
  83  |   await page.waitForFunction(() => {
  84  |     const items = document.querySelectorAll('.inventory_item');
  85  |     return items.length === 6;
  86  |   });
  87  | 
  88  |   console.log('Page has exactly 6 items!');
  89  |   await expect(page.locator('.inventory_item')).toHaveCount(6);
  90  | });
  91  | 
  92  | test('automatic waiting - built into Playwright', async ({ page }) => {
  93  |   await page.goto('https://www.saucedemo.com');
  94  | 
  95  |   // Playwright AUTOMATICALLY waits for these conditions before acting:
  96  |   // - element is visible
  97  |   // - element is enabled
  98  |   // - element is stable (not animating)
  99  |   // - element is in viewport
  100 |   // you don't need to add any extra waits for these!
  101 | 
  102 |   await page.locator('#user-name').fill('standard_user'); // auto-waits
  103 |   await page.locator('#password').fill('secret_sauce');   // auto-waits
  104 |   await page.locator('#login-button').click();            // auto-waits
  105 | 
  106 |   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  107 |   console.log('Playwright handled all waiting automatically!');
  108 | });
```