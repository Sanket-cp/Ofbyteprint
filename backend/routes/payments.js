const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Initialize Razorpay (only if keys are provided)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    const Razorpay = require('razorpay');
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  } catch (error) {
    console.warn('Razorpay not configured:', error.message);
  }
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

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-intent
// @access  Private
router.post('/stripe/create-intent',
  protect,
  [
    body('orderId').isMongoId().withMessage('Valid order ID is required'),
    body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { orderId, amount } = req.body;

      // Verify order belongs to user
      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        'payment.status': 'pending'
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or payment already processed'
        });
      }

      // Verify amount matches order total
      const orderAmountInPaise = Math.round(order.total * 100);
      if (amount !== orderAmountInPaise) {
        return res.status(400).json({
          success: false,
          message: 'Amount mismatch'
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: orderAmountInPaise,
        currency: 'inr',
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          userId: req.user._id.toString()
        },
        description: `Payment for order ${order.orderNumber}`,
        receipt_email: order.customerInfo.email
      });

      // Update order with payment intent ID
      order.payment.paymentIntentId = paymentIntent.id;
      order.payment.status = 'processing';
      await order.save();

      res.json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        }
      });
    } catch (error) {
      console.error('Stripe create intent error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment intent'
      });
    }
  }
);

// @desc    Confirm Stripe payment
// @route   POST /api/payments/stripe/confirm
// @access  Private
router.post('/stripe/confirm',
  protect,
  [
    body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { paymentIntentId } = req.body;

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment not completed'
        });
      }

      // Find and update order
      const order = await Order.findOne({
        'payment.paymentIntentId': paymentIntentId,
        user: req.user._id
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update payment status
      order.payment.status = 'completed';
      order.payment.transactionId = paymentIntent.id;
      order.payment.paidAt = new Date();
      order.status = 'confirmed';
      await order.save();

      // Add timeline entry
      await order.addTimelineEntry('confirmed', 'Payment completed successfully', req.user._id);

      // Send payment confirmation email
      try {
        await sendEmail({
          to: order.customerInfo.email,
          subject: `Payment Confirmed - ${order.formattedOrderNumber}`,
          template: 'paymentConfirmation',
          data: {
            customerName: order.customerInfo.name,
            orderNumber: order.orderNumber,
            amount: order.total,
            transactionId: paymentIntent.id
          }
        });
      } catch (emailError) {
        console.error('Payment confirmation email failed:', emailError);
      }

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: {
          orderId: order._id,
          transactionId: paymentIntent.id
        }
      });
    } catch (error) {
      console.error('Stripe confirm payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to confirm payment'
      });
    }
  }
);

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
router.post('/razorpay/create-order',
  protect,
  [
    body('orderId').isMongoId().withMessage('Valid order ID is required'),
    body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { orderId, amount } = req.body;

      if (!razorpay) {
        return res.status(400).json({
          success: false,
          message: 'Razorpay not configured'
        });
      }

      // Verify order belongs to user
      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        'payment.status': 'pending'
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or payment already processed'
        });
      }

      // Verify amount matches order total
      const orderAmountInPaise = Math.round(order.total * 100);
      if (amount !== orderAmountInPaise) {
        return res.status(400).json({
          success: false,
          message: 'Amount mismatch'
        });
      }

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: orderAmountInPaise,
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          userId: req.user._id.toString()
        }
      });

      // Update order with Razorpay order ID
      order.payment.razorpayOrderId = razorpayOrder.id;
      order.payment.status = 'processing';
      await order.save();

      res.json({
        success: true,
        data: {
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID
        }
      });
    } catch (error) {
      console.error('Razorpay create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create Razorpay order'
      });
    }
  }
);

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
router.post('/razorpay/verify',
  protect,
  [
    body('razorpayOrderId').notEmpty().withMessage('Razorpay order ID is required'),
    body('razorpayPaymentId').notEmpty().withMessage('Razorpay payment ID is required'),
    body('razorpaySignature').notEmpty().withMessage('Razorpay signature is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      // Verify signature
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }

      // Find and update order
      const order = await Order.findOne({
        'payment.razorpayOrderId': razorpayOrderId,
        user: req.user._id
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update payment status
      order.payment.status = 'completed';
      order.payment.razorpayPaymentId = razorpayPaymentId;
      order.payment.transactionId = razorpayPaymentId;
      order.payment.paidAt = new Date();
      order.status = 'confirmed';
      await order.save();

      // Add timeline entry
      await order.addTimelineEntry('confirmed', 'Payment completed successfully', req.user._id);

      // Send payment confirmation email
      try {
        await sendEmail({
          to: order.customerInfo.email,
          subject: `Payment Confirmed - ${order.formattedOrderNumber}`,
          template: 'paymentConfirmation',
          data: {
            customerName: order.customerInfo.name,
            orderNumber: order.orderNumber,
            amount: order.total,
            transactionId: razorpayPaymentId
          }
        });
      } catch (emailError) {
        console.error('Payment confirmation email failed:', emailError);
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          orderId: order._id,
          transactionId: razorpayPaymentId
        }
      });
    } catch (error) {
      console.error('Razorpay verify payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify payment'
      });
    }
  }
);

