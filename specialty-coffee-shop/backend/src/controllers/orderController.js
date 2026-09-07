// Order Controller

import { PrismaClient } from '@prisma/client';
import { checkoutOrderSchema } from '../schemas/validations.js';

const prisma = new PrismaClient();

// POST /api/checkout - Process checkout and create order
export const processCheckout = async (req, res) => {
  try {
    // Validate request body
    const validatedData = checkoutOrderSchema.parse(req.body);
    const { sessionId, total, status = 'pending' } = validatedData;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'Session ID is required' });
    }
    
    // Get cart items for this session
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: { product: true }
    });
    
    if (cartItems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cart is empty. Cannot proceed with checkout.' 
      });
    }
    
    // Verify stock availability for all items
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available.` 
        });
      }
    }
    
    // Create order
    const order = await prisma.order.create({
      data: {
        sessionId,
        total,
        status
      }
    });
    
    // Decrease product stock for each item
    const stockUpdates = cartItems.map(item => 
      prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    );
    
    await Promise.all(stockUpdates);
    
    // Clear the cart
    await prisma.cartItem.deleteMany({
      where: { sessionId }
    });
    
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
