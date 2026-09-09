// Product Service - Business Logic Layer for Product Catalog
// Phase 2: Product Catalog & Search Enhancement

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get products with advanced filtering and search
 * @param {Object} filters - Filter parameters
 * @param {string} filters.search - Full-text search query
 * @param {string} filters.category - Category slug filter
 * @param {string} filters.origin - Origin filter (e.g., "Yirgacheffe", "Sidamo")
 * @param {string} filters.process - Process method (Natural, Washed, Honey)
 * @param {string} filters.roastLevel - Roast level (Light, Medium, Dark)
 * @param {string} filters.minPrice - Minimum price filter
 * @param {string} filters.maxPrice - Maximum price filter
 * @param {boolean} filters.inStock - Only show in-stock items
 * @param {boolean} filters.isFeatured - Only show featured items
 * @param {number} filters.page - Page number for pagination
 * @param {number} filters.limit - Items per page
 * @returns {Promise<Object>} Products list with metadata
 */
export const getProducts = async (filters = {}) => {
  const {
    search,
    category,
    origin,
    process,
    roastLevel,
    minPrice,
    maxPrice,
    inStock,
    isFeatured,
    page = 1,
    limit = 20
  } = filters;

  const where = {
    status: 'PUBLISHED',
    isVisible: true
  };

  // Full-text search using PostgreSQL ts_vector simulation
  if (search) {
    const searchTerm = search.toLowerCase();
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { shortDescription: { contains: searchTerm, mode: 'insensitive' } },
      { tastingNotes: { contains: searchTerm, mode: 'insensitive' } },
      { flavorProfile: { contains: searchTerm, mode: 'insensitive' } },
      { origin: { contains: searchTerm, mode: 'insensitive' } },
      { region: { contains: searchTerm, mode: 'insensitive' } },
      { farm: { contains: searchTerm, mode: 'insensitive' } },
      { variety: { contains: searchTerm, mode: 'insensitive' } }
    ];
  }

  // Category filter
  if (category) {
    where.category = {
      slug: category
    };
  }

  // Origin filter
  if (origin) {
    where.origin = { contains: origin, mode: 'insensitive' };
  }

  // Process method filter
  if (process) {
    where.process = { contains: process, mode: 'insensitive' };
  }

  // Roast level filter
  if (roastLevel) {
    where.roastLevel = { contains: roastLevel, mode: 'insensitive' };
  }

  // Price range filter
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  // Stock availability
  if (inStock === true) {
    where.stockCount = { gt: 0 };
  }

  // Featured products
  if (isFeatured === true) {
    where.isFeatured = true;
  }

  // Pagination
  const skip = (page - 1) * limit;
  const take = parseInt(limit);

  // Execute query with relations
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    }),
    prisma.product.count({ where })
  ]);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNextPage: skip + products.length < totalCount,
      hasPreviousPage: page > 1
    },
    filters: {
      appliedFilters: { search, category, origin, process, roastLevel, minPrice, maxPrice, inStock, isFeatured },
      availableOrigins: await getDistinctValues('origin'),
      availableProcesses: await getDistinctValues('process'),
      availableRoastLevels: await getDistinctValues('roastLevel')
    }
  };
};

/**
 * Get distinct values for a specific field (for faceted filters)
 */
const getDistinctValues = async (field) => {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      isVisible: true,
      [field]: { not: null }
    },
    select: {
      [field]: true
    },
    distinct: [field]
  });

  return [...new Set(products.map(p => p[field]).filter(Boolean))];
};

/**
 * Get product by ID with full details
 */
export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

/**
 * Get product by slug (SEO-friendly URL)
 */
export const getProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

/**
 * Get all active categories with hierarchy
 */
export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { products: true }
      },
      children: {
        where: { isActive: true },
        include: {
          _count: {
            select: { products: true }
          }
        }
      }
    },
    orderBy: { sortOrder: 'asc' }
  });

  // Return only top-level categories with their children
  return categories.filter(cat => !cat.parentId);
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: {
          status: 'PUBLISHED',
          isVisible: true
        },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      },
      children: {
        where: { isActive: true }
      }
    }
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

/**
 * Advanced search with PostgreSQL full-text search
 * Uses ts_vector for efficient text matching
 */
export const searchProducts = async (query, options = {}) => {
  const { limit = 20, filters = {} } = options;

  if (!query || query.trim().length === 0) {
    return { products: [], totalCount: 0 };
  }

  // Use raw SQL for PostgreSQL full-text search
  const searchTerm = query.toLowerCase();
  
  const products = await prisma.$queryRaw`
    SELECT 
      p.*,
      ts_rank(to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.tasting_notes, '')), query) as rank
    FROM products p,
    to_tsquery('english', ${searchTerm.split(' ').join(' & ')}) query
    WHERE p.status = 'PUBLISHED' 
      AND p.is_visible = true
      AND to_tsvector('english', COALESCE(p.name, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.tasting_notes, '')) @@ query
    ORDER BY rank DESC
    LIMIT ${limit}
  `;

  return {
    products,
    totalCount: products.length,
    searchQuery: query
  };
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (limit = 8) => {
  const products = await prisma.product.findMany({
    where: {
      status: 'PUBLISHED',
      isVisible: true,
      isFeatured: true,
      stockCount: { gt: 0 }
    },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });

  return products;
};

/**
 * Get related products based on category or tags
 */
export const getRelatedProducts = async (productId, limit = 4) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      categoryId: true,
      tags: true
    }
  });

  if (!product) {
    return [];
  }

  const where = {
    id: { not: productId },
    status: 'PUBLISHED',
    isVisible: true,
    stockCount: { gt: 0 }
  };

  // Prioritize same category
  if (product.categoryId) {
    where.categoryId = product.categoryId;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  });

  return products;
};

/**
 * Get products by IDs (bulk fetch)
 */
export const getProductsByIds = async (ids) => {
  const products = await prisma.product.findMany({
    where: {
      id: { in: ids },
      status: 'PUBLISHED',
      isVisible: true
    },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1
      }
    }
  });

  return products;
};

/**
 * Update product stock count
 */
export const updateProductStock = async (productId, quantityChange) => {
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      stockCount: { increment: quantityChange }
    }
  });

  // Update status if out of stock
  if (product.stockCount <= 0) {
    await prisma.product.update({
      where: { id: productId },
      data: { status: 'OUT_OF_STOCK' }
    });
  } else if (product.status === 'OUT_OF_STOCK') {
    await prisma.product.update({
      where: { id: productId },
      data: { status: 'PUBLISHED' }
    });
  }

  return product;
};

/**
 * Reserve product stock (for checkout)
 */
export const reserveProductStock = async (productId, quantity) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const availableStock = product.stockCount - product.reservedCount;
  
  if (availableStock < quantity) {
    throw new Error(`Insufficient stock. Available: ${availableStock}`);
  }

  return await prisma.product.update({
    where: { id: productId },
    data: {
      reservedCount: { increment: quantity }
    }
  });
};

/**
 * Release reserved stock (for cancelled orders)
 */
export const releaseReservedStock = async (productId, quantity) => {
  return await prisma.product.update({
    where: { id: productId },
    data: {
      reservedCount: { decrement: quantity }
    }
  });
};

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  getCategories,
  getCategoryBySlug,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
  getProductsByIds,
  updateProductStock,
  reserveProductStock,
  releaseReservedStock
};
