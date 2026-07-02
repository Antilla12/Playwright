import { test, expect } from '@playwright/test';

test('handle a new tab opening', async ({ page, context }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');

  // listen for a new page/tab BEFORE clicking the link
  const newTabPromise = context.waitForEvent('page');

  // click the link that opens a new tab
  await page.getByRole('link', { name: 'Click Here' }).click();

  // wait for the new tab to open
  const newTab = await newTabPromise;

  // wait for the new tab to finish loading
  await newTab.waitForLoadState();

  // verify the new tab has the right content
  await expect(newTab).toHaveURL(/\/windows\/new/);
  await expect(newTab.locator('h3')).toHaveText('New Window');

  console.log('New tab URL:', newTab.url());

  // you can interact with both tabs independently
  console.log('Original tab URL:', page.url());
});

test('switch between multiple tabs', async ({ page, context }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');

  // open new tab
  const newTabPromise = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Click Here' }).click();
  const newTab = await newTabPromise;
  await newTab.waitForLoadState();

  // verify new tab content
  await expect(newTab.locator('h3')).toHaveText('New Window');

  // switch back to original tab and verify it's still there
  await expect(page.locator('h3')).toHaveText('Opening a new window');

  // close the new tab
  await newTab.close();

  // original tab should still work fine
  await expect(page).toHaveURL('https://the-internet.herokuapp.com/windows');
  console.log('Switched between tabs successfully!');
});

test('open a new tab programmatically', async ({ page, context }) => {
  // open a new tab manually without clicking a link
  const newTab = await context.newPage();

  // navigate to a different site in the new tab
  await newTab.goto('https://www.saucedemo.com');
  await expect(newTab).toHaveTitle(/Swag Labs/);

  // original tab is unaffected
  await page.goto('https://the-internet.herokuapp.com');
  await expect(page).toHaveTitle(/The Internet/);

  console.log('Two tabs open simultaneously!');
  console.log('Tab 1:', page.url());
  console.log('Tab 2:', newTab.url());
});