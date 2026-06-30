import { test, expect } from '@playwright/test';

test('verify iframe editor is read-only', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/iframe');

  const frame = page.frameLocator('#mce_0_ifr');
  const body = frame.locator('#tinymce');

  // confirm it's actually read-only (this is now true, so test it!)
  await expect(body).toHaveAttribute('contenteditable', 'false');
});

test('upload a file', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');

  await page.locator('#file-upload').setInputFiles({
    name: 'test-file.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('This is a test file'),
  });

  await page.locator('#file-submit').click();

  await expect(page.locator('#uploaded-files')).toHaveText('test-file.txt');
});