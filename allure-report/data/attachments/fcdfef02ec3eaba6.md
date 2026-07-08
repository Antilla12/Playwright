# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pdf.spec.js >> verify PDF file is saved correctly
- Location: tests/pdf.spec.js:49:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 10000
Received:   964
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: Swag Labs
  - generic [ref=e5]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - textbox "Username" [ref=e11]
        - img [ref=e12]
      - generic [ref=e14]:
        - textbox "Password" [ref=e15]
        - img [ref=e16]
      - 'heading "Epic sadface: You can only access ''/inventory.html'' when you are logged in." [level=3] [ref=e19]':
        - button [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - text: "Epic sadface: You can only access '/inventory.html' when you are logged in."
      - button "Login" [ref=e23] [cursor=pointer]
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "Accepted usernames are:" [level=4] [ref=e27]
        - text: standard_user
        - text: locked_out_user
        - text: problem_user
        - text: performance_glitch_user
        - text: error_user
        - text: visual_user
      - generic [ref=e28]:
        - heading "Password for all users:" [level=4] [ref=e29]
        - text: secret_sauce
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import fs from 'fs';
  3   | import path from 'path';
  4   | 
  5   | test('generate a PDF from a page', async ({ page, browserName }) => {
  6   |   if (browserName !== 'chromium') {
  7   |     test.skip();
  8   |     return;
  9   |   }
  10  | 
  11  |   await page.goto('https://www.saucedemo.com/inventory.html');
  12  | 
  13  |   const pdfBuffer = await page.pdf({
  14  |     path: 'test-results/inventory.pdf',
  15  |     format: 'A4',
  16  |     printBackground: true,
  17  |   });
  18  | 
  19  |   expect(pdfBuffer.length).toBeGreaterThan(0);
  20  |   console.log(`PDF generated: ${pdfBuffer.length} bytes`);
  21  | });
  22  | 
  23  | test('generate PDF with custom options', async ({ page, browserName }) => {
  24  |   if (browserName !== 'chromium') {
  25  |     test.skip();
  26  |     return;
  27  |   }
  28  | 
  29  |   await page.goto('https://www.saucedemo.com/inventory.html');
  30  | 
  31  |   const pdfBuffer = await page.pdf({
  32  |     format: 'A4',
  33  |     margin: {
  34  |       top: '20mm',
  35  |       bottom: '20mm',
  36  |       left: '15mm',
  37  |       right: '15mm',
  38  |     },
  39  |     displayHeaderFooter: true,
  40  |     headerTemplate: '<div style="font-size:10px">Saucedemo Inventory Report</div>',
  41  |     footerTemplate: '<div style="font-size:10px">Page <span class="pageNumber"></span></div>',
  42  |     printBackground: true,
  43  |   });
  44  | 
  45  |   expect(pdfBuffer.length).toBeGreaterThan(0);
  46  |   console.log(`PDF with custom options: ${pdfBuffer.length} bytes`);
  47  | });
  48  | 
  49  | test('verify PDF file is saved correctly', async ({ page, browserName }) => {
  50  |   if (browserName !== 'chromium') {
  51  |     test.skip();
  52  |     return;
  53  |   }
  54  | 
  55  |   await page.goto('https://www.saucedemo.com/inventory.html');
  56  | 
  57  |   // make sure output folder exists
  58  |   const outputDir = 'test-results';
  59  |   if (!fs.existsSync(outputDir)) {
  60  |     fs.mkdirSync(outputDir, { recursive: true });
  61  |   }
  62  | 
  63  |   const pdfPath = path.join(outputDir, 'verified-inventory.pdf');
  64  | 
  65  |   await page.pdf({
  66  |     path: pdfPath,
  67  |     format: 'A4',
  68  |     printBackground: true,
  69  |   });
  70  | 
  71  |   // verify file exists on disk
  72  |   expect(fs.existsSync(pdfPath)).toBe(true);
  73  | 
  74  |   // verify file size is reasonable (more than 10KB)
  75  |   const stats = fs.statSync(pdfPath);
> 76  |   expect(stats.size).toBeGreaterThan(10000);
      |                      ^ Error: expect(received).toBeGreaterThan(expected)
  77  | 
  78  |   console.log(`PDF saved to: ${pdfPath}`);
  79  |   console.log(`PDF file size: ${stats.size} bytes`);
  80  | });
  81  | 
  82  | test('generate PDF from checkout page', async ({ page, browserName }) => {
  83  |   if (browserName !== 'chromium') {
  84  |     test.skip();
  85  |     return;
  86  |   }
  87  | 
  88  |   // navigate through checkout flow
  89  |   await page.goto('https://www.saucedemo.com/inventory.html');
  90  |   await page.locator('.btn_inventory').first().click();
  91  |   await page.locator('.shopping_cart_link').click();
  92  |   await page.locator('#checkout').click();
  93  |   await page.locator('#first-name').fill('John');
  94  |   await page.locator('#last-name').fill('Doe');
  95  |   await page.locator('#postal-code').fill('12345');
  96  |   await page.locator('#continue').click();
  97  | 
  98  |   // generate PDF of order summary page
  99  |   const pdfBuffer = await page.pdf({
  100 |     format: 'A4',
  101 |     printBackground: true,
  102 |   });
  103 | 
  104 |   expect(pdfBuffer.length).toBeGreaterThan(0);
  105 |   console.log(`Order summary PDF: ${pdfBuffer.length} bytes`);
  106 | });
```