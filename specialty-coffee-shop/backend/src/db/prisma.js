// Prisma Client & In-Memory Store Provider
// Seamlessly provides rich in-memory data for 100 Ethiopian products across 10 categories
// when external database is not connected (standard AI Studio development environment)

import { v4 as uuidv4 } from 'uuid';

const COFFEE_IMAGES = [
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80'
];

const INITIAL_CATEGORIES = [
  { id: 'cat_001', name: 'Roasted Coffee', slug: 'roasted-coffee', description: 'Freshly roasted whole bean Ethiopian coffees', sortOrder: 1, isActive: true },
  { id: 'cat_002', name: 'Green Beans', slug: 'green-beans', description: 'Raw unroasted green coffee beans from Ethiopian micro-lots', sortOrder: 2, isActive: true },
  { id: 'cat_003', name: 'Ground Coffee', slug: 'ground-coffee', description: 'Expertly ground coffee for your preferred brew method', sortOrder: 3, isActive: true },
  { id: 'cat_004', name: 'Coffee Subscriptions', slug: 'subscriptions', description: 'Monthly curated specialty coffee deliveries', sortOrder: 4, isActive: true },
  { id: 'cat_005', name: 'RTD (Ready-to-Drink)', slug: 'rtd', description: 'Cold brew and ready-to-drink craft coffee cans', sortOrder: 5, isActive: true },
  { id: 'cat_006', name: 'Functional Blends', slug: 'functional-blends', description: 'Specialty coffee blended with adaptogens and botanical extracts', sortOrder: 6, isActive: true },
  { id: 'cat_007', name: 'Confectionery', slug: 'confectionery', description: 'Artisanal coffee chocolates, bean bites, and treats', sortOrder: 7, isActive: true },
  { id: 'cat_008', name: 'Brewing Equipment', slug: 'brewing-equipment', description: 'Drippers, scales, kettles, and precision grinders', sortOrder: 8, isActive: true },
  { id: 'cat_009', name: 'Merchandise', slug: 'merchandise', description: 'Ceramic mugs, apparel, and coffee enthusiast lifestyle gear', sortOrder: 9, isActive: true },
  { id: 'cat_010', name: 'Gift Sets', slug: 'gift-sets', description: 'Curated specialty coffee gift collections and tasting boxes', sortOrder: 10, isActive: true }
];

const ORIGINS = ['Yirgacheffe', 'Sidamo', 'Guji', 'Harrar', 'Limu', 'Jimma', 'Kaffa'];
const FARMS = ['Adame Tulu', 'Konga', 'Worka Sakaro', 'Desta', 'Mormora', 'Odo Shakiso', 'Gedeo', 'Bonga'];
const PROCESSES = ['Natural', 'Washed', 'Honey'];
const ROASTS = ['Light', 'Medium', 'Dark'];
const TASTING_NOTES = [
  'Floral, Citrus, Bergamot & Jasmine',
  'Wild Blueberry, Dried Fig & Milk Chocolate',
  'Peach, Apricot, Sweet Honey & Lavender',
  'Ripe Blackberry, Red Wine & Cocoa Nibs',
  'Meyer Lemon, Lemongrass & Cane Sugar',
  'Dark Chocolate, Brown Spice & Black Cherry'
];

