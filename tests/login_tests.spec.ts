import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login_page';
import { InventoryPage } from '../pages/inventory_page';

test.describe('Login', () => {
  let loginPage: LoginPage;
    const validUsers = {
    standard: { username: 'standard_user', password: 'secret_sauce' },
    problem: { username: 'problem_user', password: 'secret_sauce' },
    performance: { username: 'performance_glitch_user', password: 'secret_sauce' },
    visual: { username: 'visual_user', password: 'secret_sauce' }
  };

  const lockedUser = { username: 'locked_out_user', password: 'secret_sauce' };
  const invalidCredentials = { username: 'invalid_user', password: 'invalid_password' };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('valid inputs', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(page).toHaveURL(/.*inventory.html/);
  });


  test('invalid inputs', async () => {
    await loginPage.login(invalidCredentials.username, invalidCredentials.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  test('empty username', async () => {
    await loginPage.login('', validUsers.standard.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('empty password', async () => {
    await loginPage.login(validUsers.standard.username, '');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Password is required');
  });



});