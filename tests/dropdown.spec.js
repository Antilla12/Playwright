import { test, expect } from '@playwright/test';

test('select a dropdown option', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');

  // select option by visible label
  await page.locator('#dropdown').selectOption({ label: 'Option 1' });

  // verify selected value
  await expect(page.locator('#dropdown')).toHaveValue('1');
});

test('handle checkboxes', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const checkboxes = page.locator('input[type="checkbox"]');

  // check the first checkbox
  await checkboxes.first().check();
  await expect(checkboxes.first()).toBeChecked();

  // uncheck it
  await checkboxes.first().uncheck();
  await expect(checkboxes.first()).not.toBeChecked();
});

test('handle a JavaScript alert', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  // listen for the alert BEFORE clicking
  page.once('dialog', async (dialog) => {
    console.log('Alert text:', dialog.message());
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Click for JS Alert' }).click();

  // verify the result text on page
  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
});