import React, { useState } from 'react';
import { Product } from '../models/Product';

type ProductFormProps = {
  onSubmit: (product: Omit<Product, 'id' | 'createdAt'>) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    price: '',
    status: 'active' as 'active' | 'inactive',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.sku || !formData.price) {
      alert('Please fill in all fields');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      alert('Please enter a valid price');
      return;
    }

    onSubmit({
      title: formData.title,
      sku: formData.sku,
      price,
      status: formData.status,
    });

    setFormData({
      title: '',
      sku: '',
      price: '',
      status: 'active',
    });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200" data-testid="product-form">
      <h2 className="mt-0 mb-4 text-gray-600 text-xl font-semibold">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium text-gray-600 text-sm">
              Title *
            </label>
            <input
              name='title'
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product title"
              data-testid="product-title-input"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-600 text-sm">
              SKU *
            </label>
            <input
              name='sku'
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter SKU"
              data-testid="product-sku-input"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium text-gray-600 text-sm">
              Price *
            </label>
            <input
              name='price'
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              data-testid="product-price-input"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-600 text-sm">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="product-status-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white border-none px-5 py-2.5 rounded text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors duration-200"
          data-testid="add-product-button"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};
