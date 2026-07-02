import { test, expect } from '@playwright/test';

// this test retries up to 2 times if it fails
test('flaky test simulation', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // generate a random number between 1 and 3
  const random = Math.floor(Math.random() * 3) + 1;
  console.log(`Random number: ${random}`);

  // this will randomly pass or fail to simulate a flaky test
  expect(random).not.toBe(1);
});

// retry this specific test up to 3 times
test('test with individual retry', {
  retries: 3,
}, async ({ page, }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveTitle(/Swag Labs/);
  console.log(`Attempt number: ${test.info().retry + 1}`);
});