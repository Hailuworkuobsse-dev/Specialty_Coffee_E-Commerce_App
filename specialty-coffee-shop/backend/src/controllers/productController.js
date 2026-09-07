// Product Controller

import { PrismaClient } from '@prisma/client';
import { productQuerySchema } from '../schemas/validations.js';

const prisma = new PrismaClient();

// GET /api/products - List all products with optional search and category filter
export const getProducts = async (req, res) => {
  try {
    // Validate query parameters
    const validatedQuery = productQuerySchema.parse(req.query);
    const { search, category } = validatedQuery;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// GET /api/products/:id - Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
