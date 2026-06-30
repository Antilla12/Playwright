export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.productTitle = page.locator('.title');
    this.addToCartButton = page.locator('.btn_inventory').first();
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addFirstProductToCart() {
    await this.addToCartButton.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}