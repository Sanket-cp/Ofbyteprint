const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize, checkOwnership, optionalAuth } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Helper function to calculate price (same logic as Product model)
function calculateProductPrice(product, customization) {
  const { quantity, size, paperType, isColor, isDoubleSide, lamination, finishing, isUrgent } = customization;

  // Get size multiplier
  const selectedSize = product.sizes.find(s => s.id === size);
  const sizeMultiplier = selectedSize?.priceMultiplier || 1;

  // Get paper type multiplier
  const selectedPaper = product.paperTypes.find(p => p.id === paperType);
  const paperMultiplier = selectedPaper?.priceMultiplier || 1;

  // Calculate base unit price
  let unitPrice = product.basePrice * sizeMultiplier * paperMultiplier;

  // Color addition (20% more for color)
  if (isColor && product.hasColor) {
    unitPrice += unitPrice * 0.2;
  }

  // Double side addition (50% more)
  if (isDoubleSide && product.hasDoubleSide) {
    unitPrice += unitPrice * 0.5;
  }

  // Lamination addition
  if (lamination && lamination !== 'none' && product.hasLamination) {
    unitPrice += 0.5; // Fixed cost per unit
  }

  // Calculate subtotal
  const subtotal = unitPrice * quantity;

  // Finishing addition (flat fee)
  const selectedFinishing = product.finishings.find(f => f.id === finishing);
  const finishingCost = selectedFinishing?.price || 0;

  // Urgent delivery (25% extra)
  const urgentCost = (isUrgent && product.hasUrgentDelivery) ? subtotal * 0.25 : 0;

  // Calculate bulk discount
  const bulkDiscountPercent = getBulkDiscountPercent(product.bulkDiscounts, quantity);
  const preTotalBeforeDiscount = subtotal + finishingCost + urgentCost;
  const bulkDiscount = preTotalBeforeDiscount * (bulkDiscountPercent / 100);

  // Final price
  const finalPrice = preTotalBeforeDiscount - bulkDiscount;

  return {
    basePrice: product.basePrice,
    unitPrice,
    subtotal,
    finishingCost,
    urgentCost,
    bulkDiscount,
    bulkDiscountPercent,
    finalPrice,
    pricePerUnit: finalPrice / quantity
  };
}

