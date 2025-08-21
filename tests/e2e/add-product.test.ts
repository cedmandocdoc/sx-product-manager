import { test, expect } from '@playwright/test';
import { TestId } from '../../src/lib/TestId';

test.describe('Add Product Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display initial empty state', async ({ page }) => {
    // Take screenshot of initial state
    await expect(page).toHaveScreenshot('initial-empty-state.png', { fullPage: true });
    
    // Verify empty state is displayed
    await expect(page.getByTestId(TestId.EMPTY_STATE)).toBeVisible();
    await expect(page.getByTestId(TestId.EMPTY_STATE)).toContainText('No products yet. Add your first product above!');
    
    // Verify form is visible and ready
    await expect(page.getByTestId(TestId.PRODUCT_FORM)).toBeVisible();
    await expect(page.getByTestId(TestId.ADD_BUTTON)).toBeVisible();
  });

  test('should successfully add a single product', async ({ page }) => {
    const product = {
      title: 'Test Product 1',
      sku: 'TEST-001',
      price: '29.99',
      status: 'active' as const,
    };
    
    // Fill in the form
    await page.getByTestId(TestId.TITLE_INPUT).fill(product.title);
    await page.getByTestId(TestId.SKU_INPUT).fill(product.sku);
    await page.getByTestId(TestId.PRICE_INPUT).fill(product.price);
    await page.getByTestId(TestId.STATUS_SELECT).selectOption(product.status);
    
    // Submit the form
    await page.getByTestId(TestId.ADD_BUTTON).click();
    
    // Verify form is cleared after submission
    await expect(page.getByTestId(TestId.TITLE_INPUT)).toHaveValue('');
    await expect(page.getByTestId(TestId.SKU_INPUT)).toHaveValue('');
    await expect(page.getByTestId(TestId.PRICE_INPUT)).toHaveValue('');
    await expect(page.getByTestId(TestId.STATUS_SELECT)).toHaveValue('active');
    
    // Verify product appears in table
    await expect(page.getByTestId(TestId.PRODUCT_TABLE)).toBeVisible();
    const productRow = page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${product.sku}"]`);
    await expect(productRow).toBeVisible();
    
    // Verify product details
    await expect(productRow.getByTestId(TestId.PRODUCT_TITLE)).toContainText(product.title);
    await expect(productRow.getByTestId(TestId.PRODUCT_SKU)).toContainText(product.sku);
    await expect(productRow.getByTestId(TestId.PRODUCT_PRICE)).toContainText(`$${parseFloat(product.price).toFixed(2)}`);
    await expect(productRow.getByTestId(TestId.PRODUCT_STATUS)).toContainText(product.status.charAt(0).toUpperCase() + product.status.slice(1));
    
    // Verify empty state is no longer visible
    await expect(page.getByTestId(TestId.EMPTY_STATE)).not.toBeVisible();
  });

  test('should successfully add multiple products', async ({ page }) => {
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
      {
        title: 'Premium Widget',
        sku: 'WIDGET-PREMIUM-001',
        price: '199.99',
        status: 'active' as const,
      },
    ];
    
    // Add multiple products
    for (const product of products) {
      await page.getByTestId(TestId.TITLE_INPUT).fill(product.title);
      await page.getByTestId(TestId.SKU_INPUT).fill(product.sku);
      await page.getByTestId(TestId.PRICE_INPUT).fill(product.price);
      await page.getByTestId(TestId.STATUS_SELECT).selectOption(product.status);
      await page.getByTestId(TestId.ADD_BUTTON).click();
      
      // Wait for product to appear before adding next one
      await expect(page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${product.sku}"]`)).toBeVisible();
    }
    
    // Verify all products are displayed
    await expect(page.getByTestId(TestId.PRODUCT_TABLE)).toBeVisible();
    
    // Check product count
    const productRows = page.getByTestId(TestId.PRODUCT_ROW);
    await expect(productRows).toHaveCount(products.length);
    
    // Verify each product details
    for (const product of products) {
      const productRow = page.locator(`[data-testid="${TestId.PRODUCT_ROW}"][data-sku="${product.sku}"]`);
      await expect(productRow.getByTestId(TestId.PRODUCT_TITLE)).toContainText(product.title);
      await expect(productRow.getByTestId(TestId.PRODUCT_SKU)).toContainText(product.sku);
      await expect(productRow.getByTestId(TestId.PRODUCT_PRICE)).toContainText(`$${parseFloat(product.price).toFixed(2)}`);
    }
    
    // Take screenshot of final state with multiple products
    await expect(page).toHaveScreenshot('multiple-products-added.png', { fullPage: true });
  });
});
