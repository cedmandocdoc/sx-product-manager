export interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}
