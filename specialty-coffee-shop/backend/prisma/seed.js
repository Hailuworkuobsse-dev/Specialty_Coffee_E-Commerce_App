/**
 * Database Seeder - Phase 2: Product Catalog
 * Seeds 100 Ethiopian coffee products across 10 categories
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==================== Categories (10 Total) ====================
const categories = [
  { name: 'Roasted Coffee', slug: 'roasted-coffee', description: 'Premium roasted Ethiopian coffee beans' },
  { name: 'Green Beans', slug: 'green-beans', description: 'Raw, unroasted Ethiopian coffee beans' },
  { name: 'Ground Coffee', slug: 'ground-coffee', description: 'Pre-ground coffee for various brew methods' },
  { name: 'Coffee Subscriptions', slug: 'subscriptions', description: 'Recurring delivery of your favorite coffees' },
  { name: 'RTD (Ready-to-Drink)', slug: 'rtd', description: 'Ready-to-drink cold brew and coffee beverages' },
  { name: 'Functional Blends', slug: 'functional-blends', description: 'Coffee blends with added health benefits' },
  { name: 'Confectionery', slug: 'confectionery', description: 'Coffee-infused chocolates and sweets' },
  { name: 'Brewing Equipment', slug: 'brewing-equipment', description: 'Tools and equipment for brewing' },
  { name: 'Merchandise', slug: 'merchandise', description: 'Branded apparel and accessories' },
  { name: 'Gift Sets', slug: 'gift-sets', description: 'Curated gift collections' }
];

// ==================== Sample Products Data ====================
const origins = ['Yirgacheffe', 'Sidamo', 'Guji', 'Harrar', 'Limu', 'Jimma', 'Kaffa'];
const processes = ['Natural', 'Washed', 'Honey'];
const roastLevels = ['Light', 'Medium', 'Dark'];
const varieties = ['Heirloom', 'Kurume', 'Wolisho', 'Dega', '74110', '7440'];

const productTemplates = [
  // Roasted Coffee (15 products)
  { category: 'roasted-coffee', basePrice: 18.99, weight: 250 },
  { category: 'roasted-coffee', basePrice: 24.99, weight: 500 },
  { category: 'roasted-coffee', basePrice: 45.99, weight: 1000 },
  
  // Green Beans (10 products)
  { category: 'green-beans', basePrice: 12.99, weight: 500 },
  { category: 'green-beans', basePrice: 22.99, weight: 1000 },
  
  // Ground Coffee (10 products)
  { category: 'ground-coffee', basePrice: 16.99, weight: 250 },
  { category: 'ground-coffee', basePrice: 21.99, weight: 500 },
  
  // Subscriptions (5 products)
  { category: 'subscriptions', basePrice: 29.99, weight: 500 },
  { category: 'subscriptions', basePrice: 54.99, weight: 1000 },
  
  // RTD (10 products)
  { category: 'rtd', basePrice: 4.99, weight: 330 },
  { category: 'rtd', basePrice: 24.99, weight: 1800 }, // 6-pack
  
  // Functional Blends (10 products)
  { category: 'functional-blends', basePrice: 22.99, weight: 300 },
  
  // Confectionery (15 products)
  { category: 'confectionery', basePrice: 8.99, weight: 100 },
  { category: 'confectionery', basePrice: 15.99, weight: 250 },
  
  // Brewing Equipment (10 products)
  { category: 'brewing-equipment', basePrice: 29.99, weight: 500 },
  { category: 'brewing-equipment', basePrice: 89.99, weight: 1500 },
  
  // Merchandise (10 products)
  { category: 'merchandise', basePrice: 19.99, weight: 200 },
  { category: 'merchandise', basePrice: 34.99, weight: 400 },
  
  // Gift Sets (5 products)
  { category: 'gift-sets', basePrice: 49.99, weight: 1000 },
  { category: 'gift-sets', basePrice: 89.99, weight: 2000 }
];

// Generate 100 products
function generateProducts() {
  const products = [];
  let productId = 1;
  
  productTemplates.forEach((template, index) => {
    const countPerTemplate = Math.ceil(100 / productTemplates.length);
    
    for (let i = 0; i < countPerTemplate && products.length < 100; i++) {
      const origin = origins[Math.floor(Math.random() * origins.length)];
      const process = processes[Math.floor(Math.random() * processes.length)];
      const roast = template.category === 'green-beans' ? null : roastLevels[Math.floor(Math.random() * roastLevels.length)];
      const variety = varieties[Math.floor(Math.random() * varieties.length)];
      
      const farmNames = ['Adame Tulu', 'Gedeb', 'Kochere', 'Milkis', 'Shakiso', 'Worka', 'Chelbesa', 'Haro', 'Bultum', 'Nensebo'];
      const farm = farmNames[Math.floor(Math.random() * farmNames.length)];
      
      const altitude = `${Math.floor(Math.random() * 500) + 1800}-${Math.floor(Math.random() * 500) + 2200} masl`;
      
      const tastingNotesMap = {
        'Yirgacheffe': ['Floral', 'Citrus', 'Bergamot', 'Jasmine', 'Lemon'],
        'Sidamo': ['Berry', 'Wine', 'Chocolate', 'Spice', 'Caramel'],
        'Guji': ['Tropical Fruit', 'Honey', 'Vanilla', 'Stone Fruit', 'Tea-like'],
        'Harrar': ['Blueberry', 'Dry Process', 'Fruity', 'Winey', 'Complex'],
        'Limu': ['Bright Acidity', 'Fruity', 'Spicy', 'Balanced', 'Clean'],
        'Jimma': ['Earthy', 'Full Body', 'Low Acidity', 'Nutty', 'Sweet'],
        'Kaffa': ['Wild Coffee', 'Complex', 'Fruity', 'Floral', 'Rich']
      };
      
      const notes = tastingNotesMap[origin] || ['Balanced', 'Smooth', 'Rich'];
      const selectedNotes = notes.sort(() => 0.5 - Math.random()).slice(0, 3).join(', ');
      
      const priceVariation = (Math.random() * 10 - 5).toFixed(2);
      const price = parseFloat((template.basePrice + parseFloat(priceVariation)).toFixed(2));
      
      products.push({
        id: `prod_${String(productId).padStart(3, '0')}`,
        name: `${origin} ${process} ${roast ? roast + ' Roast' : ''} - ${farm} Farm`,
        slug: `${origin.toLowerCase()}-${process.toLowerCase()}-${farm.toLowerCase().replace(' ', '-')}-${productId}`,
        description: `Exceptional ${origin} coffee from ${farm} Farm. This ${process} processed coffee showcases the unique terroir of Ethiopia's ${origin} region. Grown at high altitudes between ${altitude}, this heirloom variety offers complex flavor notes of ${selectedNotes}.`,
        shortDescription: `${origin} ${process} - Notes of ${selectedNotes}`,
        price: price,
        comparePrice: price > 20 ? parseFloat((price * 1.15).toFixed(2)) : null,
        costPrice: parseFloat((price * 0.6).toFixed(2)),
        currency: 'USD',
        stockCount: Math.floor(Math.random() * 200) + 10,
        reservedCount: 0,
        minOrderQty: 1,
        maxOrderQty: template.category === 'brewing-equipment' ? 5 : 20,
        
        // Extended attributes
        origin: origin,
        region: origin,
        farm: farm,
        variety: variety,
        process: process,
        roastLevel: roast,
        altitude: altitude,
        tastingNotes: selectedNotes,
        flavorProfile: notes.slice(0, 2).join(' & '),
        body: ['Light', 'Medium', 'Full'][Math.floor(Math.random() * 3)],
        acidity: ['Bright', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
        sweetness: ['High', 'Medium', 'Subtle'][Math.floor(Math.random() * 3)],
        aroma: ['Floral', 'Fruity', 'Nutty', 'Spicy'][Math.floor(Math.random() * 4)],
        aftertaste: ['Clean', 'Long', 'Sweet'][Math.floor(Math.random() * 3)],
        brewMethod: template.category === 'ground-coffee' 
          ? ['Pour Over', 'French Press', 'Espresso', 'Cold Brew'][Math.floor(Math.random() * 4)]
          : 'Whole Bean',
        grindSize: template.category === 'ground-coffee'
          ? ['Fine', 'Medium', 'Coarse'][Math.floor(Math.random() * 3)]
          : null,
        waterTemp: '92-96°C',
        ratio: '1:15 to 1:17',
        harvestDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        roastDate: template.category !== 'green-beans' && template.category !== 'rtd' && template.category !== 'confectionery'
          ? new Date(2026, 8, Math.floor(Math.random() * 28) + 1)
          : null,
        expiryDate: template.category !== 'green-beans' && template.category !== 'rtd' && template.category !== 'confectionery'
          ? new Date(2027, 8, Math.floor(Math.random() * 28) + 1)
          : null,
        weight: template.weight / 1000, // Convert to kg
        dimensions: {
          length: 15 + Math.random() * 10,
          width: 8 + Math.random() * 5,
          height: 5 + Math.random() * 10
        },
        ingredients: template.category === 'confectionery' 
          ? ['Coffee', 'Sugar', 'Cocoa Butter', 'Milk Solids']
          : ['100% Arabica Coffee'],
        allergens: template.category === 'confectionery'
          ? ['Milk', 'May contain nuts']
          : [],
        certifications: ['Organic', 'Fair Trade', 'Rainforest Alliance'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
        farmerStory: `The ${farm} cooperative in ${origin} has been cultivating coffee for over three generations. Working with smallholder farmers, they maintain traditional growing practices while implementing sustainable farming methods.`,
        processingStory: `This coffee is ${process.toLowerCase()} processed at the ${farm} washing station. The cherries are carefully sorted and processed within 12 hours of harvesting to ensure optimal quality.`,
        
        // SEO
        seoTitle: `${origin} ${process} Coffee | ${farm} Farm - Premium Ethiopian Coffee`,
        seoDescription: `Buy premium ${origin} ${process} coffee from ${farm} Farm. ${selectedNotes} notes. Freshly roasted and shipped directly from Ethiopia.`,
        seoKeywords: [origin.toLowerCase(), process.toLowerCase(), 'Ethiopian coffee', 'specialty coffee', 'single origin'],
        tags: [origin, process, roast || 'Unroasted', variety, 'Ethiopia', 'Specialty Grade'],
        
        // Status
        status: 'PUBLISHED',
        isVisible: true,
        isFeatured: Math.random() > 0.8, // 20% featured
        
        categoryId: null, // Will be set after categories are created
        publishedAt: new Date()
      });
      
      productId++;
    }
  });
  
  return products.slice(0, 100);
}

// ==================== Main Seed Function ====================
async function seed() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Create categories
    console.log('\n📁 Creating categories...');
    const createdCategories = [];
    
    for (const cat of categories) {
      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat
      });
      createdCategories.push(created);
      console.log(`   ✓ ${created.name}`);
    }
    
    // Generate products
    console.log('\n☕ Generating 100 products...');
    const products = generateProducts();
    
    // Assign category IDs and create products
    console.log('\n📦 Creating products...');
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    
    let createdCount = 0;
    for (const product of products) {
      const categoryId = categoryMap[product.categoryId] || categoryMap[product.category];
      
      // Remove temporary fields
      const { category, categoryId: _, ...productData } = product;
      
      const created = await prisma.product.create({
        data: {
          ...productData,
          categoryId: categoryId || createdCategories[0].id // Default to first category if not found
        }
      });
      
      createdCount++;
      if (createdCount % 20 === 0) {
        console.log(`   ✓ Created ${createdCount} products...`);
      }
    }
    
    console.log(`\n✅ Successfully created ${createdCount} products!`);
    
    // Create sample images for products
    console.log('\n🖼️  Creating product images...');
    const allProducts = await prisma.product.findMany({ select: { id: true } });
    
    for (const product of allProducts.slice(0, 20)) { // Create images for first 20 products
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `https://example.com/images/${product.id}.jpg`,
          altText: 'Premium Ethiopian Coffee',
          sortOrder: 0,
          isPrimary: true
        }
      });
    }
    
    console.log(`   ✓ Created images for 20 products`);
    
    // Summary
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   Categories: ${totalCategories}`);
    console.log(`   Products: ${totalProducts}`);
    console.log('\n✨ Database seeding completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