function generate100Products() {
  const products = [];
  let idCounter = 1;

  for (const cat of INITIAL_CATEGORIES) {
    const countForCat = 10; // 10 products per category = 100 products total
    for (let i = 0; i < countForCat; i++) {
      const origin = ORIGINS[(idCounter + i) % ORIGINS.length];
      const farm = FARMS[(idCounter + i) % FARMS.length];
      const process = PROCESSES[(idCounter + i) % PROCESSES.length];
      const roast = ROASTS[(idCounter + i) % ROASTS.length];
      const tastingNote = TASTING_NOTES[(idCounter + i) % TASTING_NOTES.length];
      const imgUrl = COFFEE_IMAGES[(idCounter + i) % COFFEE_IMAGES.length];
      const basePrice = 16.50 + ((idCounter * 3.7) % 32);
      const price = parseFloat(basePrice.toFixed(2));
      const stock = 20 + ((idCounter * 7) % 75);
      const isFeatured = idCounter % 6 === 0;

      let name = '';
      let shortDescription = '';
      if (cat.slug === 'roasted-coffee') {
        name = `${origin} ${process} ${roast} Roast - ${farm} Lot`;
        shortDescription = `Exceptional ${roast.toLowerCase()} roast Ethiopian coffee with ${tastingNote.toLowerCase()}.`;
      } else if (cat.slug === 'green-beans') {
        name = `${origin} Grade 1 Green Beans (${farm})`;
        shortDescription = `Raw unroasted specialty green coffee beans ready for home or commercial roasting.`;
      } else if (cat.slug === 'ground-coffee') {
        name = `${origin} ${roast} Roast Drip Grind - ${farm}`;
        shortDescription = `Precision ground Ethiopian coffee optimized for pour-over, Chemex, and drip.`;
      } else if (cat.slug === 'subscriptions') {
        name = `Reserve Subscription: ${origin} Terroir Selection`;
        shortDescription = `Monthly delivery of single-origin Ethiopian coffees roasted fresh to order.`;
      } else if (cat.slug === 'rtd') {
        name = `${origin} Nitro Cold Brew 4-Pack (Single-Origin)`;
        shortDescription = `Silky, ready-to-drink cold brew brewed with 100% Ethiopian single-origin beans.`;
      } else if (cat.slug === 'functional-blends') {
        name = `${origin} Focus Blend w/ Lion's Mane & Cordyceps`;
        shortDescription = `Specialty Ethiopian coffee elevated with organic dual-extracted functional mushrooms.`;
      } else if (cat.slug === 'confectionery') {
        name = `${origin} Dark Chocolate Coated Espresso Beans (70% Cacao)`;
        shortDescription = `Crunchy roasted Ethiopian coffee beans enveloped in single-origin dark chocolate.`;
      } else if (cat.slug === 'brewing-equipment') {
        name = `Craft Ceramic Pour-Over Dripper (${origin} Series)`;
        shortDescription = `Hand-glazed ceramic coffee dripper engineered for thermal stability and optimal extraction.`;
      } else if (cat.slug === 'merchandise') {
        name = `Barista Canvas Apron - ${origin} Heritage Edition`;
        shortDescription = `Durable waxed canvas apron with leather accents designed for passionate home baristas.`;
      } else {
        name = `${origin} Discovery Tasting Gift Box (4x 100g)`;
        shortDescription = `A tasting journey through four unique processing methods and micro-lots.`;
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${idCounter}`;
      const prodId = `prod_${String(idCounter).padStart(3, '0')}`;

      products.push({
        id: prodId,
        name,
        slug,
        description: `${name}. Sourced directly from trusted growers in the high-altitude ${origin} region (${farm}). Harvested at peak ripeness and processed using meticulous ${process.toLowerCase()} methods. Features distinguished notes of ${tastingNote}.`,
        shortDescription,
        price,
        comparePrice: price > 25 ? parseFloat((price * 1.15).toFixed(2)) : null,
        currency: 'USD',
        stockCount: stock,
        stock: stock,
        reservedCount: 0,
        minOrderQty: 1,
        maxOrderQty: 10,
        origin,
        region: origin,
        farm: `${farm} Washing Station & Farm`,
        variety: 'Heirloom Ethiopian Varieties (Kurume, Dega)',
        process,
        roastLevel: roast,
        altitude: '1,850 - 2,200m',
        tastingNotes: tastingNote,
        flavorProfile: tastingNote.split('&')[0].trim(),
        body: process === 'Natural' ? 'Heavy & Creamy' : 'Medium & Silky',
        acidity: process === 'Washed' ? 'Bright & Citric' : 'Mild & Malic',
        sweetness: 'High Cane Sugar & Honey',
        aroma: 'Jasmine, Bergamot, Honeysuckle',
        brewMethod: 'V60, Chemex, Aeropress, Kalita Wave',
        status: 'PUBLISHED',
        isVisible: true,
        isFeatured,
        categoryId: cat.id,
        category: cat.name,
        categorySlug: cat.slug,
        image_url: imgUrl,
        images: [
          { id: `img_${prodId}_1`, productId: prodId, url: imgUrl, isPrimary: true, altText: name }
        ],
        createdAt: new Date(Date.now() - idCounter * 3600000),
        updatedAt: new Date()
      });

      idCounter++;
    }
  }

  return products;
}

// In-Memory Database State
const dbProducts = generate100Products();
const dbCategories = [...INITIAL_CATEGORIES];
const dbCarts = new Map(); // sessionId -> { id, sessionId, userId, items: [] }
const dbCartItems = new Map(); // itemId -> { id, cartId, productId, quantity, addedAt, updatedAt, product }
const dbOrders = [];
const dbUsers = new Map();
const dbRefreshTokens = new Map();

// Helper to filter products
function filterProducts(where = {}) {
  let list = dbProducts.filter(p => p.isVisible !== false);

  if (where.status) {
    list = list.filter(p => p.status === where.status);
  }
  if (where.isFeatured !== undefined) {
    list = list.filter(p => p.isFeatured === where.isFeatured);
  }
  if (where.stockCount?.gt !== undefined) {
    list = list.filter(p => p.stockCount > where.stockCount.gt);
  }
  if (where.category) {
    const catVal = typeof where.category === 'object' ? (where.category.slug || where.category.name) : where.category;
    if (catVal) {
      list = list.filter(p => 
        p.category?.toLowerCase() === catVal.toLowerCase() ||
        p.categorySlug?.toLowerCase() === catVal.toLowerCase()
      );
    }
  }
  if (where.origin) {
    if (typeof where.origin === 'string') {
      list = list.filter(p => p.origin?.toLowerCase().includes(where.origin.toLowerCase()));
    } else if (typeof where.origin.contains === 'string') {
      list = list.filter(p => p.origin?.toLowerCase().includes(where.origin.contains.toLowerCase()));
    } else if (where.origin.not !== undefined) {
      list = list.filter(p => p.origin != null);
    }
  }
  if (where.process) {
    if (typeof where.process === 'string') {
      list = list.filter(p => p.process?.toLowerCase().includes(where.process.toLowerCase()));
    } else if (typeof where.process.contains === 'string') {
      list = list.filter(p => p.process?.toLowerCase().includes(where.process.contains.toLowerCase()));
    } else if (where.process.not !== undefined) {
      list = list.filter(p => p.process != null);
    }
  }
  if (where.roastLevel) {
    if (typeof where.roastLevel === 'string') {
      list = list.filter(p => p.roastLevel?.toLowerCase().includes(where.roastLevel.toLowerCase()));
    } else if (typeof where.roastLevel.contains === 'string') {
      list = list.filter(p => p.roastLevel?.toLowerCase().includes(where.roastLevel.contains.toLowerCase()));
    } else if (where.roastLevel.not !== undefined) {
      list = list.filter(p => p.roastLevel != null);
    }
  }
  if (where.price) {
    if (where.price.gte !== undefined) list = list.filter(p => p.price >= parseFloat(where.price.gte));
    if (where.price.lte !== undefined) list = list.filter(p => p.price <= parseFloat(where.price.lte));
  }
  if (where.OR && Array.isArray(where.OR)) {
    list = list.filter(p => {
      return where.OR.some(cond => {
        for (const [key, filter] of Object.entries(cond)) {
          const val = p[key];
          const query = filter?.contains || filter;
          if (typeof val === 'string' && typeof query === 'string' && val.toLowerCase().includes(query.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    });
  }

  return list;
}

// In-Memory Prisma Mock
export const prisma = {
  product: {
    findMany: async (args = {}) => {
      let results = filterProducts(args.where);

      if (args.orderBy) {
        if (args.orderBy.price) {
          const dir = args.orderBy.price === 'desc' ? -1 : 1;
          results = [...results].sort((a, b) => (a.price - b.price) * dir);
        } else if (args.orderBy.createdAt) {
          const dir = args.orderBy.createdAt === 'desc' ? -1 : 1;
          results = [...results].sort((a, b) => (new Date(a.createdAt) - new Date(b.createdAt)) * dir);
        }
      }

      if (args.skip !== undefined || args.take !== undefined) {
        const skip = args.skip || 0;
        const take = args.take || results.length;
        results = results.slice(skip, skip + take);
      }

      return results;
    },
    findUnique: async (args = {}) => {
      const { id, slug } = args.where || {};
      return dbProducts.find(p => p.id === id || p.slug === slug) || null;
    },
    findFirst: async (args = {}) => {
      const matches = filterProducts(args.where);
      return matches[0] || null;
    },
    count: async (args = {}) => {
      return filterProducts(args.where).length;
    },
    update: async (args = {}) => {
      const { id } = args.where || {};
      const prod = dbProducts.find(p => p.id === id);
      if (!prod) throw new Error('Product not found');
      Object.assign(prod, args.data || {});
      if (args.data?.stockCount !== undefined) {
        prod.stock = args.data.stockCount;
      }
      return prod;
    }
  },

  category: {
    findMany: async (args = {}) => {
      let results = [...dbCategories];
      if (args.include?.products) {
        results = results.map(c => ({
          ...c,
          products: dbProducts.filter(p => p.categoryId === c.id)
        }));
      }
      return results;
    },
    findUnique: async (args = {}) => {
      const { id, slug } = args.where || {};
      const cat = dbCategories.find(c => c.id === id || c.slug === slug);
      if (!cat) return null;
      if (args.include?.products) {
        return {
          ...cat,
          products: dbProducts.filter(p => p.categoryId === cat.id)
        };
      }
      return cat;
    },
    count: async () => dbCategories.length
  },

  cart: {
    findUnique: async (args = {}) => {
      const { sessionId, userId } = args.where || {};
      let cart = null;
      if (sessionId) cart = dbCarts.get(sessionId);
      if (!cart && userId) {
        for (const c of dbCarts.values()) {
          if (c.userId === userId) { cart = c; break; }
        }
      }
      if (!cart) return null;

      // Populate items with products
      const items = [];
      for (const item of dbCartItems.values()) {
        if (item.cartId === cart.id) {
          const product = dbProducts.find(p => p.id === item.productId);
          items.push({
            ...item,
            product: product || {
              id: item.productId,
              name: 'Specialty Ethiopian Coffee',
              price: 18.00,
              stock: 50,
              image_url: COFFEE_IMAGES[0]
            }
          });
        }
      }

      return {
        ...cart,
        items
      };
    },
    create: async (args = {}) => {
      const { sessionId, userId } = args.data || {};
      const cartId = `cart_${uuidv4().substring(0, 8)}`;
      const cart = {
        id: cartId,
        sessionId: sessionId || uuidv4(),
        userId: userId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: []
      };
      dbCarts.set(cart.sessionId, cart);
      return cart;
    },
    update: async (args = {}) => {
      const { id } = args.where || {};
      for (const cart of dbCarts.values()) {
        if (cart.id === id) {
          Object.assign(cart, args.data || {}, { updatedAt: new Date() });
          return cart;
        }
      }
      return null;
    }
  },

  cartItem: {
    findFirst: async (args = {}) => {
      const { cartId, productId } = args.where || {};
      for (const item of dbCartItems.values()) {
        if (item.cartId === cartId && item.productId === productId) {
          const product = dbProducts.find(p => p.id === item.productId);
          return { ...item, product };
        }
      }
      return null;
    },
    findUnique: async (args = {}) => {
      const { id } = args.where || {};
      const item = dbCartItems.get(id);
      if (!item) return null;
      const product = dbProducts.find(p => p.id === item.productId);
      return { ...item, product };
    },
    findMany: async (args = {}) => {
      const { cartId, sessionId } = args.where || {};
      const items = [];
      for (const item of dbCartItems.values()) {
        if ((cartId && item.cartId === cartId) || (sessionId && item.sessionId === sessionId)) {
          const product = dbProducts.find(p => p.id === item.productId);
          items.push({ ...item, product });
        }
      }
      return items;
    },
    create: async (args = {}) => {
      const { cartId, productId, quantity = 1 } = args.data || {};
      const itemId = `item_${uuidv4().substring(0, 8)}`;
      const product = dbProducts.find(p => p.id === productId);
      const item = {
        id: itemId,
        cartId,
        productId,
        quantity,
        addedAt: new Date(),
        updatedAt: new Date(),
        product: product || { id: productId, name: 'Coffee', price: 18, stock: 50, image_url: COFFEE_IMAGES[0] }
      };
      dbCartItems.set(itemId, item);
      return item;
    },
    update: async (args = {}) => {
      const { id } = args.where || {};
      const item = dbCartItems.get(id);
      if (!item) throw new Error('Cart item not found');
      Object.assign(item, args.data || {}, { updatedAt: new Date() });
      const product = dbProducts.find(p => p.id === item.productId);
      return { ...item, product };
    },
    delete: async (args = {}) => {
      const { id } = args.where || {};
      const item = dbCartItems.get(id);
      dbCartItems.delete(id);
      return item || { id };
    },
    deleteMany: async (args = {}) => {
      const { cartId } = args.where || {};
      let count = 0;
      for (const [id, item] of dbCartItems.entries()) {
        if (!cartId || item.cartId === cartId) {
          dbCartItems.delete(id);
          count++;
        }
      }
      return { count };
    }
  },

  order: {
    create: async (args = {}) => {
      const data = args.data || {};
      const orderId = `order_${uuidv4().substring(0, 8)}`;
      const orderNumber = `ETH-${Date.now().toString().slice(-6)}`;
      const newOrder = {
        id: orderId,
        orderNumber,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      dbOrders.push(newOrder);
      return newOrder;
    },
    findMany: async (args = {}) => {
      const { sessionId, userId } = args.where || {};
      let orders = dbOrders;
      if (sessionId) orders = orders.filter(o => o.sessionId === sessionId);
      if (userId) orders = orders.filter(o => o.userId === userId);
      return orders;
    },
    findUnique: async (args = {}) => {
      const { id, orderNumber } = args.where || {};
      return dbOrders.find(o => o.id === id || o.orderNumber === orderNumber) || null;
    }
  },

  user: {
    findUnique: async (args = {}) => {
      const { email, id } = args.where || {};
      for (const u of dbUsers.values()) {
        if (u.email === email || u.id === id) return u;
      }
      return null;
    },
    create: async (args = {}) => {
      const data = args.data || {};
      const userId = `usr_${uuidv4().substring(0, 8)}`;
      const user = {
        id: userId,
        isActive: true,
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data
      };
      dbUsers.set(userId, user);
      return user;
    },
    update: async (args = {}) => {
      const { id } = args.where || {};
      const user = dbUsers.get(id);
      if (user) Object.assign(user, args.data || {}, { updatedAt: new Date() });
      return user;
    }
  },

  refreshToken: {
    findUnique: async (args = {}) => {
      const { token } = args.where || {};
      const rec = dbRefreshTokens.get(token);
      if (!rec) return null;
      const user = dbUsers.get(rec.userId);
      return { ...rec, user };
    },
    create: async (args = {}) => {
      const data = args.data || {};
      const rec = { id: `rf_${uuidv4().substring(0, 8)}`, ...data, createdAt: new Date() };
      dbRefreshTokens.set(data.token, rec);
      return rec;
    },
    update: async (args = {}) => {
      const { id } = args.where || {};
      for (const [token, rec] of dbRefreshTokens.entries()) {
        if (rec.id === id) {
          Object.assign(rec, args.data || {});
          return rec;
        }
      }
      return null;
    },
    delete: async (args = {}) => {
      const { id } = args.where || {};
      for (const [token, rec] of dbRefreshTokens.entries()) {
        if (rec.id === id) {
          dbRefreshTokens.delete(token);
          return rec;
        }
      }
      return null;
    },
    deleteMany: async (args = {}) => {
      const { userId } = args.where || {};
      let count = 0;
      for (const [token, rec] of dbRefreshTokens.entries()) {
        if (rec.userId === userId) {
          dbRefreshTokens.delete(token);
          count++;
        }
      }
      return { count };
    }
  },

  productImage: {
    create: async (args = {}) => ({ id: `img_${uuidv4().substring(0, 8)}`, ...args.data }),
    findMany: async (args = {}) => {
      const { productId } = args.where || {};
      const prod = dbProducts.find(p => p.id === productId);
      return prod?.images || [];
    }
  },

  $queryRaw: async (...params) => {
    // In-memory fallback for full-text search query
    return dbProducts.slice(0, 10).map(p => ({
      ...p,
      rank: 0.95
    }));
  },

  $disconnect: async () => {}
};

export default prisma;
