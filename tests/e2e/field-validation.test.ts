import { test, expect } from '@playwright/test';
import { TestId } from '../../src/lib/TestId';


test.describe('Field Validation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show validation error for empty title field', async ({ page }) => {
    const invalidProduct = {
      title: '',
      sku: 'TEST-INVALID',
      price: '10.00',
      status: 'active' as const,
      expectedError: 'Please fill in all fields',
    }; // empty title
    
    // Fill form with empty title
    await page.getByTestId(TestId.TITLE_INPUT).fill(invalidProduct.title); // empty string
    await page.getByTestId(TestId.SKU_INPUT).fill(invalidProduct.sku);
    await page.getByTestId(TestId.PRICE_INPUT).fill(invalidProduct.price);
    await page.getByTestId(TestId.STATUS_SELECT).selectOption(invalidProduct.status);
    
    // Set up dialog handler before clicking submit
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe(invalidProduct.expectedError);
      dialog.accept();
    });
    
    // Submit form and expect validation error
    await page.getByTestId(TestId.ADD_BUTTON).click();
    
    // Verify form values are preserved
    await expect(page.getByTestId(TestId.SKU_INPUT)).toHaveValue(invalidProduct.sku);
    await expect(page.getByTestId(TestId.PRICE_INPUT)).toHaveValue(invalidProduct.price);
    
    // Verify no product was added
    await expect(page.getByTestId(TestId.EMPTY_STATE)).toBeVisible();
  });

  test('should show validation error for empty SKU field', async ({ page }) => {
    const invalidProduct = {
      title: 'Test Product',
      sku: '',
      price: '10.00',
      status: 'active' as const,
      expectedError: 'Please fill in all fields',
    };
    // Fill form with empty SKU
    await page.getByTestId(TestId.TITLE_INPUT).fill(invalidProduct.title);
    await page.getByTestId(TestId.SKU_INPUT).fill(invalidProduct.sku); // empty SKU
    await page.getByTestId(TestId.PRICE_INPUT).fill(invalidProduct.price);
    await page.getByTestId(TestId.STATUS_SELECT).selectOption(invalidProduct.status);
    
    // Set up dialog handler
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe(invalidProduct.expectedError);
      dialog.accept();
    });
    
    await page.getByTestId(TestId.ADD_BUTTON).click();
    
    // Verify form values are preserved
    await expect(page.getByTestId(TestId.TITLE_INPUT)).toHaveValue(invalidProduct.title);
    await expect(page.getByTestId(TestId.PRICE_INPUT)).toHaveValue(invalidProduct.price);
    
    // Verify no product was added
    await expect(page.getByTestId(TestId.EMPTY_STATE)).toBeVisible();
  });

  test('should show validation error for empty price field', async ({ page }) => {
    const invalidProduct = {
      title: 'Test Product',
      sku: 'TEST-001',
      price: '',
      status: 'active' as const,
      expectedError: 'Please fill in all fields',
    };
    // Fill form with empty price
    await page.getByTestId(TestId.TITLE_INPUT).fill(invalidProduct.title);
    await page.getByTestId(TestId.SKU_INPUT).fill(invalidProduct.sku);
    await page.getByTestId(TestId.PRICE_INPUT).fill(invalidProduct.price);
    await page.getByTestId(TestId.STATUS_SELECT).selectOption(invalidProduct.status);
    
    // Set up dialog handler
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe(invalidProduct.expectedError);
      dialog.accept();
    });
    
    await page.getByTestId(TestId.ADD_BUTTON).click();
    
    // Verify form values are preserved
    await expect(page.getByTestId(TestId.TITLE_INPUT)).toHaveValue(invalidProduct.title);
    await expect(page.getByTestId(TestId.SKU_INPUT)).toHaveValue(invalidProduct.sku);
    
    // Verify no product was added
    await expect(page.getByTestId(TestId.EMPTY_STATE)).toBeVisible();
  });
});
