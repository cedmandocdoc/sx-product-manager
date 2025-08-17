import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types/Product';
import getLocalStorageItem from '../utils/getLocalStorageItem';
import setLocalStorageItem from '../utils/setLocalStorageItem';

interface ProductsContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  toggleProductStatus: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => getLocalStorageItem('sx:products') ?? []);

  const dispatchCustomEvent = (eventName: string, detail: any) => {
    const event = new CustomEvent(`sx-product-manager:${eventName}`, {
      detail,
      bubbles: true
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    setLocalStorageItem('sx:products', products);
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toString(),
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    dispatchCustomEvent('product-added', {
      product: newProduct
    });
  };

  const toggleProductStatus = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      
      setProducts(prevProducts => 
        prevProducts.map(p =>
          p.id === id 
            ? { ...p, status: newStatus }
            : p
        )
      );
      
      dispatchCustomEvent('product-status-toggled', {
        productId: id,
        oldStatus: product.status,
        newStatus
      });
    }
  };

  const contextValue: ProductsContextType = {
    products,
    addProduct,
    toggleProductStatus,
  };

  return <ProductsContext.Provider value={contextValue}>{children}</ProductsContext.Provider>;
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductProvider');
  }
  return context;
}
