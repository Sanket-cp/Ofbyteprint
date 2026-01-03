const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { mockProducts } = require('../data/mockData');

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

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', 
  [
    query('category').optional().isString(),
    query('featured').optional().isBoolean(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('sort').optional().isIn(['name', 'price', 'rating', 'newest']),
    query('search').optional().isString()
  ],
  optionalAuth,
  async (req, res) => {
    try {
      const {
        category,
        featured,
        page = 1,
        limit = 12,
        sort = 'newest',
        search,
        minPrice,
        maxPrice
      } = req.query;

      // Use mock data if MongoDB is not connected
      if (!req.isMongoConnected) {
        let products = [...mockProducts];
        
        // Apply filters
        if (category) {
          products = products.filter(p => p.category === category);
        }
        
        if (featured === 'true') {
          products = products.filter(p => p.isFeatured);
        }

        if (search) {
          products = products.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (minPrice || maxPrice) {
          products = products.filter(p => {
            if (minPrice && p.basePrice < parseFloat(minPrice)) return false;
            if (maxPrice && p.basePrice > parseFloat(maxPrice)) return false;
            return true;
          });
        }

        // Apply sorting
        switch (sort) {
          case 'name':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'price':
            products.sort((a, b) => a.basePrice - b.basePrice);
            break;
          case 'rating':
            products.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
            break;
          case 'newest':
          default:
            // Already in order
            break;
        }

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedProducts = products.slice(startIndex, endIndex);

        return res.json({
          success: true,
          data: {
            products: paginatedProducts,
            pagination: {
              current: parseInt(page),
              pages: Math.ceil(products.length / limit),
              total: products.length,
              limit: parseInt(limit)
            }
          }
        });
      }

      // MongoDB implementation (original code)
      const query = { isActive: true };
      
      if (category) {
        query.category = category;
      }
      
      if (featured === 'true') {
        query.isFeatured = true;
      }

      if (search) {
        query.$text = { $search: search };
      }

      if (minPrice || maxPrice) {
        query.basePrice = {};
        if (minPrice) query.basePrice.$gte = parseFloat(minPrice);
        if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice);
      }

      // Build sort
      let sortOption = {};
      switch (sort) {
        case 'name':
          sortOption = { name: 1 };
          break;
        case 'price':
          sortOption = { basePrice: 1 };
          break;
        case 'rating':
          sortOption = { averageRating: -1 };
          break;
        case 'newest':
        default:
          sortOption = { createdAt: -1 };
          break;
      }

      // Execute query
      const products = await Product.find(query)
        .sort(sortOption)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-createdBy -__v');

      // Get total count for pagination
      const total = await Product.countDocuments(query);

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total,
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    // Use mock data if MongoDB is not connected OR if the ID doesn't look like a MongoDB ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    
    if (!req.isMongoConnected || !isObjectId) {
      const product = mockProducts.find(p => p.id === req.params.id || p._id === req.params.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.json({
        success: true,
        data: { product }
      });
    }

    // MongoDB implementation - only for valid ObjectIds
    const product = await Product.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ],
      isActive: true 
    }).select('-createdBy -__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    
    // Fallback to mock data if MongoDB query fails
    try {
      const product = mockProducts.find(p => p.id === req.params.id || p._id === req.params.id);
      
      if (product) {
        return res.json({
          success: true,
          data: { product }
        });
      }
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Calculate product price
// @route   POST /api/products/:id/calculate-price
// @access  Public
router.post('/:id/calculate-price',
  [
    body('size').notEmpty().withMessage('Size is required'),
    body('paperType').notEmpty().withMessage('Paper type is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('isColor').optional().isBoolean(),
    body('isDoubleSide').optional().isBoolean(),
    body('lamination').optional().isString(),
    body('finishing').optional().isString(),
    body('isUrgent').optional().isBoolean()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      let product;

      // Use mock data if MongoDB is not connected OR if the ID doesn't look like a MongoDB ObjectId
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
      
      if (!req.isMongoConnected || !isObjectId) {
        product = mockProducts.find(p => p.id === req.params.id || p._id === req.params.id);
      } else {
        try {
          product = await Product.findOne({ 
            $or: [
              { _id: req.params.id },
              { id: req.params.id }
            ],
            isActive: true 
          });
        } catch (mongoError) {
          console.error('MongoDB query failed, falling back to mock data:', mongoError);
          product = mockProducts.find(p => p.id === req.params.id || p._id === req.params.id);
        }
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const customization = {
        size: req.body.size,
        paperType: req.body.paperType,
        quantity: parseInt(req.body.quantity),
        isColor: req.body.isColor !== undefined ? req.body.isColor : true,
        isDoubleSide: req.body.isDoubleSide || false,
        lamination: req.body.lamination || 'none',
        finishing: req.body.finishing || product.finishings[0]?.id,
        isUrgent: req.body.isUrgent || false
      };

      // Validate customization options
      const selectedSize = product.sizes.find(s => s.id === customization.size);
      if (!selectedSize) {
        return res.status(400).json({
          success: false,
          message: 'Invalid size selected'
        });
      }

      const selectedPaper = product.paperTypes.find(p => p.id === customization.paperType);
      if (!selectedPaper) {
        return res.status(400).json({
          success: false,
          message: 'Invalid paper type selected'
        });
      }

      if (customization.quantity < product.minQuantity) {
        return res.status(400).json({
          success: false,
          message: `Minimum quantity is ${product.minQuantity}`
        });
      }

      // Calculate price using the same logic as the Product model
      const priceBreakdown = calculateProductPrice(product, customization);

      res.json({
        success: true,
        data: {
          priceBreakdown,
          customization
        }
      });
    } catch (error) {
      console.error('Calculate price error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

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
  const sortedDiscounts = [...discounts].sort((a, b) => b.minQuantity - a.minQuantity);
  const applicableDiscount = sortedDiscounts.find(d => quantity >= d.minQuantity);
  return applicableDiscount?.discountPercent || 0;
}

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
router.get('/category/:categoryId', optionalAuth, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 12, sort = 'newest' } = req.query;

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'price':
        sortOption = { basePrice: 1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const products = await Product.find({ 
      category: categoryId, 
      isActive: true 
    })
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-createdBy -__v');

    const total = await Product.countDocuments({ 
      category: categoryId, 
      isActive: true 
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured/list', optionalAuth, async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .select('-createdBy -__v');

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
router.get('/search/query', 
  [
    query('q').notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 })
  ],
  handleValidationErrors,
  optionalAuth,
  async (req, res) => {
    try {
      const { q, page = 1, limit = 12, category } = req.query;

      // Build query
      const query = {
        $text: { $search: q },
        isActive: true
      };

      if (category) {
        query.category = category;
      }

      const products = await Product.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-createdBy -__v');

      const total = await Product.countDocuments(query);

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            current: parseInt(page),
            pages: Math.ceil(total / limit),
            total,
            limit: parseInt(limit)
          },
          query: q
        }
      });
    } catch (error) {
      console.error('Search products error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// Admin routes below this point
router.use(protect, authorize('admin'));

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
router.post('/',
  [
    body('id').notEmpty().withMessage('Product ID is required'),
    body('name').notEmpty().withMessage('Product name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
    body('minQuantity').isInt({ min: 1 }).withMessage('Minimum quantity must be at least 1'),
    body('sizes').isArray({ min: 1 }).withMessage('At least one size is required'),
    body('paperTypes').isArray({ min: 1 }).withMessage('At least one paper type is required'),
    body('finishings').isArray({ min: 1 }).withMessage('At least one finishing option is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const productData = {
        ...req.body,
        createdBy: req.user._id
      };

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Create product error:', error);
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Product with this ID already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { 
        $or: [
          { _id: req.params.id },
          { id: req.params.id }
        ]
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { 
        $or: [
          { _id: req.params.id },
          { id: req.params.id }
        ]
      },
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;