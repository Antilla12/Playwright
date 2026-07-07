import { test, expect } from '@playwright/test';

test('block images to speed up page load', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', route => route.abort());

  const start = Date.now();
  await page.goto('https://www.saucedemo.com/inventory.html');
  const duration = Date.now() - start;

  console.log(`Page loaded in ${duration}ms without images`);

  await expect(page.locator('.title')).toHaveText('Products');
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('block images and css to load even faster', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg,gif,svg,webp,css}', route => route.abort());

  const start = Date.now();
  await page.goto('https://www.saucedemo.com/inventory.html');
  const duration = Date.now() - start;

  console.log(`Page loaded in ${duration}ms without images or CSS`);

  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('compare load time with and without images', async ({ page }) => {
  // first load WITH images
  const start1 = Date.now();
  await page.goto('https://www.saucedemo.com/inventory.html');
  const withImages = Date.now() - start1;
  console.log(`With images: ${withImages}ms`);

  // now block images
  await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', route => route.abort());

  // reload WITHOUT images
  const start2 = Date.now();
  await page.reload();
  const withoutImages = Date.now() - start2;
  console.log(`Without images: ${withoutImages}ms`);

  console.log(`Time saved: ${withImages - withoutImages}ms`);

  // just log results — timing comparisons are unreliable due to caching
  // the important thing is both loads complete successfully
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('intercept and modify a request', async ({ page }) => {
  // intercept and return our own data directly (works on all browsers)
  await page.route('**/posts/1', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        title: 'INTERCEPTED AND MODIFIED',
        body: 'This is fake data',
        userId: 1,
      }),
    });
  });

  const response = await page.goto('https://jsonplaceholder.typicode.com/posts/1');
  const body = await response.json();

  expect(body.title).toBe('INTERCEPTED AND MODIFIED');
  console.log('Modified title:', body.title);
});

test('log all network requests', async ({ page }) => {
  const requests = [];

  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
    });
  });

  await page.goto('https://www.saucedemo.com');

  console.log(`\nTotal requests made: ${requests.length}`);
  console.log('First 5 requests:');
  requests.slice(0, 5).forEach(r => {
    console.log(`  ${r.method} ${r.url}`);
  });

  expect(requests.length).toBeGreaterThan(0);
});