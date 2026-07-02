import { test, expect } from '@playwright/test';

test('mock a successful API response', async ({ page }) => {
  // intercept the API call and return fake data
  await page.route('**/posts/1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        title: 'My Mocked Post Title',
        body: 'This is fake data returned by Playwright',
        userId: 1,
      }),
    });
  });

  // now make the actual API call
  const response = await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  const body = await response.json();

  // verify we got our mocked data, not the real data
  expect(body.title).toBe('My Mocked Post Title');
  console.log('Response received:', body.title);
});

test('mock a server error response', async ({ page }) => {
  // simulate a 500 server error
  await page.route('**/posts/1', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  const response = await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.status()).toBe(500);
  console.log('Got expected error status:', response.status());
});

test('mock an empty response', async ({ page }) => {
  // simulate an empty list coming back from the server
  await page.route('**/posts', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  const response = await page.goto('https://jsonplaceholder.typicode.com/posts');
  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBe(0);
  console.log('Empty array received, length:', body.length);
});

test('mock a slow response', async ({ page }) => {
  // simulate a slow server taking 2 seconds to respond
  await page.route('**/posts/1', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, title: 'Slow response' }),
    });
  });

  const start = Date.now();
  await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  const duration = Date.now() - start;

  console.log(`Response took ${duration}ms`);
  expect(duration).toBeGreaterThan(2000);
});