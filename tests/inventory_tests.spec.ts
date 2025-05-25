import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login_page';
import { InventoryPage } from '../pages/inventory_page';


test.describe('Inventory Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  
  // Test data embedded directly in tests
  const standardUser = { username: 'standard_user', password: 'secret_sauce' };
  const products = [
    'sauce-labs-backpack',
    'sauce-labs-bike-light', 
    'sauce-labs-bolt-t-shirt',
    'sauce-labs-fleece-jacket',
    'sauce-labs-onesie',
    'test.allthethings()-t-shirt-(red)'
  ];

  const sortOptions = {
    nameAsc: 'az',
    nameDesc: 'za',
    priceLow: 'lohi',
    priceHigh: 'hilo'
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
  });

  test(' add items to cart', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.addItemToCart('sauce-labs-bolt-t-shirt');
    
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(3);
  });

  test('remove item from cart', async () => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    
    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);
    
    await inventoryPage.removeItemFromCart('sauce-labs-backpack');
    
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('sort by name (A to Z)', async () => {
    await inventoryPage.sortBy(sortOptions.nameAsc);
    
    const itemNames = await inventoryPage.getInventoryItemNames();
    const sortedNames = [...itemNames].sort();
    expect(itemNames).toEqual(sortedNames);
  });

  test('sort by name (Z to A)', async () => {
    await inventoryPage.sortBy(sortOptions.nameDesc);
    
    const itemNames = await inventoryPage.getInventoryItemNames();
    const sortedNames = [...itemNames].sort().reverse();
    expect(itemNames).toEqual(sortedNames);
  });

  test('sort by price (low to high)', async () => {
    await inventoryPage.sortBy(sortOptions.priceLow);
    
    // Verify the sort dropdown shows the correct selection
    const selectedValue = await inventoryPage.sortDropdown.inputValue();
    expect(selectedValue).toBe(sortOptions.priceLow);
  });

  test('sort by price (high to low)', async () => {
    await inventoryPage.sortBy(sortOptions.priceHigh);
    
    // Verify the sort dropdown shows the correct selection
    const selectedValue = await inventoryPage.sortDropdown.inputValue();
    expect(selectedValue).toBe(sortOptions.priceHigh);
  });

  test('should navigate to cart page', async ({ page }) => {
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    
    await expect(page).toHaveURL(/.*cart.html/);
  });

  test('should logout successfully', async ({ page }) => {
    await inventoryPage.logout();
    
    await expect(page).toHaveURL(/.*\/$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});