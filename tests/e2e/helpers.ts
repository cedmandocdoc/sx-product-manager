import { Page, expect } from '@playwright/test';
import { TEST_IDS, TEST_DATA } from './constants';

/**
 * Helper utilities for Product Manager E2E tests
 */

export class ProductFormHelpers {
  constructor(private page: Page) {}

  /**
   * Fills the product form with provided data
   */
  async fillProductForm(product: typeof TEST_DATA.VALID_PRODUCTS[0]) {
    await this.page.getByTestId(TEST_IDS.TITLE_INPUT).fill(product.title);
    await this.page.getByTestId(TEST_IDS.SKU_INPUT).fill(product.sku);
    await this.page.getByTestId(TEST_IDS.PRICE_INPUT).fill(product.price);
    await this.page.getByTestId(TEST_IDS.STATUS_SELECT).selectOption(product.status);
  }

  /**
   * Submits the product form
   */
  async submitForm() {
    await this.page.getByTestId(TEST_IDS.ADD_BUTTON).click();
  }

  /**
   * Fills and submits a product in one action
   */
  async addProduct(product: typeof TEST_DATA.VALID_PRODUCTS[0]) {
    await this.fillProductForm(product);
    await this.submitForm();
    
    // Wait for product to appear in table
    await expect(
      this.page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${product.sku}"]`)
    ).toBeVisible();
  }

  /**
   * Verifies form is cleared after submission
   */
  async verifyFormCleared() {
    await expect(this.page.getByTestId(TEST_IDS.TITLE_INPUT)).toHaveValue('');
    await expect(this.page.getByTestId(TEST_IDS.SKU_INPUT)).toHaveValue('');
    await expect(this.page.getByTestId(TEST_IDS.PRICE_INPUT)).toHaveValue('');
    await expect(this.page.getByTestId(TEST_IDS.STATUS_SELECT)).toHaveValue('active');
  }

  /**
   * Handles validation dialog with expected message
   */
  setupValidationHandler(expectedMessage: string) {
    this.page.on('dialog', dialog => {
      expect(dialog.message()).toBe(expectedMessage);
      dialog.accept();
    });
  }

  /**
   * Removes all dialog listeners
   */
  clearDialogHandlers() {
    this.page.removeAllListeners('dialog');
  }
}

export class ProductTableHelpers {
  constructor(private page: Page) {}

  /**
   * Gets product row by SKU
   */
  getProductRow(sku: string) {
    return this.page.locator(`[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${sku}"]`);
  }

  /**
   * Verifies product details in table
   */
  async verifyProductInTable(product: typeof TEST_DATA.VALID_PRODUCTS[0]) {
    const productRow = this.getProductRow(product.sku);
    await expect(productRow).toBeVisible();
    
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_TITLE)).toContainText(product.title);
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_SKU)).toContainText(product.sku);
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_PRICE)).toContainText(`$${parseFloat(product.price).toFixed(2)}`);
    
    const expectedStatus = product.status.charAt(0).toUpperCase() + product.status.slice(1);
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText(expectedStatus);
  }

  /**
   * Toggles product status by SKU
   */
  async toggleProductStatus(sku: string) {
    const productRow = this.getProductRow(sku);
    await productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON).click();
  }

  /**
   * Verifies product status
   */
  async verifyProductStatus(sku: string, expectedStatus: 'active' | 'inactive') {
    const productRow = this.getProductRow(sku);
    const statusText = expectedStatus.charAt(0).toUpperCase() + expectedStatus.slice(1);
    await expect(productRow.getByTestId(TEST_IDS.PRODUCT_STATUS)).toContainText(statusText);
    
    const buttonText = expectedStatus === 'active' ? 'Deactivate' : 'Activate';
    await expect(productRow.getByTestId(TEST_IDS.TOGGLE_BUTTON)).toContainText(buttonText);
  }

  /**
   * Verifies empty state is displayed
   */
  async verifyEmptyState() {
    await expect(this.page.getByTestId(TEST_IDS.EMPTY_STATE)).toBeVisible();
    await expect(this.page.getByTestId(TEST_IDS.EMPTY_STATE)).toContainText('No products yet. Add your first product above!');
  }

  /**
   * Verifies table is visible with product count
   */
  async verifyTableWithProductCount(expectedCount: number) {
    await expect(this.page.getByTestId(TEST_IDS.PRODUCT_TABLE)).toBeVisible();
    const productRows = this.page.getByTestId(TEST_IDS.PRODUCT_ROW);
    await expect(productRows).toHaveCount(expectedCount);
  }
}

export class TestHelpers {
  form: ProductFormHelpers;
  table: ProductTableHelpers;

  constructor(private page: Page) {
    this.form = new ProductFormHelpers(page);
    this.table = new ProductTableHelpers(page);
  }

  /**
   * Navigates to the application and waits for it to load
   */
  async navigateAndWait() {
    await this.page.goto('/');
    await expect(this.page.getByTestId(TEST_IDS.PRODUCT_FORM)).toBeVisible();
  }

  /**
   * Takes a screenshot with timestamp for uniqueness
   */
  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await expect(this.page).toHaveScreenshot(`${name}-${timestamp}.png`);
  }

  /**
   * Adds multiple products for testing
   */
  async addMultipleProducts(products: typeof TEST_DATA.VALID_PRODUCTS) {
    for (const product of products) {
      await this.form.addProduct(product);
    }
  }

  /**
   * Waits for network to be idle (useful for state synchronization)
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
}
