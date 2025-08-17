import React from 'react';
import ProductModule from './ProductModule';
import { ProductProvider } from './store/productStore';

function App() {
  return (
    <ProductProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <ProductModule />
      </div>
    </ProductProvider>
  );
}

export default App;