function getBulkDiscountPercent(discounts, quantity) {
  if (!discounts || !Array.isArray(discounts)) {
    return 0;
  }
  const sortedDiscounts = [...discounts].sort((a, b) => b.minQuantity - a.minQuantity);
  const applicableDiscount = sortedDiscounts.find(d => quantity >= d.minQuantity);
  return applicableDiscount?.discountPercent || 0;
}

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// All routes require authentication
router.use(protect);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/',
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.product').notEmpty().withMessage('Product ID is required'),
    body('items.*.customization.size').notEmpty().withMessage('Size is required'),
    body('items.*.customization.paperType').notEmpty().withMessage('Paper type is required'),
    body('items.*.customization.quantity').isInt({ min: 1 }).withMessage('Quantity must be positive'),
    body('customerInfo.name').notEmpty().withMessage('Customer name is required'),
    body('customerInfo.email').isEmail().withMessage('Valid email is required'),
    body('customerInfo.phone').notEmpty().withMessage('Phone number is required'),
    body('billingAddress.street').notEmpty().withMessage('Billing street is required'),
    body('billingAddress.city').notEmpty().withMessage('Billing city is required'),
    body('billingAddress.state').notEmpty().withMessage('Billing state is required'),
    body('billingAddress.zipCode').notEmpty().withMessage('Billing zip code is required'),
    body('shippingAddress.street').notEmpty().withMessage('Shipping street is required'),
    body('shippingAddress.city').notEmpty().withMessage('Shipping city is required'),
    body('shippingAddress.state').notEmpty().withMessage('Shipping state is required'),
    body('shippingAddress.zipCode').notEmpty().withMessage('Shipping zip code is required'),
    body('payment.method').isIn(['stripe', 'razorpay', 'cod']).withMessage('Valid payment method is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        items,
        customerInfo,
        billingAddress,
        shippingAddress,
        payment,
        specialInstructions,
        discountCode
      } = req.body;

      // Import mock data for fallback
      const { mockProducts } = require('../data/mockData');

      // Validate and process items
      const processedItems = [];
      let subtotal = 0;

      for (const item of items) {
        let product;
        
        // Try to find product in MongoDB first, then fallback to mock data
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(item.product);
        
        if (req.isMongoConnected && isObjectId) {
          try {
            product = await Product.findById(item.product);
          } catch (mongoError) {
            console.error('MongoDB product lookup failed:', mongoError);
          }
        }
        
        // Fallback to mock data
        if (!product) {
          product = mockProducts.find(p => p.id === item.product || p._id === item.product);
        }

        if (!product || (product.isActive === false)) {
          return res.status(400).json({
            success: false,
            message: `Product not found or inactive: ${item.product}`
          });
        }

        // Validate customization
        const { customization } = item;
        
        // Check minimum quantity
        if (customization.quantity < product.minQuantity) {
          return res.status(400).json({
            success: false,
            message: `Minimum quantity for ${product.name} is ${product.minQuantity}`
          });
        }

        // Validate size and paper type
        const validSize = product.sizes.find(s => s.id === customization.size);
        const validPaper = product.paperTypes.find(p => p.id === customization.paperType);
        
        if (!validSize || !validPaper) {
          return res.status(400).json({
            success: false,
            message: `Invalid size or paper type for ${product.name}`
          });
        }

        // Calculate price using the same logic as products route
        const priceBreakdown = calculateProductPrice(product, customization);

        // Create processed item
        const processedItem = {
          product: product._id || product.id,
          productSnapshot: {
            id: product.id,
            name: product.name,
            category: product.category,
            basePrice: product.basePrice,
            image: product.image
          },
          customization,
          designFiles: item.designFiles || [],
          priceBreakdown,
          status: 'pending'
        };

        processedItems.push(processedItem);
        subtotal += priceBreakdown.finalPrice;
      }

      // Calculate tax and total
      const taxRate = 0.18; // 18% GST
      const taxAmount = subtotal * taxRate;
      const shippingCost = subtotal >= 999 ? 0 : 50; // Free shipping above ₹999
      
      // Apply discount if provided
      let discountAmount = 0;
      if (discountCode) {
        // Here you would validate the discount code
        // For now, we'll skip this implementation
      }

      const total = subtotal + taxAmount + shippingCost - discountAmount;

      // Generate order number
      const orderNumber = `ORD${Date.now().toString().slice(-6)}`;

      // Create order data
      const orderData = {
        orderNumber,
        user: req.user._id,
        items: processedItems,
        subtotal,
        tax: {
          amount: taxAmount,
          rate: taxRate,
          type: 'GST'
        },
        shipping: {
          cost: shippingCost,
          method: shippingCost === 0 ? 'free' : 'standard',
          estimatedDays: 7
        },
        discount: {
          amount: discountAmount,
          code: discountCode
        },
        total,
        customerInfo,
        billingAddress,
        shippingAddress,
        payment: {
          method: payment.method,
          status: 'pending'
        },
        specialInstructions,
        status: 'pending',
        timeline: [{
          status: 'pending',
          message: 'Order created successfully',
          timestamp: new Date()
        }],
        source: 'web',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      let order;
      
      // Try to save to MongoDB, fallback to mock response
      if (req.isMongoConnected) {
        try {
          order = await Order.create(orderData);
        } catch (mongoError) {
          console.error('MongoDB order creation failed:', mongoError);
        }
      }
      
      // If MongoDB failed or not connected, create mock order
      if (!order) {
        order = {
          _id: `mock_${Date.now()}`,
          ...orderData,
          formattedOrderNumber: orderNumber
        };
      }

      // Send order confirmation email (optional, might fail in development)
      try {
        await sendEmail({
          to: customerInfo.email,
          subject: `Order Confirmation - ${orderNumber}`,
          template: 'orderConfirmation',
          data: {
            customerName: customerInfo.name,
            orderNumber: orderNumber,
            items: processedItems,
            total: total,
            orderUrl: `${process.env.FRONTEND_URL}/orders/${order._id}`
          }
        });
      } catch (emailError) {
        console.error('Order confirmation email failed:', emailError);
        // Don't fail the order creation if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order }
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while creating order'
      });
    }
  }
);

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('status').optional().isString()
  ],
  async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        status
      };

      const orders = await Order.getByUser(req.user._id, options);
      const total = await Order.countDocuments({ 
        user: req.user._id,
        ...(status && { status })
      });

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', checkOwnership(Order), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name category image')
      .populate('user', 'name email');

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', 
  checkOwnership(Order),
  [
    body('reason').optional().isString().withMessage('Cancellation reason must be a string')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const order = req.resource;
      const { reason } = req.body;

      // Check if order can be cancelled
      if (!['pending', 'confirmed'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: 'Order cannot be cancelled at this stage'
        });
      }

      // Update order
      order.status = 'cancelled';
      order.cancellation = {
        reason: reason || 'Cancelled by customer',
        cancelledAt: new Date(),
        cancelledBy: req.user._id,
        refundStatus: order.payment.status === 'completed' ? 'full' : 'none'
      };

      await order.save();
      await order.addTimelineEntry('cancelled', reason || 'Order cancelled by customer', req.user._id);

      // Send cancellation email
      try {
        await sendEmail({
          to: order.customerInfo.email,
          subject: `Order Cancelled - ${order.formattedOrderNumber}`,
          template: 'orderCancellation',
          data: {
            customerName: order.customerInfo.name,
            orderNumber: order.orderNumber,
            reason: reason || 'Cancelled by customer'
          }
        });
      } catch (emailError) {
        console.error('Cancellation email failed:', emailError);
      }

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: { order }
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Track order
// @route   GET /api/orders/:id/track
// @access  Public (with order number validation)
router.get('/:id/track', async (req, res) => {
  try {
    const { orderNumber } = req.query;
    
    let order;
    if (orderNumber) {
      // Public tracking with order number
      order = await Order.findOne({ 
        orderNumber,
        _id: req.params.id 
      }).select('orderNumber status timeline tracking estimatedDelivery');
    } else if (req.user) {
      // Authenticated user tracking
      order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
      }).select('orderNumber status timeline tracking estimatedDelivery');
    } else {
      return res.status(401).json({
        success: false,
        message: 'Order number required for tracking'
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { 
        tracking: {
          orderNumber: order.orderNumber,
          status: order.status,
          timeline: order.timeline,
          tracking: order.tracking,
          estimatedDelivery: order.estimatedDelivery
        }
      }
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin routes
router.use(authorize('admin'));

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isString(),
    query('dateFrom').optional().isISO8601(),
    query('dateTo').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        dateFrom, 
        dateTo,
        search 
      } = req.query;

      // Build query
      const query = {};
      
      if (status) query.status = status;
      
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'customerInfo.name': { $regex: search, $options: 'i' } },
          { 'customerInfo.email': { $regex: search, $options: 'i' } }
        ];
      }

      const orders = await Order.find(query)
        .populate('user', 'name email')
        .populate('items.product', 'name category')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Order.countDocuments(query);

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status',
  [
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status'),
    body('message').optional().isString(),
    body('tracking').optional().isObject()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { status, message, tracking } = req.body;
      
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update tracking info if provided
      if (tracking) {
        order.tracking = { ...order.tracking, ...tracking };
      }

      // Update status
      await order.updateStatus(status, message, req.user._id);

      // Send status update email
      try {
        await sendEmail({
          to: order.customerInfo.email,
          subject: `Order Update - ${order.formattedOrderNumber}`,
          template: 'orderStatusUpdate',
          data: {
            customerName: order.customerInfo.name,
            orderNumber: order.orderNumber,
            status,
            message: message || `Your order status has been updated to ${status}`,
            trackingUrl: tracking?.trackingUrl
          }
        });
      } catch (emailError) {
        console.error('Status update email failed:', emailError);
      }

      const updatedOrder = await Order.findById(order._id)
        .populate('items.product', 'name category image');

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order: updatedOrder }
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
router.get('/admin/stats',
  [
    query('dateFrom').optional().isISO8601(),
    query('dateTo').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const { dateFrom, dateTo } = req.query;
      
      const dateRange = {};
      if (dateFrom) dateRange.startDate = dateFrom;
      if (dateTo) dateRange.endDate = dateTo;

      const stats = await Order.getStats(dateRange);

      res.json({
        success: true,
        data: { stats: stats[0] || {} }
      });
    } catch (error) {
      console.error('Get order stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

module.exports = router;