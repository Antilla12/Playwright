import { test, expect } from '@playwright/test';

// skipped in CI because it randomly fails by design
// run manually with: npx playwright test retry.spec.js to see retry behavior
test.skip('flaky test simulation', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const random = Math.floor(Math.random() * 3) + 1;
  console.log(`Random number: ${random}`);

  expect(random).not.toBe(1);
});

// retry this specific test up to 3 times
test('test with individual retry', {
  retries: 3,
}, async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveTitle(/Swag Labs/);
  console.log(`Attempt number: ${test.info().retry + 1}`);
});