import { test, expect } from '@playwright/test';
import { TEST_IDS, TEST_DATA } from './constants';

test.describe('Add Product Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial empty state', async ({ page }) => {
    // Take screenshot of initial state
    await expect(page).toHaveScreenshot('initial-empty-state.png');
    
    // Verify empty state is displayed
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).toContainText('No products yet. Add your first product above!');
    
    // Verify form is visible and ready
    await expect(page.getByTestId(TEST_IDS.PRODUCT_FORM)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.ADD_BUTTON)).toBeVisible();
  });

  test('should successfully add a single product', async ({ page }) => {
    const product = TEST_DATA.VALID_PRODUCTS[0];
    
    // Fill in the form
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product.title);
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(product.sku);
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product.price);
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product.status);
    
    // Submit the form
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Verify form is cleared after submission
    await expect(page.getByTestId(TEST_IDS.TITLE_INPUT)).toHaveValue('');
    await expect(page.getByTestId(TEST_IDS.SKU_INPUT)).toHaveValue('');
    await expect(page.getByTestId(TEST_IDS.PRICE_INPUT)).toHaveValue('');
    await expect(page.getByTestId(TEST_IDS.STATUS_SELECT)).toHaveValue('active');
    
    // Verify product appears in table
    await expect(page.getByTestId(TEST_IDS.PRODUCT_TABLE)).toBeVisible();
    const productRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`);
    await expect(productRow).toBeVisible();
    
    // Verify product details
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_TITLE)).toContainText(product.title);
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_SKU)).toContainText(product.sku);
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_PRICE)).toContainText(`$${parseFloat(product.price).toFixed(2)}`);
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText(product.status.charAt(0).toUpperCase() + product.status.slice(1));
    
    // Verify empty state is no longer visible
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).not.toBeVisible();
  });

  test('should successfully add multiple products', async ({ page }) => {
    const products = TEST_DATA.VALID_PRODUCTS;
    
    // Add multiple products
    for (const product of products) {
      await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product.title);
      await page.getByTestId(TEST_IDS.SKU_INPUT).fill(product.sku);
      await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product.price);
      await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product.status);
      await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
      
      // Wait for product to appear before adding next one
      await expect(page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`)).toBeVisible();
    }
    
    // Verify all products are displayed
    await expect(page.getByTestId(TEST_IDS.PRODUCT_TABLE)).toBeVisible();
    
    // Check product count
    const productRows = page.getByTestId(TEST_IDS.PRODUCT_ROW);
    await expect(productRows).toHaveCount(products.length);
    
    // Verify each product details
    for (const product of products) {
      const productRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`);
      await expect(productRow.getByTestId(TEST_IDS.PRODUCT_TITLE)).toContainText(product.title);
      await expect(productRow.getByTestId(TEST_IDS.PRODUCT_SKU)).toContainText(product.sku);
      await expect(productRow.getByTestId(TEST_IDS.PRODUCT_PRICE)).toContainText(`$${parseFloat(product.price).toFixed(2)}`);
    }
    
    // Take screenshot of final state with multiple products
    await expect(page).toHaveScreenshot('multiple-products-added.png');
  });

  test('should preserve product data across form interactions', async ({ page }) => {
    const product = TEST_DATA.VALID_PRODUCTS[0];
    
    // Add a product
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product.title);
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(product.sku);
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product.price);
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product.status);
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Start filling another product but don't submit
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill('Partial Product');
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill('PARTIAL-001');
    
    // Verify first product is still in table
    const firstProductRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`);
    await expect(firstProductRow).toBeVisible();
    await expect(firstProductRow.getByTestId(TEST_IDS.PRODUCT_TITLE)).toContainText(product.title);
    
    // Refresh page and verify product persists
    await page.reload();
    await expect(firstProductRow).toBeVisible();
    await expect(firstProductRow.getByTestId(TEST_IDS.PRODUCT_TITLE)).toContainText(product.title);
  });
});
