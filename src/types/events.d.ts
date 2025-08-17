import { Product } from "../models/Product";

export {}

type ProductManagerProductAddedEvent = CustomEvent<{
  product: Product;
}>

type ProductManagerProductStatusToggledEvent = CustomEvent<{
  productId: string;
  oldStatus: 'active' | 'inactive';
  newStatus: 'active' | 'inactive';
}>


declare global {
  interface WindowEventMap {
    "sx-product-manager:product-added": ProductManagerProductAddedEvent;
    "sx-product-manager:product-status-toggled": ProductManagerProductStatusToggledEvent;
  }
}