// Database seed script for Specialty Coffee Shop

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const coffeeProducts = [
  {
    name: 'Ethiopian Yirgacheffe',
    description: 'A bright and floral single-origin coffee from the birthplace of coffee itself. Notes of blueberry, jasmine, and citrus with a tea-like body. Perfect for pour-over brewing.',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop',
    category: 'Single Origin',
    stock: 50
  },
  {
    name: 'Colombian Supremo',
    description: 'Classic Colombian coffee with a well-balanced profile. Rich caramel sweetness, nutty undertones, and a smooth finish. Ideal for espresso or drip coffee.',
    price: 19.99,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop',
    category: 'Single Origin',
    stock: 75
  },
  {
    name: 'Espresso Reserve Blend',
    description: 'Our signature dark roast blend crafted specifically for espresso. Bold chocolate notes, hints of dried fruit, and a creamy crema. Perfect for lattes and cappuccinos.',
    price: 22.99,
    image_url: 'https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=600&h=600&fit=crop',
    category: 'Blends',
    stock: 60
  },
  {
    name: 'Guatemala Antigua',
    description: 'Grown in the volcanic soils of Antigua, this coffee offers spicy cinnamon and clove notes with a subtle smokiness. Full-bodied with a lingering sweet finish.',
    price: 21.99,
    image_url: 'https://images.unsplash.com/photo-1559525839-b184a4d69e17?w=600&h=600&fit=crop',
    category: 'Single Origin',
    stock: 45
  },
  {
    name: 'Breakfast Blend',
    description: 'A light and approachable morning coffee with bright acidity. Features notes of honey, toasted almond, and red apple. Great for starting your day right.',
    price: 18.99,
    image_url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&h=600&fit=crop',
    category: 'Blends',
    stock: 80
  },
  {
    name: 'Sumatra Mandheling',
    description: 'An earthy, full-bodied Indonesian coffee with low acidity. Complex flavors of cedar, spice, and dark chocolate with an herbaceous aroma. Best for French press.',
    price: 23.99,
    image_url: 'https://images.unsplash.com/photo-1610632380989-680fe40381c6?w=600&h=600&fit=crop',
    category: 'Single Origin',
    stock: 40
  }
];

async function seed() {
  console.log('Starting database seed...');
  
  // Clear existing data
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  
  console.log('Cleared existing data.');
  
  // Insert products
  const createdProducts = [];
  for (const product of coffeeProducts) {
    const created = await prisma.product.create({
      data: product
    });
    createdProducts.push(created);
    console.log(`✓ Created: ${product.name}`);
  }
  
  console.log(`\n✅ Successfully seeded ${createdProducts.length} products.`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
