export class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutButton = page.locator('#checkout');
    this.cartItems = page.locator('.cart_item');
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}