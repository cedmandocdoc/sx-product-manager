import ProductManager from './components/ProductManager';
import { ProductsProvider } from './contexts/ProductsContext';

function App() {
  return (
    <ProductsProvider>
      <ProductManager />
    </ProductsProvider>
  );
}

export default App;
