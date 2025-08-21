/**
 * Test IDs enum for E2E tests
 * This enum contains all data-test-id selectors used across test files
 */

export enum TestId {
  // Product Form selectors
  PRODUCT_FORM = 'product-form',
  TITLE_INPUT = 'product-title-input',
  SKU_INPUT = 'product-sku-input',
  PRICE_INPUT = 'product-price-input',
  STATUS_SELECT = 'product-status-select',
  ADD_BUTTON = 'add-product-button',
  
  // Product Table selectors
  PRODUCT_TABLE = 'product-table',
  PRODUCT_ROW = 'product-row',
  PRODUCT_TITLE = 'product-title',
  PRODUCT_SKU = 'product-sku',
  PRODUCT_PRICE = 'product-price',
  PRODUCT_STATUS = 'product-status',
  TOGGLE_BUTTON = 'toggle-status-button',
  EMPTY_STATE = 'empty-state',
}