// @desc    Handle payment failure
// @route   POST /api/payments/failure
// @access  Private
router.post('/failure',
  protect,
  [
    body('orderId').isMongoId().withMessage('Valid order ID is required'),
    body('reason').optional().isString()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { orderId, reason } = req.body;

      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update payment status
      order.payment.status = 'failed';
      await order.save();

      // Add timeline entry
      await order.addTimelineEntry('payment_failed', reason || 'Payment failed', req.user._id);

      res.json({
        success: true,
        message: 'Payment failure recorded'
      });
    } catch (error) {
      console.error('Payment failure error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Public
router.get('/methods', (req, res) => {
  try {
    const methods = [
      {
        id: 'razorpay',
        name: 'Razorpay',
        description: 'Pay with UPI, Cards, Net Banking, Wallets',
        enabled: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
        logo: '/images/razorpay-logo.png'
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Pay with Credit/Debit Cards',
        enabled: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY),
        logo: '/images/stripe-logo.png'
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        enabled: true,
        logo: '/images/cod-logo.png'
      }
    ];

    res.json({
      success: true,
      data: { methods: methods.filter(method => method.enabled) }
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Process COD order
// @route   POST /api/payments/cod/confirm
// @access  Private
router.post('/cod/confirm',
  protect,
  [
    body('orderId').isMongoId().withMessage('Valid order ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { orderId } = req.body;

      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        'payment.method': 'cod',
        'payment.status': 'pending'
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or not eligible for COD'
        });
      }

      // Update order status
      order.status = 'confirmed';
      order.payment.status = 'pending'; // COD remains pending until delivery
      await order.save();

      // Add timeline entry
      await order.addTimelineEntry('confirmed', 'Order confirmed with Cash on Delivery', req.user._id);

      // Send order confirmation email
      try {
        await sendEmail({
          to: order.customerInfo.email,
          subject: `Order Confirmed - ${order.formattedOrderNumber}`,
          template: 'codConfirmation',
          data: {
            customerName: order.customerInfo.name,
            orderNumber: order.orderNumber,
            amount: order.total
          }
        });
      } catch (emailError) {
        console.error('COD confirmation email failed:', emailError);
      }

      res.json({
        success: true,
        message: 'COD order confirmed successfully',
        data: { orderId: order._id }
      });
    } catch (error) {
      console.error('COD confirm error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to confirm COD order'
      });
    }
  }
);

// Webhook endpoints (these should be placed before the protect middleware)

// @desc    Stripe webhook
// @route   POST /api/payments/stripe/webhook
// @access  Public (Stripe webhook)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update order status if not already updated
        const order = await Order.findOne({
          'payment.paymentIntentId': paymentIntent.id
        });
        
        if (order && order.payment.status !== 'completed') {
          order.payment.status = 'completed';
          order.payment.paidAt = new Date();
          order.status = 'confirmed';
          await order.save();
          await order.addTimelineEntry('confirmed', 'Payment completed via webhook');
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        const failedOrder = await Order.findOne({
          'payment.paymentIntentId': failedPayment.id
        });
        
        if (failedOrder) {
          failedOrder.payment.status = 'failed';
          await failedOrder.save();
          await failedOrder.addTimelineEntry('payment_failed', 'Payment failed via webhook');
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// @desc    Razorpay webhook
// @route   POST /api/payments/razorpay/webhook
// @access  Public (Razorpay webhook)
router.post('/razorpay/webhook', express.json(), async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookBody = JSON.stringify(req.body);
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret')
      .update(webhookBody)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { event, payload } = req.body;

    switch (event) {
      case 'payment.captured':
        const payment = payload.payment.entity;
        console.log('Razorpay payment captured:', payment.id);
        
        const order = await Order.findOne({
          'payment.razorpayOrderId': payment.order_id
        });
        
        if (order && order.payment.status !== 'completed') {
          order.payment.status = 'completed';
          order.payment.razorpayPaymentId = payment.id;
          order.payment.paidAt = new Date();
          order.status = 'confirmed';
          await order.save();
          await order.addTimelineEntry('confirmed', 'Payment captured via webhook');
        }
        break;

      case 'payment.failed':
        const failedPayment = payload.payment.entity;
        console.log('Razorpay payment failed:', failedPayment.id);
        
        const failedOrder = await Order.findOne({
          'payment.razorpayOrderId': failedPayment.order_id
        });
        
        if (failedOrder) {
          failedOrder.payment.status = 'failed';
          await failedOrder.save();
          await failedOrder.addTimelineEntry('payment_failed', 'Payment failed via webhook');
        }
        break;

      default:
        console.log(`Unhandled Razorpay event: ${event}`);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

module.exports = router;