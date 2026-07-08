# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: keyboard.spec.js >> hover over an element
- Location: tests/keyboard.spec.js:54:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.hover: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.inventory_item').first()

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
  3   | test('keyboard shortcuts', async ({ page }) => {
  4   |   await page.goto('https://www.saucedemo.com/inventory.html');
  5   | 
  6   |   // press Tab to move focus between elements
  7   |   await page.keyboard.press('Tab');
  8   |   await page.keyboard.press('Tab');
  9   |   await page.keyboard.press('Tab');
  10  | 
  11  |   // press Enter to activate focused element
  12  |   await page.keyboard.press('Enter');
  13  | 
  14  |   console.log('Keyboard navigation completed!');
  15  | });
  16  | 
  17  | test('type using keyboard', async ({ page }) => {
  18  |   await page.goto('https://www.saucedemo.com');
  19  | 
  20  |   // click username field
  21  |   await page.locator('#user-name').click();
  22  | 
  23  |   // type character by character (simulates real user typing)
  24  |   await page.keyboard.type('standard_user', { delay: 50 });
  25  | 
  26  |   // move to password field using Tab
  27  |   await page.keyboard.press('Tab');
  28  | 
  29  |   // type password
  30  |   await page.keyboard.type('secret_sauce', { delay: 50 });
  31  | 
  32  |   // submit form using Enter instead of clicking button
  33  |   await page.keyboard.press('Enter');
  34  | 
  35  |   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  36  |   console.log('Logged in using keyboard only!');
  37  | });
  38  | 
  39  | test('select all and clear text', async ({ page }) => {
  40  |   await page.goto('https://www.saucedemo.com');
  41  | 
  42  |   const usernameField = page.locator('#user-name');
  43  |   await usernameField.fill('some existing text');
  44  | 
  45  |   // select all text and delete it
  46  |   await usernameField.click();
  47  |   await page.keyboard.press('Control+a');
  48  |   await page.keyboard.press('Delete');
  49  | 
  50  |   await expect(usernameField).toHaveValue('');
  51  |   console.log('Text cleared using keyboard!');
  52  | });
  53  | 
  54  | test('hover over an element', async ({ page }) => {
  55  |   await page.goto('https://www.saucedemo.com/inventory.html');
  56  | 
  57  |   // hover over the first product image
  58  |   const firstProduct = page.locator('.inventory_item').first();
> 59  |   await firstProduct.hover();
      |                      ^ Error: locator.hover: Test timeout of 30000ms exceeded.
  60  | 
  61  |   console.log('Hovered over first product!');
  62  | 
  63  |   // verify element is still visible after hover
  64  |   await expect(firstProduct).toBeVisible();
  65  | });
  66  | 
  67  | test('double click an element', async ({ page }) => {
  68  |   await page.goto('https://www.saucedemo.com');
  69  | 
  70  |   const usernameField = page.locator('#user-name');
  71  |   await usernameField.fill('hello world');
  72  | 
  73  |   // double click selects the word
  74  |   await usernameField.dblclick();
  75  | 
  76  |   console.log('Double clicked username field!');
  77  |   await expect(usernameField).toBeVisible();
  78  | });
  79  | 
  80  | test('right click an element', async ({ page }) => {
  81  |   await page.goto('https://www.saucedemo.com/inventory.html');
  82  | 
  83  |   const firstProduct = page.locator('.inventory_item').first();
  84  | 
  85  |   // right click opens context menu
  86  |   await firstProduct.click({ button: 'right' });
  87  | 
  88  |   console.log('Right clicked first product!');
  89  |   await expect(firstProduct).toBeVisible();
  90  | });
  91  | 
  92  | test('hold shift and click', async ({ page }) => {
  93  |   await page.goto('https://www.saucedemo.com');
  94  | 
  95  |   const loginButton = page.locator('#login-button');
  96  | 
  97  |   // shift+click (useful for multi-select scenarios)
  98  |   await loginButton.click({ modifiers: ['Shift'] });
  99  | 
  100 |   console.log('Shift clicked login button!');
  101 | });
  102 | 
  103 | test('use keyboard to fill form and submit', async ({ page }) => {
  104 |   await page.goto('https://www.saucedemo.com');
  105 | 
  106 |   // fill entire form using only keyboard
  107 |   await page.locator('#user-name').focus();
  108 |   await page.keyboard.type('standard_user');
  109 |   await page.keyboard.press('Tab');
  110 |   await page.keyboard.type('secret_sauce');
  111 |   await page.keyboard.press('Tab');
  112 |   await page.keyboard.press('Space'); // space activates buttons
  113 | 
  114 |   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  115 |   console.log('Form submitted using keyboard only!');
  116 | });
```