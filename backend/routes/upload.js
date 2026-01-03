const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB default
    files: 10 // Maximum 10 files per request
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'auto',
      folder: 'printhub/designs',
      use_filename: true,
      unique_filename: true,
      ...options
    };

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// @desc    Upload design files
// @route   POST /api/upload/designs
// @access  Private
router.post('/designs', 
  protect,
  upload.array('designs', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadPromises = req.files.map(async (file) => {
        try {
          // Determine resource type based on file type
          let resourceType = 'auto';
          if (file.mimetype.startsWith('image/')) {
            resourceType = 'image';
          } else if (file.mimetype === 'application/pdf') {
            resourceType = 'raw';
          }

          const result = await uploadToCloudinary(file.buffer, {
            resource_type: resourceType,
            folder: `printhub/designs/${req.user._id}`,
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
          });

          return {
            filename: result.public_id,
            originalName: file.originalname,
            url: result.secure_url,
            size: file.size,
            mimetype: file.mimetype,
            cloudinaryId: result.public_id,
            uploadedAt: new Date()
          };
        } catch (uploadError) {
          console.error(`Upload failed for ${file.originalname}:`, uploadError);
          throw new Error(`Failed to upload ${file.originalname}: ${uploadError.message}`);
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      res.json({
        success: true,
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        data: { files: uploadedFiles }
      });
    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle specific multer errors
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 50MB per file.'
        });
      }
      
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 10 files per upload.'
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'File upload failed'
      });
    }
  }
);

// @desc    Upload single design file
// @route   POST /api/upload/design
// @access  Private
router.post('/design',
  protect,
  upload.single('design'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Determine resource type
      let resourceType = 'auto';
      if (req.file.mimetype.startsWith('image/')) {
        resourceType = 'image';
      } else if (req.file.mimetype === 'application/pdf') {
        resourceType = 'raw';
      }

      const result = await uploadToCloudinary(req.file.buffer, {
        resource_type: resourceType,
        folder: `printhub/designs/${req.user._id}`,
        public_id: `${Date.now()}-${req.file.originalname.split('.')[0]}`
      });

      const fileData = {
        filename: result.public_id,
        originalName: req.file.originalname,
        url: result.secure_url,
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudinaryId: result.public_id,
        uploadedAt: new Date()
      };

      res.json({
        success: true,
        message: 'File uploaded successfully',
        data: { file: fileData }
      });
    } catch (error) {
      console.error('Single upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'File upload failed'
      });
    }
  }
);

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:cloudinaryId
// @access  Private
router.delete('/:cloudinaryId', protect, async (req, res) => {
  try {
    const { cloudinaryId } = req.params;

    // Verify the file belongs to the user (basic security check)
    if (!cloudinaryId.includes(req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own files.'
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(cloudinaryId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found or already deleted'
      });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

// @desc    Get user's uploaded files
// @route   GET /api/upload/my-files
// @access  Private
router.get('/my-files', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get files from Cloudinary
    const result = await cloudinary.search
      .expression(`folder:printhub/designs/${req.user._id}`)
      .sort_by([['created_at', 'desc']])
      .max_results(parseInt(limit))
      .next_cursor(page > 1 ? req.query.cursor : undefined)
      .execute();

    const files = result.resources.map(resource => ({
      cloudinaryId: resource.public_id,
      filename: resource.filename || resource.public_id.split('/').pop(),
      url: resource.secure_url,
      size: resource.bytes,
      mimetype: resource.resource_type === 'image' ? `image/${resource.format}` : 'application/pdf',
      uploadedAt: new Date(resource.created_at),
      width: resource.width,
      height: resource.height
    }));

    res.json({
      success: true,
      data: {
        files,
        pagination: {
          current: parseInt(page),
          hasMore: !!result.next_cursor,
          nextCursor: result.next_cursor,
          total: result.total_count
        }
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve files'
    });
  }
});

// @desc    Get file info
// @route   GET /api/upload/info/:cloudinaryId
// @access  Private
router.get('/info/:cloudinaryId', protect, async (req, res) => {
  try {
    const { cloudinaryId } = req.params;

    // Basic security check
    if (!cloudinaryId.includes(req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const result = await cloudinary.api.resource(cloudinaryId);

    const fileInfo = {
      cloudinaryId: result.public_id,
      filename: result.filename || result.public_id.split('/').pop(),
      url: result.secure_url,
      size: result.bytes,
      mimetype: result.resource_type === 'image' ? `image/${result.format}` : 'application/pdf',
      uploadedAt: new Date(result.created_at),
      width: result.width,
      height: result.height,
      format: result.format
    };

    res.json({
      success: true,
      data: { file: fileInfo }
    });
  } catch (error) {
    console.error('Get file info error:', error);
    if (error.http_code === 404) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to get file info'
    });
  }
});

// @desc    Generate signed upload URL (for direct uploads)
// @route   POST /api/upload/signed-url
// @access  Private
router.post('/signed-url', protect, async (req, res) => {
  try {
    const { filename, resourceType = 'auto' } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `printhub/designs/${req.user._id}/${timestamp}-${filename}`;

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        public_id: publicId,
        folder: `printhub/designs/${req.user._id}`,
        resource_type: resourceType
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      data: {
        signature,
        timestamp,
        publicId,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`
      }
    });
  } catch (error) {
    console.error('Generate signed URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate signed URL'
    });
  }
});

module.exports = router;