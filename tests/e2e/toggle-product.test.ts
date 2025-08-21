import { test, expect } from '@playwright/test';
import { TEST_IDS, TEST_DATA } from './constants';

test.describe('Toggle Product Status Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Add test products for toggling
    const products = TEST_DATA.VALID_PRODUCTS.slice(0, 2); // Use first 2 products
    for (const product of products) {
      await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product.title);
      await page.getByTestId(TEST_IDS.SKU_INPUT).fill(product.sku);
      await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product.price);
      await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product.status);
      await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
      
      // Wait for product to appear
      await expect(page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`)).toBeVisible();
    }
  });

  test('should toggle active product to inactive', async ({ page }) => {
    const activeProduct = TEST_DATA.VALID_PRODUCTS[0]; // This is active by default
    const productRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${activeProduct.sku}"]`);
    
    // Take screenshot before toggle
    await expect(page).toHaveScreenshot('before-toggle-to-inactive.png');
    
    // Verify initial state
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Active');
    await expect(productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON)).toContainText('Deactivate');
    
    // Toggle to inactive
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click();
    
    // Verify state change
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    await expect(productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON)).toContainText('Activate');
    
    // Take screenshot after toggle
    await expect(page).toHaveScreenshot('after-toggle-to-inactive.png');
  });

  test('should toggle inactive product to active', async ({ page }) => {
    const inactiveProduct = TEST_DATA.VALID_PRODUCTS[1]; // This is inactive by default
    const productRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${inactiveProduct.sku}"]`);
    
    // Take screenshot before toggle
    await expect(page).toHaveScreenshot('before-toggle-to-active.png');
    
    // Verify initial state
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    await expect(productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON)).toContainText('Activate');
    
    // Toggle to active
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click();
    
    // Verify state change
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Active');
    await expect(productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON)).toContainText('Deactivate');
    
    // Take screenshot after toggle
    await expect(page).toHaveScreenshot('after-toggle-to-active.png');
  });

  test('should handle multiple rapid toggles correctly', async ({ page }) => {
    const product = TEST_DATA.VALID_PRODUCTS[0];
    const productRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`);
    
    // Initial state: active
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Active');
    
    // Toggle multiple times rapidly
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click(); // -> inactive
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click(); // -> active
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Active');
    
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click(); // -> inactive
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click(); // -> active
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Active');
    
    // Final verification
    await expect(productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON)).toContainText('Deactivate');
  });

  test('should toggle multiple products independently', async ({ page }) => {
    const product1 = TEST_DATA.VALID_PRODUCTS[0]; // active
    const product2 = TEST_DATA.VALID_PRODUCTS[1]; // inactive
    
    const product1Row = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product1.sku}"]`);
    const product2Row = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product2.sku}"]`);
    
    // Verify initial states
    await expect(product1Row.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Active');
    await expect(product2Row.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    
    // Toggle first product (active -> inactive)
    await product1Row.getByTestId(TEST_IDS.TOGGLE_BUTTON).click();
    
    // Verify first product changed, second didn't
    await expect(product1Row.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    await expect(product2Row.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    
    // Toggle second product (inactive -> active)
    await product2Row.getByTestId(TEST_IDS.TOGGLE_BUTTON).click();
    
    // Verify final states
    await expect(product1Row.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    await expect(product2Row.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Active');
    
    // Take final screenshot
    await expect(page).toHaveScreenshot('multiple-products-toggled.png');
  });

  test('should persist toggle state after page reload', async ({ page }) => {
    const product = TEST_DATA.VALID_PRODUCTS[0]; // initially active
    const productRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`);
    
    // Toggle to inactive
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click();
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    
    // Reload page
    await page.reload();
    
    // Verify state persisted
    const productRowAfterReload = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`);
    await expect(productRowAfterReload).toBeVisible();
    await expect(productRowAfterReload.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText('Inactive');
    await expect(productRowAfterReload.getByTestId(TEST_IDS.TOGGLE_BUTTON)).toContainText('Activate');
  });
});
