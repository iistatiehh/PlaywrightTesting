import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;
  readonly cartQuantity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.removeButtons = page.locator('[data-test*="remove"]');
    this.cartQuantity = page.locator('.cart_quantity');
  }

  async getCartItemsCount() {
    return await this.cartItems.count();
  }

  async getCartItemNames() {
    const items = await this.page.locator('.inventory_item_name').allTextContents();
    return items;
  }

  async removeItem(itemName: string) {
    await this.page.locator(`[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}