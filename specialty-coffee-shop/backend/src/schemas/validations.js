// Zod validation schemas for API requests - Phase 2 Enhanced

import { z } from 'zod';

// Schema for adding/updating cart items
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99'),
  sessionId: z.string().min(1).max(255).optional()
});

// Schema for updating cart item quantity
export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99')
});

// Schema for checkout order
export const checkoutOrderSchema = z.object({
  sessionId: z.string().min(1).max(255).optional(),
  total: z.number().positive('Total must be a positive number'),
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).optional().default('pending')
});

// Schema for product query parameters (Phase 2: Advanced Filtering)
export const productQuerySchema = z.object({
  search: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  origin: z.string().max(100).optional(),
  process: z.string().max(50).optional(),
  roastLevel: z.string().max(50).optional(),
  minPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional(),
  maxPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional(),
  inStock: z.preprocess((val) => val === 'true' ? true : (val === 'false' ? false : undefined), z.boolean().optional()),
  isFeatured: z.preprocess((val) => val === 'true' ? true : (val === 'false' ? false : undefined), z.boolean().optional()),
  page: z.preprocess((val) => (val !== undefined && val !== '' && !isNaN(val)) ? parseInt(val, 10) : 1, z.number().min(1).default(1)),
  limit: z.preprocess((val) => (val !== undefined && val !== '' && !isNaN(val)) ? parseInt(val, 10) : 20, z.number().min(1).max(100).default(20))
});

// Schema for search query (Phase 2: Full-text Search)
export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required').max(200, 'Search query too long')
});

// Schema for product creation/update (Manager/Admin only)
export const productCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1),
  shortDescription: z.string().max(500).optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  stockCount: z.number().int().min(0).default(0),
  minOrderQty: z.number().int().min(1).default(1),
  maxOrderQty: z.number().int().min(1).default(100),
  
  // Extended attributes
  origin: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  farm: z.string().max(200).optional(),
  variety: z.string().max(100).optional(),
  process: z.enum(['Natural', 'Washed', 'Honey', 'Other']).optional(),
  roastLevel: z.enum(['Light', 'Medium', 'Dark', 'Other']).optional(),
  altitude: z.string().max(50).optional(),
  tastingNotes: z.string().max(500).optional(),
  flavorProfile: z.string().max(500).optional(),
  body: z.string().max(50).optional(),
  acidity: z.string().max(50).optional(),
  sweetness: z.string().max(50).optional(),
  aroma: z.string().max(50).optional(),
  aftertaste: z.string().max(50).optional(),
  brewMethod: z.string().max(200).optional(),
  grindSize: z.string().max(50).optional(),
  waterTemp: z.string().max(50).optional(),
  ratio: z.string().max(50).optional(),
  harvestDate: z.string().datetime().optional(),
  roastDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional()
  }).optional(),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  farmerStory: z.string().max(2000).optional(),
  processingStory: z.string().max(2000).optional(),
  
  // SEO
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
  seoKeywords: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  
  // Status
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'OUT_OF_STOCK']).default('DRAFT'),
  isVisible: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().uuid().optional()
});

// Schema for product update (partial)
export const productUpdateSchema = productCreateSchema.partial();

// Schema for category creation
export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().uuid().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true)
});

// Schema for category update
export const categoryUpdateSchema = categoryCreateSchema.partial();

// Type exports
export const CartItemInput = cartItemSchema;
export const UpdateCartItemInput = updateCartItemSchema;
export const CheckoutOrderInput = checkoutOrderSchema;
export const ProductQueryInput = productQuerySchema;
export const SearchQueryInput = searchQuerySchema;
export const ProductCreateInput = productCreateSchema;
export const ProductUpdateInput = productUpdateSchema;
export const CategoryCreateInput = categoryCreateSchema;
export const CategoryUpdateInput = categoryUpdateSchema;
