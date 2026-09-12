// Order Controller

import { prisma } from '../db/prisma.js';
import { checkoutOrderSchema } from '../schemas/validations.js';

// POST /api/checkout - Process checkout and create order
export const processCheckout = async (req, res) => {
  try {
    // Validate request body
    const validatedData = checkoutOrderSchema.parse(req.body);
    const sessionId = req.sessionId || validatedData.sessionId;
    const { total, status = 'pending' } = validatedData;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID is required' });
    }
    
    // Get cart for this session
    const cart = await prisma.cart.findUnique({
      where: { sessionId }
    });
    
    const cartItems = cart?.items || [];
    
    if (cartItems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cart is empty. Cannot proceed with checkout.' 
      });
    }
    
    // Verify stock availability for all items
    for (const item of cartItems) {
      const stock = item.product.stockCount !== undefined ? item.product.stockCount : item.product.stock;
      if (stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient stock for ${item.product.name}. Only ${stock} available.` 
        });
      }
    }
    
    // Create order
    const order = await prisma.order.create({
      data: {
        sessionId,
        total: total || cartItems.reduce((acc, it) => acc + (it.product.price * it.quantity), 0),
        status,
        customerName: req.body.customerName || 'Coffee Enthusiast',
        customerEmail: req.body.customerEmail || 'customer@specialtycoffee.com'
      }
    });
    
    // Decrease product stock for each item
    for (const item of cartItems) {
      const currentStock = item.product.stockCount !== undefined ? item.product.stockCount : item.product.stock;
      const newStock = Math.max(0, currentStock - item.quantity);
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockCount: newStock,
          stock: newStock
        }
      });
    }
    
    // Clear the cart
    if (cart?.id) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Order placed successfully', 
      data: {
        orderId: order.id,
        sessionId: order.sessionId,
        total: parseFloat(order.total),
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error processing checkout:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// GET /api/orders/:sessionId - Get orders by session
export const getOrdersBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const orders = await prisma.order.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ 
      success: true, 
      data: orders, 
      count: orders.length 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
