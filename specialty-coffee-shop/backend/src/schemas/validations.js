// Zod validation schemas for API requests

import { z } from 'zod';

// Schema for adding/updating cart items
export const cartItemSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99'),
  sessionId: z.string().min(1, 'Session ID is required').max(255)
});

// Schema for updating cart item quantity
export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99')
});

// Schema for checkout order
export const checkoutOrderSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required').max(255),
  total: z.number().positive('Total must be a positive number'),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).optional().default('pending')
});

// Schema for product query parameters
export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional()
});

// Type exports
export const CartItemInput = cartItemSchema;
export const UpdateCartItemInput = updateCartItemSchema;
export const CheckoutOrderInput = checkoutOrderSchema;
export const ProductQueryInput = productQuerySchema;
