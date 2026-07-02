import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // login once
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // save the login state (cookies, localStorage, etc.) to a file
  await page.context().storageState({ path: 'auth.json' });

  await browser.close();
}

export default globalSetup;