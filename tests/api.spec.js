import { test, expect } from '@playwright/test';

test('GET request - fetch a list of posts', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');

  // check status code
  expect(response.status()).toBe(200);

  // check response body
  const body = await response.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
});

test('GET request - fetch a single post', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.id).toBe(1);
  expect(body).toHaveProperty('title');
});

test('POST request - create a new post', async ({ request }) => {
  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: {
      title: 'My Test Post',
      body: 'This is a test',
      userId: 1,
    },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.title).toBe('My Test Post');
});