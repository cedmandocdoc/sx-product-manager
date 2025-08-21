import { test, expect } from '@playwright/test';
import { TestId } from '../../src/lib/TestId';

test.describe('Toggle Product Status Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Add test products for toggling
    const products = [
      {
        title: 'Test Product 1',
        sku: 'TEST-001',
        price: '29.99',
        status: 'active' as const,
      },
      {
        title: 'Test Product 2',
        sku: 'TEST-002',
        price: '19.50',
        status: 'inactive' as const,
      },
    ]
    for (const product of products) {
      await page.getByTestId(TestId.TITLE_INPUT).fill(product.title);
      await page.getByTestId(TestId.SKU_INPUT).fill(product.sku);
      await page.getByTestId(TestId.PRICE_INPUT).fill(product.price);
      await page.getByTestId(TestId.STATUS_SELECT).selectOption(product.status);
      await page.getByTestId(TestId.ADD_BUTTON).click();
      
      // Wait for product to appear
      await expect(page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${product.sku}"]`)).toBeVisible();
    }
  });

  test('should toggle active product to inactive', async ({ page }) => {
    const activeProduct = {
      title: 'Test Product 1',
      sku: 'TEST-001',
      price: '29.99',
      status: 'active' as const,
    }
    const productRow = page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${activeProduct.sku}"]`);
    
    // Take screenshot before toggle
    await expect(page).toHaveScreenshot('active-to-inactive-before.png', { fullPage: true });
    
    // Verify initial state
    await expect(productRow.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Active');
    await expect(productRow.getByTestId(TestId.TOGGLE_BUTTON)).toContainText('Deactivate');
    
    // Toggle to inactive
    await productRow.getByTestId(TestId.TOGGLE_BUTTON).click();
    
    // Verify state change
    await expect(productRow.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Inactive');
    await expect(productRow.getByTestId(TestId.TOGGLE_BUTTON)).toContainText('Activate');
    
    // Take screenshot after toggle
    await expect(page).toHaveScreenshot('active-to-inactive-after.png', { fullPage: true });
  });

  test('should toggle inactive product to active', async ({ page }) => {
    const inactiveProduct = {
      title: 'Test Product 2',
      sku: 'TEST-002',
      price: '19.50',
      status: 'inactive' as const,
    }
    const productRow = page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${inactiveProduct.sku}"]`);
    
    // Take screenshot before toggle
    await expect(page).toHaveScreenshot('inactive-to-active-before.png', { fullPage: true });
    
    // Verify initial state
    await expect(productRow.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Inactive');
    await expect(productRow.getByTestId(TestId.TOGGLE_BUTTON)).toContainText('Activate');
    
    // Toggle to active
    await productRow.getByTestId(TestId.TOGGLE_BUTTON).click();
    
    // Verify state change
    await expect(productRow.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Active');
    await expect(productRow.getByTestId(TestId.TOGGLE_BUTTON)).toContainText('Deactivate');
    
    // Take screenshot after toggle
    await expect(page).toHaveScreenshot('inactive-to-active-after.png', { fullPage: true });
  });

  test('should toggle multiple products independently', async ({ page }) => {
    const product1 = {
      title: 'Test Product 1',
      sku: 'TEST-001',
      price: '29.99',
      status: 'active' as const,
    }
    const product2 = {
      title: 'Test Product 2',
      sku: 'TEST-002',
      price: '19.50',
      status: 'inactive' as const,
    }
    
    const product1Row = page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${product1.sku}"]`);
    const product2Row = page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${product2.sku}"]`);
    
    // Verify initial states
    await expect(product1Row.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Active');
    await expect(product2Row.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Inactive');
    
    // Toggle first product (active -> inactive)
    await product1Row.getByTestId(TestId.TOGGLE_BUTTON).click();
    
    // Verify first product changed, second didn't
    await expect(product1Row.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Inactive');
    await expect(product2Row.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Inactive');
    
    // Toggle second product (inactive -> active)
    await product2Row.getByTestId(TestId.TOGGLE_BUTTON).click();
    
    // Verify final states
    await expect(product1Row.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Inactive');
    await expect(product2Row.getByTestId(TestId.PRODUCT_STATUS)).toContainText('Active');
  });
});
