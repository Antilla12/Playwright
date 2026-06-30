import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';

// our test data - an array of different users to try
const users = [
  { username: 'standard_user', password: 'secret_sauce', shouldSucceed: true },
  { username: 'locked_out_user', password: 'secret_sauce', shouldSucceed: false },
  { username: 'wrong_user', password: 'wrong_password', shouldSucceed: false },
  { username: '', password: '', shouldSucceed: false },
];

// loop through each user and create a test for each one
for (const user of users) {
  test(`login attempt with username: "${user.username}"`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(user.username, user.password);

    if (user.shouldSucceed) {
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    } else {
      await expect(loginPage.errorMessage).toBeVisible();
    }
  });
}