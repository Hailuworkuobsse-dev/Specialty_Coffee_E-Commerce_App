// Cart Controller - Phase 1: Secure Session-Based Cart (CRITICAL FIX)
// SEC-01/SC-05: Uses session from HTTP-only cookie, NOT from URL/query params

import { PrismaClient } from '@prisma/client';
import { cartItemSchema, updateCartItemSchema } from '../schemas/validations.js';
import errorHandler from '../middleware/errorHandler.js';

const logger = errorHandler.logger;

const prisma = new PrismaClient();

/**
 * Get or create cart for session
 * Links cart to session ID from secure cookie
 */
const getOrCreateCart = async (sessionId) => {
  // Try to find existing cart by session
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              images: true
            }
          }
        },
        orderBy: { addedAt: 'desc' }
      }
    }
  });
  
  // Create new cart if doesn't exist
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        sessionId,
        items: { create: [] }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true
              }
            }
          }
        }
      }
    });
  }
  
  return cart;
};

// GET /api/cart - Get cart items for current session (from cookie)
export const getCart = async (req, res, next) => {
  try {
    // CRITICAL FIX: Get sessionId from req.sessionId (set by sessionMiddleware from cookie)
    // NOT from req.query.sessionId (which was the security vulnerability)
    const sessionId = req.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'SESSION_REQUIRED', message: 'Session not found' } 
      });
    }
    
    const cart = await getOrCreateCart(sessionId);
    
    // Calculate totals
    const itemsWithSubtotal = cart.items.map(item => ({
      ...item,
      subtotal: parseFloat(item.product.price) * item.quantity
    }));
    
    const total = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);
    
    logger.info(`Cart retrieved for session ${sessionId.substring(0, 8)}...`, { itemCount: cart.items.length });
    
    res.json({ 
      success: true, 
      data: {
        items: itemsWithSubtotal,
        total: parseFloat(total.toFixed(2)),
        itemCount: cart.items.length,
        currency: 'USD'
      }
    });
  } catch (error) {
    logger.error('Error fetching cart:', error);
    next(error);
  }
};

// POST /api/cart - Add or update item in cart (session from cookie)
export const addToCart = async (req, res, next) => {
  try {
    const sessionId = req.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'SESSION_REQUIRED', message: 'Session not found' } 
      });
    }
    
    // Validate request body
    const validatedData = cartItemSchema.parse(req.body);
    const { productId, quantity } = validatedData;
    
    // Check if product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' } 
      });
    }
    
    if (product.stockCount < quantity) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INSUFFICIENT_STOCK', 
          message: `Only ${product.stockCount} items available` 
        } 
      });
    }
    
    // Get or create cart
    const cart = await getOrCreateCart(sessionId);
    
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });
    
    let cartItem;
    
    if (existingItem) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stockCount) {
        return res.status(400).json({ 
          success: false, 
          error: { 
            code: 'QUANTITY_EXCEEDED', 
            message: `Cannot add that many. Only ${product.stockCount - existingItem.quantity} more available.` 
          } 
        });
      }
      
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: newQuantity,
          updatedAt: new Date()
        },
        include: { product: true }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        },
        include: { product: true }
      });
    }
    
    logger.info(`Item added to cart: ${productId}, qty: ${quantity}`, { sessionId: sessionId.substring(0, 8) });
    
    res.json({ 
      success: true, 
      message: 'Item added to cart', 
      data: cartItem 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Invalid request data',
          details: error.errors 
        } 
      });
    }
    logger.error('Error adding to cart:', error);
    next(error);
  }
};

// PUT /api/cart/:id - Update cart item quantity
export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sessionId = req.sessionId;
    
    // Validate request body
    const validatedData = updateCartItemSchema.parse(req.body);
    const { quantity } = validatedData;
    
    // Find cart item and verify it belongs to this session
    const cart = await getOrCreateCart(sessionId);
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cartId: cart.id
      },
      include: { product: true }
    });
    
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'ITEM_NOT_FOUND', message: 'Cart item not found' } 
      });
    }
    
    // Check stock availability
    if (quantity > cartItem.product.stockCount) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INSUFFICIENT_STOCK', 
          message: `Only ${cartItem.product.stockCount} items available` 
        } 
      });
    }
    
    // Update quantity or remove if quantity is 0
    let updatedItem;
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      updatedItem = { ...cartItem, quantity: 0, deleted: true };
    } else {
      updatedItem = await prisma.cartItem.update({
        where: { id },
        data: { 
          quantity,
          updatedAt: new Date()
        },
        include: { product: true }
      });
    }
    
    logger.info(`Cart item updated: ${id}, qty: ${quantity}`, { sessionId: sessionId.substring(0, 8) });
    
    res.json({ 
      success: true, 
      message: 'Cart updated', 
      data: updatedItem 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Invalid request data',
          details: error.errors 
        } 
      });
    }
    logger.error('Error updating cart:', error);
    next(error);
  }
};

// DELETE /api/cart/:id - Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sessionId = req.sessionId;
    
    // Verify cart belongs to this session
    const cart = await getOrCreateCart(sessionId);
    
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cartId: cart.id
      }
    });
    
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'ITEM_NOT_FOUND', message: 'Cart item not found' } 
      });
    }
    
    await prisma.cartItem.delete({
      where: { id }
    });
    
    logger.info(`Item removed from cart: ${id}`, { sessionId: sessionId.substring(0, 8) });
    
    res.json({ 
      success: true, 
      message: 'Item removed from cart' 
    });
  } catch (error) {
    logger.error('Error removing from cart:', error);
    next(error);
  }
};

// Clear entire cart for current session
export const clearCart = async (req, res, next) => {
  try {
    const sessionId = req.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'SESSION_REQUIRED', message: 'Session not found' } 
      });
    }
    
    const cart = await getOrCreateCart(sessionId);
    
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
    
    logger.info(`Cart cleared for session`, { sessionId: sessionId.substring(0, 8) });
    
    res.json({ 
      success: true, 
      message: 'Cart cleared' 
    });
  } catch (error) {
    logger.error('Error clearing cart:', error);
    next(error);
  }
};
