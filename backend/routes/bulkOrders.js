const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendEmail } = require('../utils/email');
const { optionalAuth } = require('../middleware/auth');

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

// @desc    Submit bulk order enquiry
// @route   POST /api/bulk-orders
// @access  Public
router.post('/',
  optionalAuth,
  [
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('contactPerson').notEmpty().withMessage('Contact person name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('productType').notEmpty().withMessage('Product type is required'),
    body('quantity').notEmpty().withMessage('Quantity is required'),
    body('requirements').optional().isString()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        companyName,
        contactPerson,
        email,
        phone,
        productType,
        quantity,
        requirements
      } = req.body;

      // Create enquiry data
      const enquiryData = {
        companyName,
        contactPerson,
        email,
        phone,
        productType,
        quantity,
        requirements: requirements || '',
        submittedAt: new Date(),
        status: 'pending',
        source: 'website'
      };

      // In a real application, you would save this to database
      console.log('Bulk Order Enquiry:', enquiryData);

      // Send notification email to admin
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'admin@printhub.com',
          subject: `New Bulk Order Enquiry - ${companyName}`,
          template: 'bulkOrderNotification',
          data: {
            companyName,
            contactPerson,
            email,
            phone,
            productType,
            quantity,
            requirements,
            submittedAt: new Date().toLocaleString()
          }
        });
      } catch (emailError) {
        console.error('Admin notification email failed:', emailError);
      }

      // Send confirmation email to customer
      try {
        await sendEmail({
          to: email,
          subject: 'Bulk Order Enquiry Received - PrintHub',
          template: 'bulkOrderConfirmation',
          data: {
            contactPerson,
            companyName,
            productType,
            quantity,
            enquiryId: `BLK${Date.now().toString().slice(-6)}`
          }
        });
      } catch (emailError) {
        console.error('Customer confirmation email failed:', emailError);
      }

      res.status(201).json({
        success: true,
        message: 'Bulk order enquiry submitted successfully',
        data: {
          enquiryId: `BLK${Date.now().toString().slice(-6)}`,
          status: 'received',
          estimatedResponse: '24 hours'
        }
      });
    } catch (error) {
      console.error('Bulk order submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while processing enquiry'
      });
    }
  }
);

// @desc    Get bulk order enquiries (Admin only)
// @route   GET /api/bulk-orders
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    // In a real application, you would fetch from database
    res.json({
      success: true,
      message: 'Bulk order enquiries retrieved successfully',
      data: {
        enquiries: [],
        total: 0
      }
    });
  } catch (error) {
    console.error('Get bulk orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;