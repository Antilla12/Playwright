import { test, expect } from '../fixtures.js';

test('login using fixtures', async ({ page, loginPage }) => {
  // notice: no "new LoginPage(page)" needed anymore!
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('add to cart using fixtures', async ({ page, loginPage, productsPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await productsPage.addFirstProductToCart();
  await expect(productsPage.cartBadge).toHaveText('1');
});