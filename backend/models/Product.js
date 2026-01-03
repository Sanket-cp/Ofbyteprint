const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  dimensions: { type: String, required: true },
  priceMultiplier: { type: Number, required: true, default: 1 }
});

const paperTypeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  priceMultiplier: { type: Number, required: true, default: 1 }
});

const finishingSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 }
});

const bulkDiscountSchema = new mongoose.Schema({
  minQuantity: { type: Number, required: true },
  discountPercent: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['business-cards', 'banners', 'posters', 'flyers', 'merchandise', 'stickers', 'photo-frames', 'custom']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  minQuantity: {
    type: Number,
    required: [true, 'Minimum quantity is required'],
    min: [1, 'Minimum quantity must be at least 1']
  },
  maxQuantity: {
    type: Number,
    default: 10000
  },
  sizes: [sizeSchema],
  paperTypes: [paperTypeSchema],
  finishings: [finishingSchema],
  hasColor: {
    type: Boolean,
    default: true
  },
  hasDoubleSide: {
    type: Boolean,
    default: false
  },
  hasLamination: {
    type: Boolean,
    default: false
  },
  hasUrgentDelivery: {
    type: Boolean,
    default: false
  },
  bulkDiscounts: [bulkDiscountSchema],
  specifications: {
    weight: String,
    material: String,
    printingMethod: String,
    colorOptions: [String],
    finishOptions: [String]
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 999999
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ basePrice: 1 });
productSchema.index({ averageRating: -1 });

// Virtual for price range
productSchema.virtual('priceRange').get(function() {
  if (!this.sizes || this.sizes.length === 0) return { min: this.basePrice, max: this.basePrice };
  
  const multipliers = this.sizes.map(size => size.priceMultiplier);
  const minMultiplier = Math.min(...multipliers);
  const maxMultiplier = Math.max(...multipliers);
  
  return {
    min: this.basePrice * minMultiplier,
    max: this.basePrice * maxMultiplier
  };
});

// Method to calculate price based on customization
productSchema.methods.calculatePrice = function(customization) {
  const { quantity, size, paperType, isColor, isDoubleSide, lamination, finishing, isUrgent } = customization;

  // Get size multiplier
  const selectedSize = this.sizes.find(s => s.id === size);
  const sizeMultiplier = selectedSize?.priceMultiplier || 1;

  // Get paper type multiplier
  const selectedPaper = this.paperTypes.find(p => p.id === paperType);
  const paperMultiplier = selectedPaper?.priceMultiplier || 1;

  // Calculate base unit price
  let unitPrice = this.basePrice * sizeMultiplier * paperMultiplier;

  // Color addition (20% more for color)
  if (isColor && this.hasColor) {
    unitPrice += unitPrice * 0.2;
  }

  // Double side addition (50% more)
  if (isDoubleSide && this.hasDoubleSide) {
    unitPrice += unitPrice * 0.5;
  }

  // Lamination addition
  if (lamination && lamination !== 'none' && this.hasLamination) {
    unitPrice += 0.5; // Fixed cost per unit
  }

  // Calculate subtotal
  const subtotal = unitPrice * quantity;

  // Finishing addition (flat fee)
  const selectedFinishing = this.finishings.find(f => f.id === finishing);
  const finishingCost = selectedFinishing?.price || 0;

  // Urgent delivery (25% extra)
  const urgentCost = (isUrgent && this.hasUrgentDelivery) ? subtotal * 0.25 : 0;

  // Calculate bulk discount
  const bulkDiscountPercent = this.getBulkDiscountPercent(quantity);
  const preTotalBeforeDiscount = subtotal + finishingCost + urgentCost;
  const bulkDiscount = preTotalBeforeDiscount * (bulkDiscountPercent / 100);

  // Final price
  const finalPrice = preTotalBeforeDiscount - bulkDiscount;

  return {
    basePrice: this.basePrice,
    unitPrice,
    subtotal,
    finishingCost,
    urgentCost,
    bulkDiscount,
    bulkDiscountPercent,
    finalPrice,
    pricePerUnit: finalPrice / quantity
  };
};

// Method to get bulk discount percentage
productSchema.methods.getBulkDiscountPercent = function(quantity) {
  const sortedDiscounts = [...this.bulkDiscounts].sort((a, b) => b.minQuantity - a.minQuantity);
  const applicableDiscount = sortedDiscounts.find(d => quantity >= d.minQuantity);
  return applicableDiscount?.discountPercent || 0;
};

// Static method to get products by category
productSchema.statics.getByCategory = function(categoryId) {
  return this.find({ category: categoryId, isActive: true });
};

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ isFeatured: true, isActive: true }).limit(limit);
};

module.exports = mongoose.model('Product', productSchema);