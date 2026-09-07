// Cart Controller

import { PrismaClient } from '@prisma/client';
import { cartItemSchema, updateCartItemSchema } from '../schemas/validations.js';

const prisma = new PrismaClient();

// GET /api/cart - Get cart items for a session
export const getCart = async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID is required' });
    }
    
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Calculate subtotal for each item and total
    const itemsWithSubtotal = cartItems.map(item => ({
      ...item,
      subtotal: parseFloat(item.product.price) * item.quantity
    }));
    
    const total = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0);
    
    res.json({ 
      success: true, 
      data: itemsWithSubtotal, 
      total: parseFloat(total.toFixed(2)),
      itemCount: cartItems.length 
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// POST /api/cart - Add or update item in cart
export const addToCart = async (req, res) => {
  try {
    // Validate request body
    const validatedData = cartItemSchema.parse(req.body);
    const { productId, quantity, sessionId } = validatedData;
    
    // Check if product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient stock. Only ${product.stock} items available.` 
      });
    }
    
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        productId,
        sessionId
      }
    });
    
    let cartItem;
    
    if (existingItem) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          success: false, 
          error: `Cannot add that many. Only ${product.stock - existingItem.quantity} more available.` 
        });
      }
      
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          productId,
          quantity,
          sessionId
        }
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Item added to cart', 
      data: cartItem 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// PUT /api/cart/:id - Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate request body
    const validatedData = updateCartItemSchema.parse(req.body);
    const { quantity } = validatedData;
    
    // Find cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(id) },
      include: { product: true }
    });
    
    if (!cartItem) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }
    
    // Check stock availability
    if (quantity > cartItem.product.stock) {
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient stock. Only ${cartItem.product.stock} items available.` 
      });
    }
    
    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: { quantity }
    });
    
    res.json({ 
      success: true, 
      message: 'Cart updated', 
      data: updatedItem 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// DELETE /api/cart/:id - Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedItem = await prisma.cartItem.delete({
      where: { id: parseInt(id) }
    });
    
    if (!deletedItem) {
      return res.status(404).json({ success: false, error: 'Cart item not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Item removed from cart' 
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Clear entire cart for a session
export const clearCart = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID is required' });
    }
    
    await prisma.cartItem.deleteMany({
      where: { sessionId }
    });
    
    res.json({ 
      success: true, 
      message: 'Cart cleared' 
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
