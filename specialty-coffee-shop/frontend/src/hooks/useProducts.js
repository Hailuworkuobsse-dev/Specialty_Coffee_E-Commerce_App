// Custom Hook for Products with Search and Filter

import { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../api/client';

export const useProducts = (searchTerm = '', selectedCategory = '') => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productAPI.getAll(searchTerm, selectedCategory);
      
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await productAPI.getAll();
      
      if (response.success && response.data) {
        const uniqueCategories = [...new Set(response.data.map(p => p.category))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    products,
    categories,
    isLoading,
    error,
    refreshProducts: fetchProducts
  };
};

export default useProducts;
