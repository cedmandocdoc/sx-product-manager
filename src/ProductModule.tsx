import React from 'react';
import { ProductForm } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';
import { useProductStore } from './hooks/useProductStore';
import { ProductProvider } from './store/productStore';

const ProductModuleContent: React.FC = () => {
  const { products, addProduct, toggleProductStatus } = useProductStore();

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#212529'
        }}>
          Product Manager
        </h1>
        <p style={{ 
          margin: 0, 
          color: '#6c757d', 
          fontSize: '16px'
        }}>
          Manage your product catalog with real-time updates
        </p>
      </div>
      
      <ProductForm onSubmit={addProduct} />
      <ProductTable products={products} onToggleStatus={toggleProductStatus} />
    </div>
  );
};

const ProductModule: React.FC = () => {
  return (
    <ProductProvider>
      <ProductModuleContent />
    </ProductProvider>
  );
};

export default ProductModule;
