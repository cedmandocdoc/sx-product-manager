/**
 * Test constants for E2E tests
 * This file contains all data-test-id selectors and test data used across test files
 */

export const TEST_IDS = {
  // Product Form selectors
  PRODUCT_FORM: 'product-form',
  TITLE_INPUT: 'product-title-input',
  SKU_INPUT: 'product-sku-input',
  PRICE_INPUT: 'product-price-input',
  STATUS_SELECT: 'product-status-select',
  ADD_BUTTON: 'add-product-button',
  
  // Product Table selectors
  PRODUCT_TABLE: 'product-table',
  PRODUCT_ROW: 'product-row',
  PRODUCT_TITLE: 'product-title',
  PRODUCT_SKU: 'product-sku',
  PRODUCT_PRICE: 'product-price',
  PRODUCT_STATUS: 'product-status',
  TOGGLE_BUTTON: 'toggle-status-button',
  EMPTY_STATE: 'empty-state',
  
  // Validation elements
  VALIDATION_ALERT: 'validation-alert',
} as const;

export const TEST_DATA = {
  VALID_PRODUCTS: [
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
  ],
  
  INVALID_PRODUCTS: [
    {
      title: '',
      sku: 'TEST-INVALID',
      price: '10.00',
      status: 'active' as const,
      expectedError: 'Please fill in all fields',
    },
    {
      title: 'Invalid Price Product',
      sku: 'TEST-PRICE',
      price: '-5.00',
      status: 'active' as const,
      expectedError: 'Please enter a valid price',
    },
    {
      title: 'Invalid Price Product 2',
      sku: 'TEST-PRICE-2',
      price: 'not-a-number',
      status: 'active' as const,
      expectedError: 'Please enter a valid price',
    },
  ],
} as const;

export const SELECTORS = {
  getProductRowBySku: (sku: string) => `[data-testid="${TEST_IDS.PRODUCT_ROW}"][data-sku="${sku}"]`,
  getToggleButtonBySku: (sku: string) => `${SELECTORS.getProductRowBySku(sku)} [data-testid="${TEST_IDS.TOGGLE_BUTTON}"]`,
  getProductStatusBySku: (sku: string) => `${SELECTORS.getProductRowBySku(sku)} [data-testid="${TEST_IDS.PRODUCT_STATUS}"]`,
} as const;
