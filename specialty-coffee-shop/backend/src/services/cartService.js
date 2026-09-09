// Cart Service - Business Logic for Shopping Cart Management
// Phase 3: Cart, Checkout & Order Processing

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get or create cart for session/user
 * @param {string} sessionId - Session ID from HTTP-only cookie
 * @param {string|null} userId - User ID if logged in
 * @returns {Promise<Object>} Cart with items
 */
export const getOrCreateCart = async (sessionId, userId = null) => {
  // If user is logged in, use their user-associated cart
  if (userId) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
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
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          sessionId: `user_${userId}`
        },
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
        }
      });
    }

    return cart;
  }

  // Guest cart - linked to sessionId
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
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
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
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
      }
    });
  }

  return cart;
};

/**
 * Add item to cart
 * @param {string} sessionId - Session ID
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {string|null} userId - User ID if logged in
 * @returns {Promise<Object>} Updated cart
 */
export const addToCart = async (sessionId, productId, quantity = 1, userId = null) => {
  // Validate product exists and has stock
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.stockCount < quantity) {
    throw new Error(`Insufficient stock. Available: ${product.stockCount}`);
  }

  const cart = await getOrCreateCart(sessionId, userId);

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    
    if (newQuantity > product.stockCount) {
      throw new Error(`Insufficient stock. Maximum available: ${product.stockCount}`);
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
  }

  return getOrCreateCart(sessionId, userId);
};

/**
 * Update cart item quantity
 * @param {string} sessionId - Session ID
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart
 */
export const updateCartItem = async (sessionId, itemId, quantity) => {
  const cart = await getOrCreateCart(sessionId);

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true }
  });

  if (!cartItem || cartItem.cartId !== cart.id) {
    throw new Error('Cart item not found');
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    if (quantity > cartItem.product.stockCount) {
      throw new Error(`Insufficient stock. Maximum available: ${cartItem.product.stockCount}`);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  }

  return getOrCreateCart(sessionId);
};

/**
 * Remove item from cart
 * @param {string} sessionId - Session ID
 * @param {string} itemId - Cart item ID
 * @returns {Promise<Object>} Updated cart
 */
export const removeFromCart = async (sessionId, itemId) => {
  const cart = await getOrCreateCart(sessionId);

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId }
  });

  if (!cartItem || cartItem.cartId !== cart.id) {
    throw new Error('Cart item not found');
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  return getOrCreateCart(sessionId);
};

/**
 * Clear entire cart
 * @param {string} sessionId - Session ID
 * @param {string|null} userId - User ID if logged in
 * @returns {Promise<Object>} Empty cart
 */
export const clearCart = async (sessionId, userId = null) => {
  const cart = await getOrCreateCart(sessionId, userId);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  return getOrCreateCart(sessionId, userId);
};

/**
 * Merge guest cart into user cart on login
 * @param {string} sessionId - Guest session ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Merged cart
 */
export const mergeCarts = async (sessionId, userId) => {
  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true }
  });

  const userCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  });

  if (!guestCart || !guestCart.items.length) {
    // No guest cart to merge
    return getOrCreateCart(sessionId, userId);
  }

  if (!userCart) {
    // Create new user cart and transfer guest items
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: { userId }
    });
    return getOrCreateCart(sessionId, userId);
  }

  // Merge items
  for (const guestItem of guestCart.items) {
    const existingUserItem = userCart.items.find(
      item => item.productId === guestItem.productId
    );

    if (existingUserItem) {
      const newQuantity = existingUserItem.quantity + guestItem.quantity;
      await prisma.cartItem.update({
        where: { id: existingUserItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: guestItem.productId,
          quantity: guestItem.quantity
        }
      });
    }
  }

  // Delete guest cart
  await prisma.cart.delete({ where: { id: guestCart.id } });

  return getOrCreateCart(sessionId, userId);
};

/**
 * Calculate cart totals
 * @param {Object} cart - Cart object with items
 * @returns {Object} Cart with calculated totals
 */
export const calculateCartTotals = (cart) => {
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (Number(item.product.price) * item.quantity);
  }, 0);

  const taxRate = 0.15; // 15% VAT
  const taxAmount = subtotal * taxRate;
  const shippingAmount = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + taxAmount + shippingAmount;

  return {
    ...cart,
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    shippingAmount: parseFloat(shippingAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
  };
};

export default {
  getOrCreateCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCarts,
  calculateCartTotals
};
