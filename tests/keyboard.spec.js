import { test, expect } from '@playwright/test';

test('keyboard shortcuts', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  // press Tab to move focus between elements
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  // press Enter to activate focused element
  await page.keyboard.press('Enter');

  console.log('Keyboard navigation completed!');
});

test('type using keyboard', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // click username field
  await page.locator('#user-name').click();

  // type character by character (simulates real user typing)
  await page.keyboard.type('standard_user', { delay: 50 });

  // move to password field using Tab
  await page.keyboard.press('Tab');

  // type password
  await page.keyboard.type('secret_sauce', { delay: 50 });

  // submit form using Enter instead of clicking button
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  console.log('Logged in using keyboard only!');
});

test('select all and clear text', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const usernameField = page.locator('#user-name');
  await usernameField.fill('some existing text');

  // select all text and delete it
  await usernameField.click();
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Delete');

  await expect(usernameField).toHaveValue('');
  console.log('Text cleared using keyboard!');
});

test('hover over an element', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  // hover over the first product image
  const firstProduct = page.locator('.inventory_item').first();
  await firstProduct.hover();

  console.log('Hovered over first product!');

  // verify element is still visible after hover
  await expect(firstProduct).toBeVisible();
});

test('double click an element', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const usernameField = page.locator('#user-name');
  await usernameField.fill('hello world');

  // double click selects the word
  await usernameField.dblclick();

  console.log('Double clicked username field!');
  await expect(usernameField).toBeVisible();
});

test('right click an element', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');

  const firstProduct = page.locator('.inventory_item').first();

  // right click opens context menu
  await firstProduct.click({ button: 'right' });

  console.log('Right clicked first product!');
  await expect(firstProduct).toBeVisible();
});

test('hold shift and click', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const loginButton = page.locator('#login-button');

  // shift+click (useful for multi-select scenarios)
  await loginButton.click({ modifiers: ['Shift'] });

  console.log('Shift clicked login button!');
});

test('use keyboard to fill form and submit', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // fill entire form using only keyboard
  await page.locator('#user-name').focus();
  await page.keyboard.type('standard_user');
  await page.keyboard.press('Tab');
  await page.keyboard.type('secret_sauce');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space'); // space activates buttons

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  console.log('Form submitted using keyboard only!');
});