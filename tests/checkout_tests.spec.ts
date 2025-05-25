import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login_page';
import { InventoryPage } from '../pages/inventory_page';
import { CartPage } from '../pages/cart_page';
import { CheckoutPage } from '../pages/checkout_page';

test.describe('Checkout Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  
  // Test data embedded directly in tests
  const standardUser = { username: 'standard_user', password: 'secret_sauce' };
  const testItem = 'sauce-labs-backpack';
  
  const validCheckoutInfo = {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  };

  const invalidCheckoutData = {
    missingFirstName: { firstName: '', lastName: 'ahmad', postalCode: '12345' },
    missingLastName: { firstName: 'ahmad', lastName: '', postalCode: '12345' },
    missingPostalCode: { firstName: 'ahmad', lastName: 'istatieh', postalCode: '' }
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
    await inventoryPage.addItemToCart(testItem);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('valid information', async ({ page }) => {
    await checkoutPage.fillCheckoutInfo(
      validCheckoutInfo.firstName,
      validCheckoutInfo.lastName,
      validCheckoutInfo.postalCode
    );
    await checkoutPage.continueToOverview();
    
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    
    await checkoutPage.finishOrder();
    
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toContain('Thank you for your order!');
  });

  test('missing first name', async () => {
    await checkoutPage.fillCheckoutInfo(
      invalidCheckoutData.missingFirstName.firstName,
      invalidCheckoutData.missingFirstName.lastName,
      invalidCheckoutData.missingFirstName.postalCode
    );
    await checkoutPage.continueToOverview();
    
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toContain('First Name is required');
  });

  test('missing last name', async () => {
    await checkoutPage.fillCheckoutInfo(
      invalidCheckoutData.missingLastName.firstName,
      invalidCheckoutData.missingLastName.lastName,
      invalidCheckoutData.missingLastName.postalCode
    );
    await checkoutPage.continueToOverview();
    
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toContain('Last Name is required');
  });

  test('missing postal code', async () => {
    await checkoutPage.fillCheckoutInfo(
      invalidCheckoutData.missingPostalCode.firstName,
      invalidCheckoutData.missingPostalCode.lastName,
      invalidCheckoutData.missingPostalCode.postalCode
    );
    await checkoutPage.continueToOverview();
    
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toContain('Postal Code is required');
  });



});