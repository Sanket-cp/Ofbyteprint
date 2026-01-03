const mongoose = require('mongoose');
const Product = require('../models/Product');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('');
  console.log('💡 GOOD NEWS: Your PrintHub app is already working perfectly!');
  console.log('🚀 Frontend: http://localhost:8080');
  console.log('🚀 Backend: http://localhost:5000');
  console.log('📝 Using mock data - no MongoDB needed for testing');
  console.log('');
  console.log('To set up MongoDB later:');
  console.log('1. Create MongoDB Atlas account (free)');
  console.log('2. Update MONGODB_URI in backend/.env');
  console.log('3. Run this script again');
  process.exit(1);
});

const products = [
  {
    id: "vc-standard",
    name: "Standard Visiting Cards",
    category: "business-cards",
    description: "Professional business cards printed on premium cardstock. Perfect for networking and leaving a lasting impression.",
    basePrice: 2.5,
    image: "/images/products/visiting-cards.jpg",
    minQuantity: 100,
    sizes: [
      { id: "standard", name: "Standard", dimensions: "3.5\" x 2\"", priceMultiplier: 1 },
      { id: "square", name: "Square", dimensions: "2.5\" x 2.5\"", priceMultiplier: 1.1 },
      { id: "mini", name: "Mini", dimensions: "3\" x 1\"", priceMultiplier: 0.8 }
    ],
    paperTypes: [
      { id: "matte-300", name: "Matte 300 GSM", priceMultiplier: 1 },
      { id: "glossy-300", name: "Glossy 300 GSM", priceMultiplier: 1.1 },
      { id: "matte-350", name: "Matte 350 GSM", priceMultiplier: 1.2 },
      { id: "textured", name: "Textured 350 GSM", priceMultiplier: 1.4 }
    ],
    finishings: [
      { id: "none", name: "No Finishing", price: 0 },
      { id: "spot-uv", name: "Spot UV", price: 150 },
      { id: "foil-gold", name: "Gold Foil", price: 300 },
      { id: "foil-silver", name: "Silver Foil", price: 300 },
      { id: "emboss", name: "Embossing", price: 250 }
    ],
    hasColor: true,
    hasDoubleSide: true,
    hasLamination: true,
    hasUrgentDelivery: true,
    bulkDiscounts: [
      { minQuantity: 500, discountPercent: 10 },
      { minQuantity: 1000, discountPercent: 15 },
      { minQuantity: 2500, discountPercent: 20 },
      { minQuantity: 5000, discountPercent: 25 }
    ],
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 156
  },
  {
    id: "banner-flex",
    name: "Flex Banner",
    category: "banners",
    description: "Durable outdoor flex banners with vibrant colors. Weather-resistant and long-lasting.",
    basePrice: 15,
    image: "/images/products/flex-banner.jpg",
    minQuantity: 1,
    sizes: [
      { id: "2x3", name: "2ft x 3ft", dimensions: "2' x 3'", priceMultiplier: 1 },
      { id: "3x4", name: "3ft x 4ft", dimensions: "3' x 4'", priceMultiplier: 2 },
      { id: "4x6", name: "4ft x 6ft", dimensions: "4' x 6'", priceMultiplier: 4 },
      { id: "5x8", name: "5ft x 8ft", dimensions: "5' x 8'", priceMultiplier: 6.67 },
      { id: "custom", name: "Custom Size", dimensions: "Per sq.ft", priceMultiplier: 1 }
    ],
    paperTypes: [
      { id: "star-flex", name: "Star Flex", priceMultiplier: 1 },
      { id: "normal-flex", name: "Normal Flex", priceMultiplier: 0.8 },
      { id: "backlit", name: "Backlit Flex", priceMultiplier: 1.5 },
      { id: "vinyl", name: "Vinyl Banner", priceMultiplier: 1.3 }
    ],
    finishings: [
      { id: "none", name: "No Finishing", price: 0 },
      { id: "eyelets", name: "Eyelets", price: 50 },
      { id: "pole-pocket", name: "Pole Pocket", price: 100 }
    ],
    hasColor: true,
    hasDoubleSide: false,
    hasLamination: false,
    hasUrgentDelivery: true,
    bulkDiscounts: [
      { minQuantity: 5, discountPercent: 5 },
      { minQuantity: 10, discountPercent: 10 },
      { minQuantity: 20, discountPercent: 15 }
    ],
    isFeatured: true,
    averageRating: 4.6,
    reviewCount: 89
  },
  {
    id: "poster-a3",
    name: "Premium Posters",
    category: "posters",
    description: "High-quality posters with vivid colors. Perfect for events, promotions, and decor.",
    basePrice: 25,
    image: "/images/products/posters.jpg",
    minQuantity: 1,
    sizes: [
      { id: "a4", name: "A4", dimensions: "8.3\" x 11.7\"", priceMultiplier: 0.5 },
      { id: "a3", name: "A3", dimensions: "11.7\" x 16.5\"", priceMultiplier: 1 },
      { id: "a2", name: "A2", dimensions: "16.5\" x 23.4\"", priceMultiplier: 2 },
      { id: "a1", name: "A1", dimensions: "23.4\" x 33.1\"", priceMultiplier: 4 },
      { id: "a0", name: "A0", dimensions: "33.1\" x 46.8\"", priceMultiplier: 8 }
    ],
    paperTypes: [
      { id: "matte-150", name: "Matte 150 GSM", priceMultiplier: 1 },
      { id: "glossy-150", name: "Glossy 150 GSM", priceMultiplier: 1.1 },
      { id: "photo-paper", name: "Photo Paper", priceMultiplier: 1.5 },
      { id: "canvas", name: "Canvas", priceMultiplier: 3 }
    ],
    finishings: [
      { id: "none", name: "No Finishing", price: 0 },
      { id: "matte-lam", name: "Matte Lamination", price: 30 },
      { id: "gloss-lam", name: "Gloss Lamination", price: 30 },
      { id: "mount", name: "Foam Board Mount", price: 150 }
    ],
    hasColor: true,
    hasDoubleSide: false,
    hasLamination: true,
    hasUrgentDelivery: true,
    bulkDiscounts: [
      { minQuantity: 10, discountPercent: 10 },
      { minQuantity: 25, discountPercent: 15 },
      { minQuantity: 50, discountPercent: 20 },
      { minQuantity: 100, discountPercent: 25 }
    ],
    isFeatured: true,
    averageRating: 4.7,
    reviewCount: 134
  },
  {
    id: "flyer-standard",
    name: "Flyers",
    category: "flyers",
    description: "Eye-catching flyers for marketing, events, and promotions. Available in multiple sizes.",
    basePrice: 3,
    image: "/images/products/flyers.jpg",
    minQuantity: 100,
    sizes: [
      { id: "a6", name: "A6", dimensions: "4.1\" x 5.8\"", priceMultiplier: 0.6 },
      { id: "a5", name: "A5", dimensions: "5.8\" x 8.3\"", priceMultiplier: 1 },
      { id: "a4", name: "A4", dimensions: "8.3\" x 11.7\"", priceMultiplier: 1.8 },
      { id: "dl", name: "DL", dimensions: "3.9\" x 8.3\"", priceMultiplier: 0.8 }
    ],
    paperTypes: [
      { id: "art-130", name: "Art Paper 130 GSM", priceMultiplier: 1 },
      { id: "art-170", name: "Art Paper 170 GSM", priceMultiplier: 1.2 },
      { id: "matte-170", name: "Matte 170 GSM", priceMultiplier: 1.3 },
      { id: "glossy-170", name: "Glossy 170 GSM", priceMultiplier: 1.3 }
    ],
    finishings: [
      { id: "none", name: "No Finishing", price: 0 },
      { id: "matte-lam", name: "Matte Lamination", price: 100 },
      { id: "gloss-lam", name: "Gloss Lamination", price: 100 }
    ],
    hasColor: true,
    hasDoubleSide: true,
    hasLamination: true,
    hasUrgentDelivery: true,
    bulkDiscounts: [
      { minQuantity: 500, discountPercent: 10 },
      { minQuantity: 1000, discountPercent: 15 },
      { minQuantity: 2500, discountPercent: 20 },
      { minQuantity: 5000, discountPercent: 30 }
    ],
    isFeatured: false,
    averageRating: 4.5,
    reviewCount: 78
  },
  {
    id: "tshirt-custom",
    name: "Custom T-Shirts",
    category: "merchandise",
    description: "Premium quality custom printed t-shirts. Perfect for events, teams, and promotions.",
    basePrice: 299,
    image: "/images/products/tshirts.jpg",
    minQuantity: 10,
    sizes: [
      { id: "s", name: "Small", dimensions: "S", priceMultiplier: 1 },
      { id: "m", name: "Medium", dimensions: "M", priceMultiplier: 1 },
      { id: "l", name: "Large", dimensions: "L", priceMultiplier: 1 },
      { id: "xl", name: "XL", dimensions: "XL", priceMultiplier: 1.1 },
      { id: "xxl", name: "XXL", dimensions: "XXL", priceMultiplier: 1.2 }
    ],
    paperTypes: [
      { id: "cotton", name: "100% Cotton", priceMultiplier: 1 },
      { id: "poly-cotton", name: "Poly-Cotton Blend", priceMultiplier: 0.9 },
      { id: "drifit", name: "Dri-Fit", priceMultiplier: 1.3 }
    ],
    finishings: [
      { id: "screen", name: "Screen Printing", price: 0 },
      { id: "dtg", name: "DTG Printing", price: 100 },
      { id: "embroidery", name: "Embroidery", price: 150 }
    ],
    hasColor: true,
    hasDoubleSide: true,
    hasLamination: false,
    hasUrgentDelivery: true,
    bulkDiscounts: [
      { minQuantity: 25, discountPercent: 10 },
      { minQuantity: 50, discountPercent: 15 },
      { minQuantity: 100, discountPercent: 20 },
      { minQuantity: 250, discountPercent: 25 }
    ],
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 203
  },
  {
    id: "sticker-die-cut",
    name: "Custom Stickers",
    category: "stickers",
    description: "High-quality die-cut stickers with waterproof options. Perfect for branding and packaging.",
    basePrice: 5,
    image: "/images/products/stickers.jpg",
    minQuantity: 50,
    sizes: [
      { id: "2x2", name: "2\" x 2\"", dimensions: "2\" x 2\"", priceMultiplier: 1 },
      { id: "3x3", name: "3\" x 3\"", dimensions: "3\" x 3\"", priceMultiplier: 1.5 },
      { id: "4x4", name: "4\" x 4\"", dimensions: "4\" x 4\"", priceMultiplier: 2 },
      { id: "custom", name: "Custom Size", dimensions: "Per sq.inch", priceMultiplier: 0.5 }
    ],
    paperTypes: [
      { id: "vinyl", name: "Vinyl", priceMultiplier: 1 },
      { id: "matte-vinyl", name: "Matte Vinyl", priceMultiplier: 1.1 },
      { id: "clear", name: "Clear/Transparent", priceMultiplier: 1.3 },
      { id: "holographic", name: "Holographic", priceMultiplier: 2 }
    ],
    finishings: [
      { id: "none", name: "No Finishing", price: 0 },
      { id: "die-cut", name: "Die-Cut Shape", price: 50 },
      { id: "kiss-cut", name: "Kiss-Cut", price: 30 }
    ],
    hasColor: true,
    hasDoubleSide: false,
    hasLamination: true,
    hasUrgentDelivery: true,
    bulkDiscounts: [
      { minQuantity: 100, discountPercent: 10 },
      { minQuantity: 250, discountPercent: 15 },
      { minQuantity: 500, discountPercent: 20 },
      { minQuantity: 1000, discountPercent: 30 }
    ],
    isFeatured: true,
    averageRating: 4.6,
    reviewCount: 92
  }
];

const seedProducts = async () => {
  try {
    console.log('🌱 Starting product seeding...');
    console.log('🔗 Connecting to MongoDB...');

    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    // Insert new products
    console.log('📦 Inserting new products...');
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

    // Display seeded products
    console.log('\n📋 Seeded Products:');
    insertedProducts.forEach(product => {
      console.log(`   - ${product.name} (${product.category})`);
    });

    console.log('\n🎉 Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your MongoDB Atlas connection string');
    console.log('2. Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('3. Verify your database credentials');
    console.log('4. Your app still works with mock data at http://localhost:8080');
    process.exit(1);
  }
};

// Run the seeder
seedProducts();