import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';

let browser;
let page;

Before(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
});

After(async () => {
  await browser.close();
});

Given('I am on the login page', async () => {
  await page.goto('https://www.saucedemo.com');
});

When('I enter username {string} and password {string}', async (username, password) => {
  await page.locator('#user-name').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#login-button').click();
});

Then('I should be redirected to the inventory page', async () => {
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  console.log('Successfully redirected to inventory page!');
});

Then('I should see an error message', async () => {
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  console.log('Error message is visible!');
});

Then('I should see the products title', async () => {
  await expect(page.locator('.title')).toHaveText('Products');
  console.log('Products title is visible!');
});

Then('I should see {string}', async (result) => {
  if (result === 'inventory') {
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    console.log('Redirected to inventory!');
  } else if (result === 'error') {
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    console.log('Error message shown!');
  }
});