import { test, expect } from '@playwright/test';

test('login using environment variables', async ({ page }) => {
  await page.goto(process.env.BASE_URL);

  await page.locator('#user-name').fill(process.env.TEST_USERNAME);
  await page.locator('#password').fill(process.env.TEST_PASSWORD);
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(`${process.env.BASE_URL}/inventory.html`);
});