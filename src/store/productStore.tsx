import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '../types/Product';

interface ProductState {
  products: Product[];
}

type ProductAction =
  | { type: 'ADD_PRODUCT'; payload: Omit<Product, 'id' | 'createdAt'> }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'TOGGLE_STATUS'; payload: string };

const initialState: ProductState = {
  products: []
};

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const newProduct: Product = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      return {
        ...state,
        products: [...state.products, newProduct]
      };
    }
    case 'UPDATE_PRODUCT': {
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id
            ? { ...product, ...action.payload.updates }
            : product
        )
      };
    }
    case 'REMOVE_PRODUCT': {
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    }
    case 'TOGGLE_STATUS': {
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload
            ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
            : product
        )
      };
    }
    default:
      return state;
  }
}

interface ProductContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  getMetrics: () => { total: number; active: number; inactive: number };
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const dispatchCustomEvent = (eventName: string, detail: any) => {
    const event = new CustomEvent(`sx-product-manager:${eventName}`, {
      detail,
      bubbles: true
    });
    window.dispatchEvent(event);
  };

  // Listen for dashboard requests for metrics
  useEffect(() => {
    const handleDashboardRequest = () => {
      // Send current metrics to dashboard
      dispatchCustomEvent('metrics-response', {
        metrics: getMetrics(state.products)
      });
    };

    window.addEventListener('sx-dashboard:request-metrics', handleDashboardRequest);

    return () => {
      window.removeEventListener('sx-dashboard:request-metrics', handleDashboardRequest);
    };
  }, [state.products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_PRODUCT', payload: productData });
    
    // Create the product object to include in the event
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    dispatchCustomEvent('product-added', {
      product: newProduct,
      metrics: getMetrics([...state.products, newProduct])
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates } });
    
    const updatedProducts = state.products.map(product =>
      product.id === id ? { ...product, ...updates } : product
    );
    
    dispatchCustomEvent('product-updated', {
      productId: id,
      updates,
      metrics: getMetrics(updatedProducts)
    });
  };

  const removeProduct = (id: string) => {
    const productToRemove = state.products.find(p => p.id === id);
    dispatch({ type: 'REMOVE_PRODUCT', payload: id });
    
    const updatedProducts = state.products.filter(p => p.id !== id);
    
    dispatchCustomEvent('product-removed', {
      productId: id,
      product: productToRemove,
      metrics: getMetrics(updatedProducts)
    });
  };

  const toggleProductStatus = (id: string) => {
    const product = state.products.find(p => p.id === id);
    if (product) {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      dispatch({ type: 'TOGGLE_STATUS', payload: id });
      
      const updatedProducts = state.products.map(p =>
        p.id === id ? { ...p, status: newStatus as 'active' | 'inactive' } : p
      );
      
      dispatchCustomEvent('product-status-toggled', {
        productId: id,
        oldStatus: product.status,
        newStatus,
        metrics: getMetrics(updatedProducts)
      });
    }
  };

  const getMetrics = (products = state.products) => {
    const total = products.length;
    const active = products.filter(p => p.status === 'active').length;
    const inactive = products.filter(p => p.status === 'inactive').length;
    
    return { total, active, inactive };
  };

  const contextValue: ProductContextType = {
    products: state.products,
    addProduct,
    updateProduct,
    removeProduct,
    toggleProductStatus,
    getMetrics
  };

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>;
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}
