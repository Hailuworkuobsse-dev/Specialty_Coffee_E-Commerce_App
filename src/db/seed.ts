import { db } from './index.ts';
import { categories, products, productImages } from './schema.ts';

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

export async function seedDatabase() {
  console.log('Seeding categories...');
  for (const cat of INITIAL_CATEGORIES) {
    await db.insert(categories).values({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    }).onConflictDoNothing();
  }

  console.log('Seeding 100 products...');
  let idCounter = 1;
  for (const cat of INITIAL_CATEGORIES) {
    const countForCat = 10;
    for (let i = 0; i < countForCat; i++) {
      const origin = ORIGINS[(idCounter + i) % ORIGINS.length];
      const farm = FARMS[(idCounter + i) % FARMS.length];
      const process = PROCESSES[(idCounter + i) % PROCESSES.length];
      const roast = ROASTS[(idCounter + i) % ROASTS.length];
      const tastingNote = TASTING_NOTES[(idCounter + i) % TASTING_NOTES.length];
      const imgUrl = COFFEE_IMAGES[(idCounter + i) % COFFEE_IMAGES.length];
      const basePrice = 16.50 + ((idCounter * 3.7) % 32);
      const price = basePrice.toFixed(2);
      const stock = 20 + ((idCounter * 7) % 75);
      const isFeatured = idCounter % 6 === 0;

      const prodId = `prod_${String(idCounter).padStart(3, '0')}`;
      const name = `${origin} ${process} ${roast} Roast - ${farm} Lot`;
      const slug = `${origin.toLowerCase()}-${process.toLowerCase()}-${roast.toLowerCase()}-roast-${farm.toLowerCase().replace(/[^a-z0-9]/g, '-')}-lot-${idCounter}`;

      await db.insert(products).values({
        id: prodId,
        name,
        slug,
        description: `${name}. Sourced directly from trusted growers in the high-altitude ${origin} region (${farm}). Harvested at peak ripeness and processed using meticulous ${process.toLowerCase()} methods. Features distinguished notes of ${tastingNote}.`,
        shortDescription: `Exceptional ${roast.toLowerCase()} roast Ethiopian coffee with ${tastingNote.toLowerCase()}.`,
        price,
        currency: 'USD',
        stockCount: stock,
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
        body: 'Medium & Silky',
        acidity: 'Bright & Citric',
        sweetness: 'High Cane Sugar & Honey',
        aroma: 'Jasmine, Bergamot, Honeysuckle',
        brewMethod: 'V60, Chemex, Aeropress, Kalita Wave',
        status: 'PUBLISHED',
        isVisible: true,
        isFeatured,
        categoryId: cat.id,
        imageUrl: imgUrl,
      }).onConflictDoNothing();

      await db.insert(productImages).values({
        id: `img_${prodId}_1`,
        productId: prodId,
        url: imgUrl,
        altText: name,
        sortOrder: 0,
        isPrimary: true,
      }).onConflictDoNothing();

      idCounter++;
    }
  }

  console.log('Seeding completed successfully!');
}

// Self-run when executed directly
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => {
    console.log('Done!');
    process.exit(0);
  }).catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}
