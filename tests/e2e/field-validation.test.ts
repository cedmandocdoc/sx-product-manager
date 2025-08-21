import { test, expect } from '@playwright/test';
import { TEST_IDS, TEST_DATA } from './constants';

test.describe('Field Validation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show validation error for empty title field', async ({ page }) => {
    const invalidProduct = TEST_DATA.INVALID_PRODUCTS[0]; // empty title
    
    // Fill form with empty title
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(invalidProduct.title); // empty string
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(invalidProduct.sku);
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(invalidProduct.price);
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(invalidProduct.status);
    
    // Set up dialog handler before clicking submit
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe(invalidProduct.expectedError);
      dialog.accept();
    });
    
    // Take screenshot before submission
    await expect(page).toHaveScreenshot('validation-empty-title-before.png');
    
    // Submit form and expect validation error
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Take screenshot after validation error
    await expect(page).toHaveScreenshot('validation-empty-title-after.png');
    
    // Verify form values are preserved
    await expect(page.getByTestId(TEST_IDS.SKU_INPUT)).toHaveValue(invalidProduct.sku);
    await expect(page.getByTestId(TEST_IDS.PRICE_INPUT)).toHaveValue(invalidProduct.price);
    
    // Verify no product was added
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).toBeVisible();
  });

  test('should show validation error for empty SKU field', async ({ page }) => {
    // Fill form with empty SKU
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill('Test Product');
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(''); // empty SKU
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill('10.00');
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption('active');
    
    // Set up dialog handler
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe('Please fill in all fields');
      dialog.accept();
    });
    
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Verify form values are preserved
    await expect(page.getByTestId(TEST_IDS.TITLE_INPUT)).toHaveValue('Test Product');
    await expect(page.getByTestId(TEST_IDS.PRICE_INPUT)).toHaveValue('10.00');
    
    // Verify no product was added
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).toBeVisible();
  });

  test('should show validation error for empty price field', async ({ page }) => {
    // Fill form with empty price
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill('Test Product');
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill('TEST-001');
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(''); // empty price
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption('active');
    
    // Set up dialog handler
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe('Please fill in all fields');
      dialog.accept();
    });
    
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Verify form values are preserved
    await expect(page.getByTestId(TEST_IDS.TITLE_INPUT)).toHaveValue('Test Product');
    await expect(page.getByTestId(TEST_IDS.SKU_INPUT)).toHaveValue('TEST-001');
    
    // Verify no product was added
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).toBeVisible();
  });

  test('should show validation error for negative price', async ({ page }) => {
    const invalidProduct = TEST_DATA.INVALID_PRODUCTS[1]; // negative price
    
    // Fill form with negative price
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(invalidProduct.title);
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(invalidProduct.sku);
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(invalidProduct.price);
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(invalidProduct.status);
    
    // Set up dialog handler
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe(invalidProduct.expectedError);
      dialog.accept();
    });
    
    // Take screenshot before submission
    await expect(page).toHaveScreenshot('validation-negative-price-before.png');
    
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Take screenshot after validation error
    await expect(page).toHaveScreenshot('validation-negative-price-after.png');
    
    // Verify form values are preserved
    await expect(page.getByTestId(TEST_IDS.TITLE_INPUT)).toHaveValue(invalidProduct.title);
    await expect(page.getByTestId(TEST_IDS.SKU_INPUT)).toHaveValue(invalidProduct.sku);
    
    // Verify no product was added
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).toBeVisible();
  });

  test('should show validation error for invalid price format', async ({ page }) => {
    const invalidProduct = TEST_DATA.INVALID_PRODUCTS[2]; // non-numeric price
    
    // Fill form with invalid price format
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill(invalidProduct.title);
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill(invalidProduct.sku);
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill(invalidProduct.price);
    await page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(invalidProduct.status);
    
    // Set up dialog handler
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe(invalidProduct.expectedError);
      dialog.accept();
    });
    
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Verify form values are preserved
    await expect(page.getByTestId(TEST_IDS.TITLE_INPUT)).toHaveValue(invalidProduct.title);
    await expect(page.getByTestId(TEST_IDS.SKU_INPUT)).toHaveValue(invalidProduct.sku);
    
    // Verify no product was added
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).toBeVisible();
  });

  test('should successfully submit after fixing validation errors', async ({ page }) => {
    // First, try to submit with empty title
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill('');
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill('TEST-001');
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill('10.00');
    
    // Handle first validation error
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe('Please fill in all fields');
      dialog.accept();
    });
    
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Fix the validation error by adding title
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill('Valid Product');
    
    // Remove dialog handler and submit again
    page.removeAllListeners('dialog');
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Verify product was added successfully
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).not.toBeVisible();
    await expect(page.getByTestId(TEST_IDS.PRODUCT_TABLE)).toBeVisible();
    
    const productRow = page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="TEST-001"]`);
    await expect(productRow).toBeVisible();
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_TITLE)).toContainText('Valid Product');
    
    // Take screenshot of successful submission after validation fix
    await expect(page).toHaveScreenshot('validation-fixed-success.png');
  });

  test('should handle multiple validation errors in sequence', async ({ page }) => {
    let dialogCount = 0;
    const expectedMessages = [
      'Please fill in all fields', // empty title
      'Please enter a valid price'  // negative price
    ];
    
    // Handle multiple dialog interactions
    page.on('dialog', dialog => {
      expect(dialog.message()).toBe(expectedMessages[dialogCount]);
      dialogCount++;
      dialog.accept();
    });
    
    // First attempt: empty title
    await page.getByTestId(TEST_IDS.SKU_INPUT).fill('TEST-001');
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill('10.00');
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Second attempt: fix title but add negative price
    await page.getByTestId(TEST_IDS.TITLE_INPUT).fill('Test Product');
    await page.getByTestId(TEST_IDS.PRICE_INPUT).fill('-5.00');
    await page.getByTestId(TEST_IDS.ADD_BUTTON).click();
    
    // Verify both dialogs were shown
    expect(dialogCount).toBe(2);
    
    // Verify no product was added
    await expect(page.getByTestId(TEST_IDS.EMPTY_STATE)).toBeVisible();
  });
});
