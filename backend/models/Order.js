const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productSnapshot: {
    id: String,
    name: String,
    category: String,
    basePrice: Number,
    image: String
  },
  customization: {
    size: { type: String, required: true },
    paperType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    isColor: { type: Boolean, default: true },
    isDoubleSide: { type: Boolean, default: false },
    lamination: { type: String, default: 'none' },
    finishing: { type: String, required: true },
    isUrgent: { type: Boolean, default: false }
  },
  designFiles: [{
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  priceBreakdown: {
    basePrice: Number,
    unitPrice: Number,
    subtotal: Number,
    finishingCost: Number,
    urgentCost: Number,
    bulkDiscount: Number,
    bulkDiscountPercent: Number,
    finalPrice: Number,
    pricePerUnit: Number
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-design', 'in-production', 'quality-check', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    amount: { type: Number, default: 0 },
    rate: { type: Number, default: 0.18 }, // 18% GST
    type: { type: String, default: 'GST' }
  },
  shipping: {
    cost: { type: Number, default: 0 },
    method: { type: String, default: 'standard' },
    estimatedDays: { type: Number, default: 7 }
  },
  discount: {
    amount: { type: Number, default: 0 },
    code: String,
    type: { type: String, enum: ['percentage', 'fixed'], default: 'fixed' }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },

  // Customer Information
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },

  // Addresses
  billingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isSameAsBilling: { type: Boolean, default: true }
  },

  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['stripe', 'razorpay', 'cod', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentIntentId: String, // For Stripe
    razorpayOrderId: String, // For Razorpay
    razorpayPaymentId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },

  // Tracking
  tracking: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    shippedAt: Date,
    deliveredAt: Date,
    estimatedDelivery: Date
  },

  // Timeline
  timeline: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Special Instructions
  specialInstructions: String,
  internalNotes: String,

  // Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin', 'bulk'],
    default: 'web'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Cancellation
  cancellation: {
    reason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refundStatus: {
      type: String,
      enum: ['none', 'partial', 'full'],
      default: 'none'
    }
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Method to add timeline entry
orderSchema.methods.addTimelineEntry = function(status, message, updatedBy = null) {
  this.timeline.push({
    status,
    message,
    updatedBy,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus, message, updatedBy = null) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add timeline entry
  await this.addTimelineEntry(newStatus, message || `Order status changed from ${oldStatus} to ${newStatus}`, updatedBy);
  
  // Update specific timestamps
  if (newStatus === 'shipped' && !this.tracking.shippedAt) {
    this.tracking.shippedAt = new Date();
  }
  if (newStatus === 'delivered' && !this.tracking.deliveredAt) {
    this.tracking.deliveredAt = new Date();
  }
  
  return this.save();
};

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum, item) => sum + item.priceBreakdown.finalPrice, 0);
  
  // Calculate tax
  this.tax.amount = this.subtotal * this.tax.rate;
  
  // Calculate total
  this.total = this.subtotal + this.tax.amount + this.shipping.cost - this.discount.amount;
  
  return this;
};

// Static method to get orders by user
orderSchema.statics.getByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const query = { user: userId };
  
  if (status) query.status = status;
  
  return this.find(query)
    .populate('items.product', 'name category image')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get order statistics
orderSchema.statics.getStats = async function(dateRange = {}) {
  const { startDate, endDate } = dateRange;
  const matchStage = {};
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        statusBreakdown: {
          $push: '$status'
        }
      }
    }
  ]);
};

// Virtual for formatted order number
orderSchema.virtual('formattedOrderNumber').get(function() {
  return `#${this.orderNumber}`;
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((sum, item) => sum + item.customization.quantity, 0);
});

module.exports = mongoose.model('Order', orderSchema);