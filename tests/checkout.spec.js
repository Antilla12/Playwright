import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';

test('full checkout flow with POM', async ({ page }) => {
  // login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  // add to cart
  const productsPage = new ProductsPage(page);
  await productsPage.addFirstProductToCart();
  await expect(productsPage.cartBadge).toHaveText('1');
  await productsPage.goToCart();

  // checkout
  const cartPage = new CartPage(page);
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await cartPage.checkout();

  // fill details
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillDetails('John', 'Doe', '12345');
  await checkoutPage.continue();
  await checkoutPage.finish();

  // verify success
  await expect(checkoutPage.successMessage).toHaveText('Thank you for your order!');
  console.log('Full checkout flow with POM passed!');
});