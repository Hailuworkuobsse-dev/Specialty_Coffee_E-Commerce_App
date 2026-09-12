import { pgTable, text, integer, numeric, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (anchored on Firebase UID)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role').default('CUSTOMER').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Categories
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Products
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  shortDescription: text('short_description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  comparePrice: numeric('compare_price', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD').notNull(),
  stockCount: integer('stock_count').default(0).notNull(),
  reservedCount: integer('reserved_count').default(0).notNull(),
  minOrderQty: integer('min_order_qty').default(1).notNull(),
  maxOrderQty: integer('max_order_qty').default(100).notNull(),
  origin: text('origin'),
  region: text('region'),
  farm: text('farm'),
  variety: text('variety'),
  process: text('process'),
  roastLevel: text('roast_level'),
  altitude: text('altitude'),
  tastingNotes: text('tasting_notes'),
  flavorProfile: text('flavor_profile'),
  body: text('body'),
  acidity: text('acidity'),
  sweetness: text('sweetness'),
  aroma: text('aroma'),
  brewMethod: text('brew_method'),
  status: text('status').default('PUBLISHED').notNull(),
  isVisible: boolean('is_visible').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  categoryId: text('category_id').references(() => categories.id),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Product Images
export const productImages = pgTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  altText: text('alt_text'),
  sortOrder: integer('sort_order').default(0).notNull(),
  isPrimary: boolean('is_primary').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Carts
export const carts = pgTable('carts', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().unique(),
  userId: text('user_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Cart Items
export const cartItems = pgTable('cart_items', {
  id: text('id').primaryKey(),
  cartId: text('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').default(1).notNull(),
  addedAt: timestamp('added_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Orders
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: text('user_id'),
  sessionId: text('session_id').notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('pending').notNull(),
  paymentStatus: text('payment_status').default('pending').notNull(),
  customerEmail: text('customer_email'),
  customerName: text('customer_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  cartItems: many(cartItems),
}));

export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));
