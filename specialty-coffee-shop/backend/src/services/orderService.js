// Order Service - Business Logic for Order Processing & Checkout
// Phase 3: Cart, Checkout & Order Processing

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Process checkout with atomic transaction
 * @param {string} sessionId - Session ID from HTTP-only cookie
 * @param {Object} checkoutData - Customer and payment info
 * @param {string|null} userId - User ID if logged in
 * @returns {Promise<Object>} Created order
 */
export const processCheckout = async (sessionId, checkoutData, userId = null) => {
  // Get cart
  const cart = await prisma.cart.findUnique({
    where: userId ? { userId } : { sessionId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!cart || !cart.items.length) {
    throw new Error('Cart is empty');
  }

  // Validate stock availability for all items
  for (const item of cart.items) {
    const availableStock = item.product.stockCount - item.product.reservedCount;
    if (availableStock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.product.name}. Available: ${availableStock}`);
    }
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (Number(item.product.price) * item.quantity);
  }, 0);

  const taxRate = 0.15; // 15% VAT
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 100 ? 0 : 10;
  const totalAmount = subtotal + taxAmount + shippingAmount;

  // Generate unique order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  try {
    // ATOMIC TRANSACTION - All or nothing
    const order = await prisma.$transaction(async (tx) => {
      // 1. Reserve stock for all products
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            reservedCount: { increment: item.quantity }
          }
        });
      }

      // 2. Create order
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || 'guest',
          sessionId,
          subtotal,
          taxAmount,
          shippingAmount,
          totalAmount,
          customerEmail: checkoutData.email,
          customerName: checkoutData.customerName,
          customerPhone: checkoutData.phone,
          billingAddress: checkoutData.billingAddress,
          shippingAddress: checkoutData.shippingAddress,
          customerNotes: checkoutData.notes,
          status: 'PENDING',
          paymentStatus: 'pending',
          shippingStatus: 'pending'
        }
      });

      // 3. Create order items
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku || item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: Number(item.product.price) * item.quantity,
            taxRate: 0.15,
            taxAmount: (Number(item.product.price) * item.quantity) * 0.15,
            discountAmount: 0
          }
        });
      }

      // 4. Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      // 5. If guest cart, optionally delete it or keep for reference
      if (!userId) {
        await tx.cart.delete({
          where: { id: cart.id }
        });
      }

      return createdOrder;
    });

    // After successful transaction, decrement actual stock and release reserved
    await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockCount: { decrement: item.quantity },
            reservedCount: { decrement: item.quantity }
          }
        });
      }
    });

    // Fetch complete order with items
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return completeOrder;
  } catch (error) {
    console.error('Checkout transaction failed:', error);
    throw new Error(`Checkout failed: ${error.message}`);
  }
};

/**
 * Get orders for a user
 * @param {string} userId - User ID
 * @param {Object} options - Pagination and filter options
 * @returns {Promise<Object>} Orders list
 */
export const getUserOrders = async (userId, options = {}) => {
  const { page = 1, limit = 10, status } = options;

  const where = { userId };
  
  if (status) {
    where.status = status;
  }

  const skip = (page - 1) * limit;

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.order.count({ where })
  ]);

  return {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNextPage: skip + orders.length < totalCount,
      hasPreviousPage: page > 1
    }
  };
};

/**
 * Get single order by ID
 * @param {string} orderId - Order ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId, userId = null) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1
              }
            }
          }
        }
      },
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true
        }
      }
    }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Authorization check - users can only see their own orders
  if (userId && order.userId !== userId) {
    throw new Error('Unauthorized access to order');
  }

  return order;
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @param {string} updatedBy - User ID who made the update
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status, updatedBy = null) => {
  const updateData = { status };

  // Set timestamps based on status
  if (status === 'SHIPPED') {
    updateData.shippedAt = new Date();
    updateData.shippingStatus = 'shipped';
  } else if (status === 'DELIVERED') {
    updateData.deliveredAt = new Date();
    updateData.shippingStatus = 'delivered';
  } else if (status === 'CANCELLED') {
    updateData.cancelledAt = new Date();
    
    // Release reserved stock for cancelled orders
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (order && order.status === 'PENDING') {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              reservedCount: { decrement: item.quantity },
              stockCount: { increment: item.quantity }
            }
          });
        }
      });
    }
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: {
      items: true,
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });

  // Log audit trail
  if (updatedBy) {
    await prisma.auditLog.create({
      data: {
        userId: updatedBy,
        action: 'UPDATE_ORDER_STATUS',
        resource: 'Order',
        resourceId: orderId,
        oldValues: { status: order.status },
        newValues: { status }
      }
    });
  }

  return order;
};

/**
 * Get order statistics for dashboard
 * @returns {Promise<Object>} Order statistics
 */
export const getOrderStats = async () => {
  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PROCESSING' } }),
    prisma.order.count({ where: { status: 'SHIPPED' } }),
    prisma.order.count({ where: { status: 'DELIVERED' } }),
    prisma.order.count({ where: { status: 'CANCELLED' } }),
    prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { totalAmount: true }
    })
  ]);

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue: Number(totalRevenue._sum.totalAmount || 0)
  };
};

export default {
  processCheckout,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats
};
