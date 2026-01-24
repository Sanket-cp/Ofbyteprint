// Mock data for development when MongoDB is not available
const mockProducts = [
  {
    _id: "676e1234567890abcdef0001",
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
    isActive: true,
    averageRating: 4.8,
    reviewCount: 156,
    specifications: {
      weight: "300-350 GSM",
      material: "Premium Cardstock",
      printingMethod: "Digital Offset",
      colorOptions: ["Full Color", "Black & White"],
      finishOptions: ["Matte", "Glossy", "Textured", "Spot UV", "Foil"]
    },
    seo: {
      metaTitle: "Premium Business Cards - Professional Visiting Cards",
      metaDescription: "High-quality business cards with premium finishes. Fast delivery, bulk discounts available.",
      keywords: ["business cards", "visiting cards", "professional cards", "premium cardstock"]
    }
  },
  {
    _id: "676e1234567890abcdef0002",
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
      { id: "5x8", name: "5ft x 8ft", dimensions: "5' x 8'", priceMultiplier: 6.67 }
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
    isActive: true,
    averageRating: 4.6,
    reviewCount: 89,
    specifications: {
      weight: "440 GSM",
      material: "Star Flex / Normal Flex",
      printingMethod: "Large Format Digital",
      colorOptions: ["Full Color CMYK"],
      finishOptions: ["Eyelets", "Pole Pocket", "Hemming"]
    },
    seo: {
      metaTitle: "Outdoor Flex Banners - Weather Resistant Signage",
      metaDescription: "Durable outdoor banners with vibrant colors. Perfect for shop signage and events.",
      keywords: ["flex banner", "outdoor banner", "signage", "weather resistant"]
    }
  },
  {
    _id: "676e1234567890abcdef0003",
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
    isActive: true,
    averageRating: 4.9,
    reviewCount: 203,
    specifications: {
      weight: "180 GSM",
      material: "100% Cotton / Poly-Cotton Blend",
      printingMethod: "Screen Print / DTG",
      colorOptions: ["Full Color", "Single Color", "Multi-Color"],
      finishOptions: ["Screen Printing", "DTG Printing", "Embroidery"]
    },
    seo: {
      metaTitle: "Custom T-Shirts - Premium Quality Apparel Printing",
      metaDescription: "High-quality custom t-shirts for events, teams, and promotions. Multiple fabric options available.",
      keywords: ["custom t-shirts", "apparel printing", "team shirts", "event merchandise"]
    }
  },
  {
    _id: "676e1234567890abcdef0004",
    id: "sticker-die-cut",
    name: "Die Cut Stickers",
    category: "stickers",
    description: "Custom die-cut stickers with any shape. Waterproof vinyl material with strong adhesive.",
    basePrice: 8,
    image: "/images/products/die-cut-stickers.jpg",
    minQuantity: 50,
    sizes: [
      { id: "small", name: "Small", dimensions: "2\" x 2\"", priceMultiplier: 1 },
      { id: "medium", name: "Medium", dimensions: "3\" x 3\"", priceMultiplier: 1.5 },
      { id: "large", name: "Large", dimensions: "4\" x 4\"", priceMultiplier: 2 },
      { id: "custom", name: "Custom Size", dimensions: "Custom", priceMultiplier: 2.5 }
    ],
    paperTypes: [
      { id: "vinyl-white", name: "White Vinyl", priceMultiplier: 1 },
      { id: "vinyl-clear", name: "Clear Vinyl", priceMultiplier: 1.2 },
      { id: "vinyl-holographic", name: "Holographic Vinyl", priceMultiplier: 1.8 },
      { id: "paper-matte", name: "Matte Paper", priceMultiplier: 0.7 }
    ],
    finishings: [
      { id: "none", name: "Standard Cut", price: 0 },
      { id: "kiss-cut", name: "Kiss Cut", price: 25 },
      { id: "crack-back", name: "Crack & Peel", price: 50 }
    ],
    hasColor: true,
    hasDoubleSide: false,
    hasLamination: true,
    hasUrgentDelivery: true,
    bulkDiscounts: [
      { minQuantity: 100, discountPercent: 10 },
      { minQuantity: 250, discountPercent: 15 },
      { minQuantity: 500, discountPercent: 20 },
      { minQuantity: 1000, discountPercent: 25 }
    ],
    isFeatured: true,
    isActive: true,
    averageRating: 4.7,
    reviewCount: 142,
    specifications: {
      weight: "3.2 mil",
      material: "Vinyl / Paper",
      printingMethod: "Digital Print + Die Cut",
      colorOptions: ["Full Color CMYK", "Spot Colors"],
      finishOptions: ["Die Cut", "Kiss Cut", "Laminated"]
    },
    seo: {
      metaTitle: "Custom Die Cut Stickers - Any Shape Vinyl Stickers",
      metaDescription: "Waterproof die-cut stickers in any shape. Perfect for branding, laptops, and promotions.",
      keywords: ["die cut stickers", "custom stickers", "vinyl stickers", "waterproof stickers"]
    }
  },
  {
    _id: "676e1234567890abcdef0005",
    id: "poster-a3",
    name: "A3 Posters",
    category: "posters",
    description: "High-quality A3 size posters with vibrant colors. Perfect for events, promotions, and wall art.",
    basePrice: 45,
    image: "/images/products/a3-poster.jpg",
    minQuantity: 1,
    sizes: [
      { id: "a3", name: "A3", dimensions: "11.7\" x 16.5\"", priceMultiplier: 1 },
      { id: "a3-plus", name: "A3+", dimensions: "13\" x 19\"", priceMultiplier: 1.3 }
    ],
    paperTypes: [
      { id: "matte-170", name: "Matte 170 GSM", priceMultiplier: 1 },
      { id: "glossy-170", name: "Glossy 170 GSM", priceMultiplier: 1.1 },
      { id: "satin-200", name: "Satin 200 GSM", priceMultiplier: 1.2 },
      { id: "canvas", name: "Canvas Texture", priceMultiplier: 1.5 }
    ],
    finishings: [
      { id: "none", name: "No Finishing", price: 0 },
      { id: "lamination", name: "Lamination", price: 15 },
      { id: "mounting", name: "Foam Board Mounting", price: 75 }
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
    isFeatured: false,
    isActive: true,
    averageRating: 4.5,
    reviewCount: 78,
    specifications: {
      weight: "170-200 GSM",
      material: "Premium Paper / Canvas",
      printingMethod: "Digital Offset",
      colorOptions: ["Full Color CMYK"],
      finishOptions: ["Matte", "Glossy", "Satin", "Laminated"]
    },
    seo: {
      metaTitle: "A3 Posters - High Quality Digital Printing",
      metaDescription: "Vibrant A3 posters for events, promotions, and wall art. Multiple paper options available.",
      keywords: ["A3 posters", "poster printing", "event posters", "wall art"]
    }
  }
];

const mockUsers = [
  {
    _id: "676e1234567890abcdef1001",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    isEmailVerified: true,
    phone: "+91 98765 43210",
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    },
    preferences: {
      notifications: {
        email: true,
        sms: false
      },
      currency: "INR",
      language: "en"
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockOrders = [
  {
    _id: "676e1234567890abcdef2001",
    orderNumber: "ORD000001",
    user: "676e1234567890abcdef1001",
    items: [
      {
        product: "676e1234567890abcdef0001",
        productSnapshot: {
          id: "vc-standard",
          name: "Standard Visiting Cards",
          category: "business-cards",
          basePrice: 2.5,
          image: "/images/products/visiting-cards.jpg"
        },
        customization: {
          size: "standard",
          paperType: "matte-300",
          quantity: 500,
          isColor: true,
          isDoubleSide: false,
          lamination: "none",
          finishing: "none",
          isUrgent: false
        },
        priceBreakdown: {
          basePrice: 2.5,
          unitPrice: 3,
          subtotal: 1500,
          finishingCost: 0,
          urgentCost: 0,
          bulkDiscount: 150,
          finalPrice: 1350,
          pricePerUnit: 2.7
        },
        status: "pending"
      }
    ],
    subtotal: 1350,
    tax: {
      amount: 243,
      rate: 0.18,
      type: "GST"
    },
    shipping: {
      cost: 0,
      method: "free",
      estimatedDays: 7
    },
    total: 1593,
    customerInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 98765 43210"
    },
    billingAddress: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    },
    shippingAddress: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India",
      isSameAsBilling: true
    },
    status: "confirmed",
    payment: {
      method: "razorpay",
      status: "completed"
    },
    timeline: [
      {
        status: "pending",
        message: "Order created successfully",
        timestamp: new Date()
      },
      {
        status: "confirmed",
        message: "Payment completed successfully",
        timestamp: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  mockProducts,
  mockUsers,
  mockOrders
};