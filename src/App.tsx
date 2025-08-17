import { ProductForm } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';
import { ProductsProvider, useProductsContext } from './contexts/ProductsContext';

function App() {
  const { products, addProduct, toggleProductStatus } = useProductsContext();

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
}

export default () => {
  return (
    <ProductsProvider>
      <App />
    </ProductsProvider>
  );
};
