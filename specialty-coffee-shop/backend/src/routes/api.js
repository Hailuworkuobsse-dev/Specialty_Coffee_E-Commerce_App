// API Routes

import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { processCheckout, getOrdersBySession } from '../controllers/orderController.js';

const router = Router();

// Product routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Cart routes
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart/:id', updateCartItem);
router.delete('/cart/:id', removeFromCart);
router.post('/cart/clear', clearCart);

// Order routes
router.post('/checkout', processCheckout);
router.get('/orders/:sessionId', getOrdersBySession);

export default router;
