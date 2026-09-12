// Product Controller - Phase 2: Enhanced Product Catalog & Search

import { prisma } from '../db/prisma.js';
import * as productService from '../services/productService.js';
import { productQuerySchema, searchQuerySchema } from '../schemas/validations.js';

/**
 * GET /api/products - List all products with advanced filtering
 * Supports: search, category, origin, process, roastLevel, price range, stock status
 */
export const getProducts = async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = productQuerySchema.parse(req.query);
    
    // Get products with filters
    const result = await productService.getProducts(validatedQuery);
    
    res.json({ 
      success: true, 
      data: result.products,
      pagination: result.pagination,
      filters: result.filters,
      count: result.products.length
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * GET /api/products/search - Full-text search with PostgreSQL ts_vector
 * Returns ranked results based on relevance
 */
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    // Validate search query
    const validated = searchQuerySchema.parse({ q });
    
    // Perform search
    const result = await productService.searchProducts(validated.q, {
      limit: 20,
      filters: req.query
    });
    
    res.json({
      success: true,
      data: result.products,
      totalCount: result.totalCount,
      searchQuery: result.searchQuery
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid search query', 
        details: error.errors 
      });
    }
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * GET /api/products/:id - Get single product by ID with full details
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await productService.getProductById(id);
    
    res.json({ success: true, data: product });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * GET /api/products/slug/:slug - Get product by SEO-friendly slug
 */
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const product = await productService.getProductBySlug(slug);
    
    res.json({ success: true, data: product });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    console.error('Error fetching product by slug:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * GET /api/categories - Get all active categories with hierarchy
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await productService.getCategories();
    
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * GET /api/categories/:slug - Get category with products
 */
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await productService.getCategoryBySlug(slug);
    
    res.json({ success: true, data: category });
  } catch (error) {
    if (error.message === 'Category not found') {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * GET /api/products/featured - Get featured products
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const products = await productService.getFeaturedProducts(parseInt(limit));
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * GET /api/products/related/:productId - Get related products
 */
export const getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 4 } = req.query;
    
    const products = await productService.getRelatedProducts(productId, parseInt(limit));
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
