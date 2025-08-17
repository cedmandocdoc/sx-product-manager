export type Product = {
  id: string;
  title: string;
  sku: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt: string;
}
