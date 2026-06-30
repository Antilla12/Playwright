import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';

test.beforeEach(async ({ page }) => {
  // this runs before EVERY test below
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('product page shows items', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await expect(productsPage.productTitle.first()).toBeVisible();
});

test('can add item to cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await productsPage.addFirstProductToCart();
  await expect(productsPage.cartBadge).toHaveText('1');
});

test('cart starts empty', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await expect(productsPage.cartBadge).toHaveCount(0);
});

test('explore different locators', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // find by visible text
  await expect(page.getByText('Products')).toBeVisible();

  // find a button by its role
  const addButtons = page.getByRole('button', { name: 'Add to cart' });
  await expect(addButtons.first()).toBeVisible();

  // count how many "Add to cart" buttons exist
  const count = await addButtons.count();
  console.log('Number of products:', count);

  // find by placeholder (works on login page, not here, just for reference)
  // page.getByPlaceholder('Username')
});

test('explore more assertions', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // checkbox/button enabled or disabled
  const addButton = productsPage.addToCartButton;
  await expect(addButton).toBeEnabled();

  // click it, button text usually changes to "Remove"
  await addButton.click();
  const removeButton = page.getByRole('button', { name: 'Remove' });
  await expect(removeButton).toBeVisible();
  await expect(removeButton).toBeEnabled();

  // check cart badge contains text (partial match)
  await expect(productsPage.cartBadge).toContainText('1');

  // check element is NOT visible (before adding more items, sort dropdown should be visible)
  const sortDropdown = page.locator('.product_sort_container');
  await expect(sortDropdown).toBeVisible();
});