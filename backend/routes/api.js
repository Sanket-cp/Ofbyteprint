const express = require('express');
const { query, body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { apiKeyAuth } = require('../middleware/apiAuth');

const router = express.Router();

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

// All API routes require API key authentication
router.use(apiKeyAuth);

// @desc    API Health check
// @route   GET /api/v1/health
// @access  Private (API Key required)
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      api_version: '1.0',
      database: req.isMongoConnected ? 'Connected' : 'Disconnected'
    }
  });
});

// @desc    Get order statistics (Admin)
// @route   GET /api/v1/stats
// @access  Private (API Key required)
router.get('/stats',
  [
    query('date_from').optional().isISO8601().withMessage('Invalid date format for date_from'),
    query('date_to').optional().isISO8601().withMessage('Invalid date format for date_to')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { date_from, date_to } = req.query;
      
      const dateRange = {};
      if (date_from) dateRange.startDate = date_from;
      if (date_to) dateRange.endDate = date_to;

      const stats = await Order.getStats(dateRange);
      const result = stats[0] || {};

      // Get status breakdown
      const statusCounts = {};
      if (result.statusBreakdown) {
        result.statusBreakdown.forEach(status => {
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
      }

      const transformedStats = {
        total_orders: result.totalOrders || 0,
        total_revenue: result.totalRevenue || 0,
        average_order_value: result.averageOrderValue || 0,
        status_breakdown: statusCounts,
        date_range: {
          from: date_from || null,
          to: date_to || null
        }
      };

      res.json({
        success: true,
        data: { stats: transformedStats },
        meta: {
          timestamp: new Date().toISOString(),
          api_version: '1.0'
        }
      });
    } catch (error) {
      console.error('API Get order stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error_code: 'SERVER_ERROR'
      });
    }
  }
);

// @desc    Update order status (External Admin only)
// @route   PUT /api/v1/orders/:id/status
// @access  Private (API Key required)
router.put('/orders/:id/status',
  [
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status. Allowed values: pending, confirmed, processing, shipped, delivered, cancelled'),
    body('message').optional().isString().withMessage('Message must be a string'),
    body('tracking_number').optional().isString().withMessage('Tracking number must be a string'),
    body('tracking_url').optional().isURL().withMessage('Tracking URL must be a valid URL'),
    body('carrier').optional().isString().withMessage('Carrier must be a string')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { status, message, tracking_number, tracking_url, carrier } = req.body;
      
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          error_code: 'ORDER_NOT_FOUND'
        });
      }

      // Store old status for logging
      const oldStatus = order.status;

      // Update tracking info if provided
      if (tracking_number || tracking_url || carrier) {
        order.tracking = {
          ...order.tracking,
          ...(tracking_number && { trackingNumber: tracking_number }),
          ...(tracking_url && { trackingUrl: tracking_url }),
          ...(carrier && { carrier })
        };

        // Set shipped date if status is shipped
        if (status === 'shipped' && !order.tracking.shippedAt) {
          order.tracking.shippedAt = new Date();
        }
      }

      // Update status using the existing method
      await order.updateStatus(
        status, 
        message || `Order status updated from ${oldStatus} to ${status} via API`, 
        null // No user ID for API updates
      );

      // Get updated order
      const updatedOrder = await Order.findById(order._id)
        .populate('items.product', 'name category image')
        .lean();

      // Transform response
      const transformedOrder = {
        order_id: updatedOrder._id,
        order_number: updatedOrder.orderNumber,
        customer_name: updatedOrder.customerInfo.name,
        phone: updatedOrder.customerInfo.phone,
        email: updatedOrder.customerInfo.email,
        order_status: updatedOrder.status,
        payment_status: updatedOrder.payment.status,
        tracking: updatedOrder.tracking,
        updated_at: updatedOrder.updatedAt
      };

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order: transformedOrder },
        meta: {
          timestamp: new Date().toISOString(),
          api_version: '1.0'
        }
      });
    } catch (error) {
      console.error('API Update order status error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format',
          error_code: 'INVALID_ORDER_ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error_code: 'SERVER_ERROR'
      });
    }
  }
);

