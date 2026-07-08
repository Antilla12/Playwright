import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('generate a PDF from a page', async ({ page, browserName }) => {
  if (browserName !== 'chromium') {
    test.skip();
    return;
  }

  await page.goto('https://www.saucedemo.com/inventory.html');

  const pdfBuffer = await page.pdf({
    path: 'test-results/inventory.pdf',
    format: 'A4',
    printBackground: true,
  });

  expect(pdfBuffer.length).toBeGreaterThan(0);
  console.log(`PDF generated: ${pdfBuffer.length} bytes`);
});

test('generate PDF with custom options', async ({ page, browserName }) => {
  if (browserName !== 'chromium') {
    test.skip();
    return;
  }

  await page.goto('https://www.saucedemo.com/inventory.html');

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm',
    },
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size:10px">Saucedemo Inventory Report</div>',
    footerTemplate: '<div style="font-size:10px">Page <span class="pageNumber"></span></div>',
    printBackground: true,
  });

  expect(pdfBuffer.length).toBeGreaterThan(0);
  console.log(`PDF with custom options: ${pdfBuffer.length} bytes`);
});

test('verify PDF file is saved correctly', async ({ page, browserName }) => {
  if (browserName !== 'chromium') {
    test.skip();
    return;
  }

  await page.goto('https://www.saucedemo.com/inventory.html');

  // make sure output folder exists
  const outputDir = 'test-results';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfPath = path.join(outputDir, 'verified-inventory.pdf');

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
  });

  // verify file exists on disk
  expect(fs.existsSync(pdfPath)).toBe(true);

  // verify file size is reasonable (more than 10KB)
  const stats = fs.statSync(pdfPath);
  expect(stats.size).toBeGreaterThan(10000);

  console.log(`PDF saved to: ${pdfPath}`);
  console.log(`PDF file size: ${stats.size} bytes`);
});

test('generate PDF from checkout page', async ({ page, browserName }) => {
  if (browserName !== 'chromium') {
    test.skip();
    return;
  }

  // navigate through checkout flow
  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.locator('.btn_inventory').first().click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('#checkout').click();
  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Doe');
  await page.locator('#postal-code').fill('12345');
  await page.locator('#continue').click();

  // generate PDF of order summary page
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  expect(pdfBuffer.length).toBeGreaterThan(0);
  console.log(`Order summary PDF: ${pdfBuffer.length} bytes`);
});