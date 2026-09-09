// API Routes - Phase 2: Product Catalog & Search Enhancement

import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  getProductBySlug, 
  searchProducts, 
  getCategories, 
  getCategoryBySlug,
  getFeaturedProducts,
  getRelatedProducts 
} from '../controllers/productController.js';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { processCheckout, getOrdersBySession } from '../controllers/orderController.js';
import { validateSession } from '../middleware/sessionMiddleware.js';
import { searchLimiter, checkoutLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// ==================== Product Routes (Public) ====================

// Get all products with advanced filtering
router.get('/products', getProducts);

// Full-text search endpoint with rate limiting
router.get('/products/search', searchLimiter, searchProducts);

// Get featured products
router.get('/products/featured', getFeaturedProducts);

// Get product by ID
router.get('/products/:id', getProductById);

// Get product by slug (SEO-friendly)
router.get('/products/slug/:slug', getProductBySlug);

// Get related products
router.get('/products/related/:productId', getRelatedProducts);

// ==================== Category Routes (Public) ====================

// Get all categories
router.get('/categories', getCategories);

// Get category by slug with products
router.get('/categories/:slug', getCategoryBySlug);

// ==================== Cart Routes (Session Required) ====================

// Get cart contents
router.get('/cart', validateSession, getCart);

// Add item to cart
router.post('/cart', validateSession, addToCart);

// Update cart item quantity
router.put('/cart/:id', validateSession, updateCartItem);

// Remove item from cart
router.delete('/cart/:id', validateSession, removeFromCart);

// Clear entire cart
router.post('/cart/clear', validateSession, clearCart);

// ==================== Order Routes (Session Required) ====================

// Process checkout
router.post('/checkout', validateSession, checkoutLimiter, processCheckout);

// Get orders by session
router.get('/orders/:sessionId', validateSession, getOrdersBySession);

// ==================== Health Check ====================

// Cart/session status check
router.get('/cart/status', validateSession, (req, res) => {
  res.json({
    success: true,
    data: {
      sessionId: req.sessionId.substring(0, 8) + '...',
      isNewSession: req.isNewSession
    }
  });
});

export default router;
