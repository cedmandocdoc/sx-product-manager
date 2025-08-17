import { ProductForm } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';
import { ProductsProvider, useProductsContext } from './contexts/ProductsContext';

function App() {
  const { products, addProduct, toggleProductStatus } = useProductsContext();

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Product Manager
        </h1>
        <p className="text-gray-500 text-base">
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
