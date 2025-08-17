import { useProductContext } from '../store/productStore';

export const useProductStore = () => {
  const { products, addProduct, toggleProductStatus, getMetrics } = useProductContext();
  
  const metrics = getMetrics();

  return {
    products,
    metrics,
    addProduct,
    toggleProductStatus,
  };
};
