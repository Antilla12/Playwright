import { Given, When, Then } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';

let browser;
let page;

Given('I am logged in as {string}', async (username) => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill(username);
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForURL('https://www.saucedemo.com/inventory.html');
  console.log(`Logged in as ${username}`);
});

When('I add the first product to the cart', async () => {
  await page.locator('.btn_inventory').first().click();
  console.log('Added first product to cart');
});

When('I add the second product to the cart', async () => {
  // click the second product's add to cart button specifically
  await page.locator('.btn_inventory').nth(1).click();
  console.log('Added second product to cart');
});

When('I go to the cart page', async () => {
  await page.locator('.shopping_cart_link').click();
  await page.waitForURL('https://www.saucedemo.com/cart.html');
  console.log('Navigated to cart page');
});

When('I remove the first item from the cart', async () => {
  await page.locator('[data-test^="remove"]').first().click();
  console.log('Removed first item from cart');
});

When('I proceed to checkout', async () => {
  await page.locator('#checkout').click();
  await page.waitForURL('https://www.saucedemo.com/checkout-step-one.html');
  console.log('Proceeded to checkout');
});

When('I fill in my details {string} {string} {string}', async (firstName, lastName, zip) => {
  await page.locator('#first-name').fill(firstName);
  await page.locator('#last-name').fill(lastName);
  await page.locator('#postal-code').fill(zip);
  await page.locator('#continue').click();
  console.log(`Filled in details: ${firstName} ${lastName} ${zip}`);
});

When('I complete the order', async () => {
  await page.locator('#finish').click();
  await page.waitForURL('https://www.saucedemo.com/checkout-complete.html');
  console.log('Completed the order');
});

Then('the cart badge should show {string}', async (count) => {
  await expect(page.locator('.shopping_cart_badge')).toHaveText(count);
  console.log(`Cart badge shows ${count}`);
});

Then('the cart should be empty', async () => {
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(0);
  console.log('Cart is empty!');
});

Then('I should see the order confirmation', async () => {
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  console.log('Order confirmation shown!');
  await browser.close();
});