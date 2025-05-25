import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryContainer: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryContainer = page.locator('.inventory_container');
    this.addToCartButtons = page.locator('[data-test*="add-to-cart"]');
    this.removeButtons = page.locator('[data-test*="remove"]');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('.product_sort_container');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async addItemToCart(itemName: string) {
    await this.page.locator(`[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`).click();
  }

  async removeItemFromCart(itemName: string) {
    await this.page.locator(`[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`).click();
  }

  async getCartItemCount() {
    const badge = await this.shoppingCartBadge.textContent();
    return badge ? parseInt(badge) : 0;
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async sortBy(option: string) {
    await this.sortDropdown.waitFor({ state: 'visible' });
    await this.sortDropdown.selectOption(option);
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async getInventoryItemNames() {
    const items = await this.page.locator('.inventory_item_name').allTextContents();
    return items;
  }
}