import React from 'react';
import { Product } from '../models/Product';

type ProductTableProps = {
  products: Product[];
  onToggleStatus: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onToggleStatus }) => {
  if (products.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '48px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#6c757d'
      }} data-testid="empty-state">
        <p style={{ margin: 0, fontSize: '16px' }}>No products yet. Add your first product above!</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e9ecef' }} data-testid="product-table">
      <h2 style={{ margin: 0, padding: '16px 24px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef', color: '#495057' }}>
        Products ({products.length})
      </h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>
                Title
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>
                SKU
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>
                Price
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>
                Status
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#495057', borderBottom: '1px solid #e9ecef' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }} data-testid="product-row" data-sku={product.sku}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#212529' }} data-testid="product-title">{product.title}</div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      Created: {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#495057', borderBottom: '1px solid #e9ecef' }} data-testid="product-sku">
                  {product.sku}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '500', color: '#212529', borderBottom: '1px solid #e9ecef' }} data-testid="product-price">
                  ${product.price.toFixed(2)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: product.status === 'active' ? '#d4edda' : '#f8d7da',
                      color: product.status === 'active' ? '#155724' : '#721c24',
                    }}
                    data-testid="product-status"
                  >
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>
                  <button
                    onClick={() => onToggleStatus(product.id)}
                    style={{
                      backgroundColor: product.status === 'active' ? '#dc3545' : '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                    data-testid="toggle-status-button"
                  >
                    {product.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
