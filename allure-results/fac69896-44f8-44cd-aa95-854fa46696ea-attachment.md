# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.js >> login page visual check
- Location: tests/visual.spec.js:7:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  34 pixels (ratio 0.01 of all image pixels) are different.

  Snapshot: login-page.png

Call log:
  - Expect "toHaveScreenshot(login-page.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 34 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 34 pixels (ratio 0.01 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - generic [ref=e5]:
    - generic [ref=e9]:
      - textbox "Username" [ref=e11]
      - textbox "Password" [ref=e13]
      - button "Login" [ref=e15] [cursor=pointer]
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "Accepted usernames are:" [level=4] [ref=e19]
        - text: standard_user
        - text: locked_out_user
        - text: problem_user
        - text: performance_glitch_user
        - text: error_user
        - text: visual_user
      - generic [ref=e20]:
        - heading "Password for all users:" [level=4] [ref=e21]
        - text: secret_sauce
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // skip visual tests on mobile browsers
  4  | // mobile visual testing needs separate baseline screenshots per device
  5  | test.skip(({ isMobile }) => isMobile, 'Visual tests run on desktop only');
  6  | 
  7  | test('login page visual check', async ({ page }) => {
  8  |   await page.goto('https://www.saucedemo.com');
> 9  |   await expect(page).toHaveScreenshot('login-page.png');
     |                      ^ Error: expect(page).toHaveScreenshot(expected) failed
  10 | });
  11 | 
  12 | test('inventory page visual check', async ({ page }) => {
  13 |   await page.goto('https://www.saucedemo.com');
  14 |   await page.locator('#user-name').fill('standard_user');
  15 |   await page.locator('#password').fill('secret_sauce');
  16 |   await page.locator('#login-button').click();
  17 |   await expect(page).toHaveScreenshot('inventory-page.png');
  18 | });
```