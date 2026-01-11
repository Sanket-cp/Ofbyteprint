const express = require('express');
const { query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { trackingApiAuth } = require('../middleware/apiAuth');

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

// All tracking routes require tracking API key authentication
router.use(trackingApiAuth);

// @desc    Track order by order number and phone (Public tracking)
// @route   GET /api/track/order
// @access  Public (Tracking API Key required)
router.get('/order',
  [
    query('order_number').notEmpty().withMessage('Order number is required'),
    query('phone').notEmpty().withMessage('Phone number is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { order_number, phone } = req.query;

      // Find order by order number and customer phone
      const order = await Order.findOne({ 
        orderNumber: order_number,
        'customerInfo.phone': phone
      })
      .select('orderNumber status timeline tracking estimatedDelivery customerInfo.name items.productSnapshot total createdAt updatedAt')
      .lean();

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found. Please check your order number and phone number.',
          error_code: 'ORDER_NOT_FOUND'
        });
      }

      // Transform order data for tracking response
      const trackingData = {
        order_number: order.orderNumber,
        customer_name: order.customerInfo.name,
        order_status: order.status,
        total_amount: order.total,
        order_date: order.createdAt,
        last_updated: order.updatedAt,
        products: order.items.map(item => ({
          name: item.productSnapshot?.name || 'Product',
          quantity: item.customization?.quantity || 1
        })),
        tracking: {
          carrier: order.tracking?.carrier || null,
          tracking_number: order.tracking?.trackingNumber || null,
          tracking_url: order.tracking?.trackingUrl || null,
          shipped_at: order.tracking?.shippedAt || null,
          delivered_at: order.tracking?.deliveredAt || null,
          estimated_delivery: order.tracking?.estimatedDelivery || null
        },
        timeline: order.timeline.map(entry => ({
          status: entry.status,
          message: entry.message,
          timestamp: entry.timestamp
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      };

      res.json({
        success: true,
        data: { tracking: trackingData },
        meta: {
          timestamp: new Date().toISOString(),
          api_version: '1.0'
        }
      });
    } catch (error) {
      console.error('Track order error:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to fetch order details. Please try again later.',
        error_code: 'SERVER_ERROR'
      });
    }
  }
);

// @desc    Track order by order ID (Direct tracking)
// @route   GET /api/track/order/:id
// @access  Public (Tracking API Key required)
router.get('/order/:id',
  [
    query('phone').optional().isString().withMessage('Phone must be a string')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { phone } = req.query;
      const orderId = req.params.id;

      // Build query - if phone provided, validate it matches
      const query = { _id: orderId };
      if (phone) {
        query['customerInfo.phone'] = phone;
      }

      const order = await Order.findOne(query)
        .select('orderNumber status timeline tracking estimatedDelivery customerInfo.name items.productSnapshot total createdAt updatedAt')
        .lean();

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or phone number does not match.',
          error_code: 'ORDER_NOT_FOUND'
        });
      }

      // Transform order data for tracking response
      const trackingData = {
        order_id: order._id,
        order_number: order.orderNumber,
        customer_name: order.customerInfo.name,
        order_status: order.status,
        total_amount: order.total,
        order_date: order.createdAt,
        last_updated: order.updatedAt,
        products: order.items.map(item => ({
          name: item.productSnapshot?.name || 'Product',
          quantity: item.customization?.quantity || 1
        })),
        tracking: {
          carrier: order.tracking?.carrier || null,
          tracking_number: order.tracking?.trackingNumber || null,
          tracking_url: order.tracking?.trackingUrl || null,
          shipped_at: order.tracking?.shippedAt || null,
          delivered_at: order.tracking?.deliveredAt || null,
          estimated_delivery: order.tracking?.estimatedDelivery || null
        },
        timeline: order.timeline.map(entry => ({
          status: entry.status,
          message: entry.message,
          timestamp: entry.timestamp
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      };

      res.json({
        success: true,
        data: { tracking: trackingData },
        meta: {
          timestamp: new Date().toISOString(),
          api_version: '1.0'
        }
      });
    } catch (error) {
      console.error('Track order by ID error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format',
          error_code: 'INVALID_ORDER_ID'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Unable to fetch order details. Please try again later.',
        error_code: 'SERVER_ERROR'
      });
    }
  }
);

// @desc    Get order status options (for frontend)
// @route   GET /api/track/status-info
// @access  Public (Tracking API Key required)
router.get('/status-info', (req, res) => {
  const statusInfo = {
    statuses: [
      {
        key: 'pending',
        label: 'Order Received',
        description: 'Your order has been received and is being processed',
        icon: 'clock',
        color: 'orange'
      },
      {
        key: 'confirmed',
        label: 'Order Confirmed',
        description: 'Payment confirmed and order is being prepared',
        icon: 'check-circle',
        color: 'blue'
      },
      {
        key: 'processing',
        label: 'In Production',
        description: 'Your order is currently being printed and prepared',
        icon: 'cog',
        color: 'purple'
      },
      {
        key: 'shipped',
        label: 'Shipped',
        description: 'Your order has been shipped and is on the way',
        icon: 'truck',
        color: 'indigo'
      },
      {
        key: 'delivered',
        label: 'Delivered',
        description: 'Your order has been successfully delivered',
        icon: 'check-circle-2',
        color: 'green'
      },
      {
        key: 'cancelled',
        label: 'Cancelled',
        description: 'This order has been cancelled',
        icon: 'x-circle',
        color: 'red'
      }
    ],
    estimated_delivery_days: {
      standard: 7,
      express: 3,
      urgent: 1
    }
  };

  res.json({
    success: true,
    data: statusInfo,
    meta: {
      timestamp: new Date().toISOString(),
      api_version: '1.0'
    }
  });
});

// @desc    Tracking API health check
// @route   GET /api/track/health
// @access  Public (Tracking API Key required)
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Tracking API is healthy',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      api_version: '1.0',
      service: 'Customer Order Tracking',
      database: req.isMongoConnected ? 'Connected' : 'Disconnected'
    }
  });
});

module.exports = router;