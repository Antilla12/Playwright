import { test, expect } from '@playwright/test';

test('read cookies from the page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // get all cookies after login
  const cookies = await page.context().cookies();

  console.log(`Total cookies: ${cookies.length}`);
  cookies.forEach(cookie => {
    console.log(`  Cookie: ${cookie.name} = ${cookie.value}`);
  });

  expect(cookies.length).toBeGreaterThan(0);
});

test('set a cookie manually', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // add a custom cookie before the page loads
  await page.context().addCookies([
    {
      name: 'my_test_cookie',
      value: 'hello_playwright',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);

  // reload the page with the cookie set
  await page.reload();

  // verify the cookie exists
  const cookies = await page.context().cookies();
  const myCookie = cookies.find(c => c.name === 'my_test_cookie');

  expect(myCookie).toBeDefined();
  expect(myCookie.value).toBe('hello_playwright');
  console.log('Custom cookie set and verified!');
});

test('delete a cookie', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // add a cookie
  await page.context().addCookies([
    {
      name: 'cookie_to_delete',
      value: 'delete_me',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);

  // verify it exists
  let cookies = await page.context().cookies();
  expect(cookies.find(c => c.name === 'cookie_to_delete')).toBeDefined();

  // delete ALL cookies
  await page.context().clearCookies();

  // verify it's gone
  cookies = await page.context().cookies();
  expect(cookies.find(c => c.name === 'cookie_to_delete')).toBeUndefined();
  console.log('Cookie deleted successfully!');
});

test('read localStorage', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForURL('https://www.saucedemo.com/inventory.html');

  // read localStorage directly from the browser
  const localStorage = await page.evaluate(() => {
    const items = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      items[key] = window.localStorage.getItem(key);
    }
    return items;
  });

  console.log('localStorage contents:');
  console.log(JSON.stringify(localStorage, null, 2));
});

test('set localStorage value', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // set a value in localStorage before the page uses it
  await page.evaluate(() => {
    window.localStorage.setItem('my_test_key', 'my_test_value');
  });

  // read it back to verify
  const value = await page.evaluate(() => {
    return window.localStorage.getItem('my_test_key');
  });

  expect(value).toBe('my_test_value');
  console.log('localStorage value set and verified:', value);
});

test('clear localStorage', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // set something in localStorage
  await page.evaluate(() => {
    window.localStorage.setItem('key1', 'value1');
    window.localStorage.setItem('key2', 'value2');
  });

  // clear all localStorage
  await page.evaluate(() => window.localStorage.clear());

  // verify it is empty
  const length = await page.evaluate(() => window.localStorage.length);
  expect(length).toBe(0);
  console.log('localStorage cleared successfully!');
});