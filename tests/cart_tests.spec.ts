import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login_page';
import { InventoryPage } from '../pages/inventory_page';
import { CartPage } from '../pages/cart_page';

test.describe('Cart Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  
  // Test data embedded directly in tests
  const standardUser = { username: 'standard_user', password: 'secret_sauce' };
  const testItems = [
    'sauce-labs-backpack',
    'sauce-labs-bike-light',
    'sauce-labs-bolt-t-shirt'
  ];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
  });


  test('display added items in cart', async ({ page }) => {
    await inventoryPage.addItemToCart(testItems[0]);
    await inventoryPage.addItemToCart(testItems[1]);
    await inventoryPage.goToCart();
    
    await expect(page).toHaveURL(/.*cart.html/);
    
    const itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBe(2);
    
    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames.length).toBe(2);
  });

  test('remove item from cart', async () => {
    await inventoryPage.addItemToCart(testItems[0]);
    await inventoryPage.addItemToCart(testItems[1]);
    await inventoryPage.goToCart();
    
    let itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBe(2);
    
    await cartPage.removeItem(testItems[0]);
    
    itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBe(1);
  });

  test('continue shopping from cart', async ({ page }) => {
    await inventoryPage.addItemToCart(testItems[0]);
    await inventoryPage.goToCart();
    
    await cartPage.continueShopping();
    
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('proceed to checkout from cart', async ({ page }) => {
    await inventoryPage.addItemToCart(testItems[0]);
    await inventoryPage.goToCart();
    
    await cartPage.proceedToCheckout();
    
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });



  test('update cart badge when removing all items', async () => {
    await inventoryPage.addItemToCart(testItems[0]);
    await inventoryPage.goToCart();
    
    let itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBe(1);
    
    await cartPage.removeItem(testItems[0]);
    
    itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBe(0);
    
    // Verify cart badge is no longer visible
    await expect(inventoryPage.shoppingCartBadge).not.toBeVisible();
  });
});