// @desc    Get all orders for external admin dashboard
// @route   GET /api/v1/orders
// @access  Private (API Key required)
router.get('/orders',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status'),
    query('payment_status').optional().isIn(['pending', 'processing', 'completed', 'failed', 'refunded']).withMessage('Invalid payment status'),
    query('date_from').optional().isISO8601().withMessage('Invalid date format for date_from'),
    query('date_to').optional().isISO8601().withMessage('Invalid date format for date_to'),
    query('search').optional().isString().withMessage('Search must be a string')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        payment_status,
        date_from, 
        date_to,
        search 
      } = req.query;

      // Build query
      const query = {};
      
      if (status) query.status = status;
      if (payment_status) query['payment.status'] = payment_status;
      
      if (date_from || date_to) {
        query.createdAt = {};
        if (date_from) query.createdAt.$gte = new Date(date_from);
        if (date_to) query.createdAt.$lte = new Date(date_to);
      }

      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'customerInfo.name': { $regex: search, $options: 'i' } },
          { 'customerInfo.email': { $regex: search, $options: 'i' } },
          { 'customerInfo.phone': { $regex: search, $options: 'i' } }
        ];
      }

      const orders = await Order.find(query)
        .populate('user', 'name email')
        .populate('items.product', 'name category')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean(); // Use lean() for better performance

      const total = await Order.countDocuments(query);

      // Transform orders to match external API specification
      const transformedOrders = orders.map(order => ({
        id: `ORD-2024-${String(orders.indexOf(order) + 1).padStart(3, '0')}`,
        order_number: order.orderNumber,
        customer: {
          id: `cust-${order._id.toString().slice(-3)}`,
          name: order.customerInfo.name,
          phone: order.customerInfo.phone,
          email: order.customerInfo.email,
          address: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
        },
        items: order.items.map(item => ({
          id: `item-${item._id || Date.now()}`,
          print_type: item.productSnapshot?.name || 'Unknown Product',
          quantity: item.customization.quantity,
          unit_price: item.priceBreakdown.pricePerUnit || 0,
          total_price: item.priceBreakdown.finalPrice || 0,
          instructions: item.notes || order.specialInstructions || '',
          file_url: item.designFiles.length > 0 ? item.designFiles[0].url : '',
          file_name: item.designFiles.length > 0 ? item.designFiles[0].originalName : ''
        })),
        status: order.status === 'processing' ? 'printing' : order.status,
        payment_status: order.payment.status === 'completed' ? 'paid' : order.payment.status,
        total_amount: order.total,
        paid_amount: order.payment.status === 'completed' ? order.total : 0,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
        notes: order.specialInstructions || order.internalNotes || ''
      }));

      res.json({
        success: true,
        data: transformedOrders,
        count: transformedOrders.length
      });
    } catch (error) {
      console.error('API Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error_code: 'SERVER_ERROR'
      });
    }
  }
);

// @desc    Get single order by ID
// @route   GET /api/v1/orders/:id
// @access  Private (API Key required)
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name category image')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        error_code: 'ORDER_NOT_FOUND'
      });
    }

    // Transform order to match external API specification
    const transformedOrder = {
      id: `ORD-2024-001`,
      order_number: order.orderNumber,
      customer: {
        id: `cust-${order._id.toString().slice(-3)}`,
        name: order.customerInfo.name,
        phone: order.customerInfo.phone,
        email: order.customerInfo.email,
        address: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
      },
      items: order.items.map(item => ({
        id: `item-${item._id || Date.now()}`,
        print_type: item.productSnapshot?.name || 'Unknown Product',
        quantity: item.customization.quantity,
        unit_price: item.priceBreakdown.pricePerUnit || 0,
        total_price: item.priceBreakdown.finalPrice || 0,
        instructions: item.notes || order.specialInstructions || '',
        file_url: item.designFiles.length > 0 ? item.designFiles[0].url : '',
        file_name: item.designFiles.length > 0 ? item.designFiles[0].originalName : ''
      })),
      status: order.status === 'processing' ? 'printing' : order.status,
      payment_status: order.payment.status === 'completed' ? 'paid' : order.payment.status,
      total_amount: order.total,
      paid_amount: order.payment.status === 'completed' ? order.total : 0,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      notes: order.specialInstructions || order.internalNotes || ''
    };

    res.json({
      success: true,
      data: transformedOrder
    });
  } catch (error) {
    console.error('API Get single order error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
        error_code: 'INVALID_ORDER_ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 'SERVER_ERROR'
    });
  }
});

// @desc    Update order status (External Admin only)
// @route   PUT /api/v1/orders/:id/status
// @access  Private (API Key required)
router.put('/orders/:id/status',
  [
    body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status. Allowed values: pending, confirmed, processing, shipped, delivered, cancelled'),
    body('message').optional().isString().withMessage('Message must be a string'),
    body('tracking_number').optional().isString().withMessage('Tracking number must be a string'),
    body('tracking_url').optional().isURL().withMessage('Tracking URL must be a valid URL'),
    body('carrier').optional().isString().withMessage('Carrier must be a string')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { status, message, tracking_number, tracking_url, carrier } = req.body;
      
      // Validate ObjectId format
      if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format',
          error_code: 'INVALID_ORDER_ID'
        });
      }
      
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          error_code: 'ORDER_NOT_FOUND'
        });
      }

      // Store old status for logging
      const oldStatus = order.status;

      // Update tracking info if provided
      if (tracking_number || tracking_url || carrier) {
        order.tracking = {
          ...order.tracking,
          ...(tracking_number && { trackingNumber: tracking_number }),
          ...(tracking_url && { trackingUrl: tracking_url }),
          ...(carrier && { carrier })
        };

        // Set shipped date if status is shipped
        if (status === 'shipped' && !order.tracking.shippedAt) {
          order.tracking.shippedAt = new Date();
        }
      }

      // Update status using the existing method
      await order.updateStatus(
        status, 
        message || `Order status updated from ${oldStatus} to ${status} via API`, 
        null // No user ID for API updates
      );

      // Get updated order
      const updatedOrder = await Order.findById(order._id)
        .populate('items.product', 'name category image')
        .lean();

      // Transform response to match external API format
      const transformedOrder = {
        id: `ORD-2024-001`,
        order_number: updatedOrder.orderNumber,
        customer: {
          id: `cust-${updatedOrder._id.toString().slice(-3)}`,
          name: updatedOrder.customerInfo.name,
          phone: updatedOrder.customerInfo.phone,
          email: updatedOrder.customerInfo.email,
          address: `${updatedOrder.shippingAddress.street}, ${updatedOrder.shippingAddress.city}, ${updatedOrder.shippingAddress.state} ${updatedOrder.shippingAddress.zipCode}`
        },
        status: updatedOrder.status === 'processing' ? 'printing' : updatedOrder.status,
        payment_status: updatedOrder.payment.status === 'completed' ? 'paid' : updatedOrder.payment.status,
        total_amount: updatedOrder.total,
        paid_amount: updatedOrder.payment.status === 'completed' ? updatedOrder.total : 0,
        updated_at: updatedOrder.updatedAt,
        notes: updatedOrder.specialInstructions || updatedOrder.internalNotes || ''
      };

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: transformedOrder
      });
    } catch (error) {
      console.error('API Update order status error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format',
          error_code: 'INVALID_ORDER_ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error_code: 'SERVER_ERROR'
      });
    }
  }
);

module.exports = router;