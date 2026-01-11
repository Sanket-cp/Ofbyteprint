const crypto = require('crypto');

// API Key authentication middleware
const apiKeyAuth = (req, res, next) => {
  try {
    // Get API key from header
    const apiKey = req.header('X-API-Key') || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required',
        error_code: 'MISSING_API_KEY'
      });
    }

    // Get valid API keys from environment
    const validApiKeys = (process.env.API_KEYS || '').split(',').filter(key => key.trim());
    
    if (validApiKeys.length === 0) {
      console.error('No API keys configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'API authentication not configured',
        error_code: 'API_CONFIG_ERROR'
      });
    }

    // Validate API key using constant-time comparison to prevent timing attacks
    const isValidKey = validApiKeys.some(validKey => {
      return crypto.timingSafeEqual(
        Buffer.from(apiKey, 'utf8'),
        Buffer.from(validKey.trim(), 'utf8')
      );
    });

    if (!isValidKey) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key',
        error_code: 'INVALID_API_KEY'
      });
    }

    // Log API usage (optional)
    console.log(`API access: ${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
    
    // Add API metadata to request
    req.apiAccess = {
      authenticated: true,
      timestamp: new Date(),
      keyUsed: apiKey.substring(0, 8) + '...' // Log partial key for debugging
    };

    next();
  } catch (error) {
    console.error('API authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error_code: 'AUTH_ERROR'
    });
  }
};

// Tracking API Key authentication middleware (Read-only access)
const trackingApiAuth = (req, res, next) => {
  try {
    // Get API key from header
    const apiKey = req.header('X-API-Key') || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required for order tracking',
        error_code: 'MISSING_API_KEY'
      });
    }

    // Get valid tracking API keys from environment
    const validTrackingKeys = (process.env.TRACKING_API_KEYS || '').split(',').filter(key => key.trim());
    
    if (validTrackingKeys.length === 0) {
      console.error('No tracking API keys configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Tracking API authentication not configured',
        error_code: 'API_CONFIG_ERROR'
      });
    }

    // Validate API key using constant-time comparison to prevent timing attacks
    const isValidKey = validTrackingKeys.some(validKey => {
      return crypto.timingSafeEqual(
        Buffer.from(apiKey, 'utf8'),
        Buffer.from(validKey.trim(), 'utf8')
      );
    });

    if (!isValidKey) {
      return res.status(401).json({
        success: false,
        message: 'Invalid tracking API key',
        error_code: 'INVALID_API_KEY'
      });
    }

    // Log tracking API usage
    console.log(`Tracking API access: ${req.method} ${req.originalUrl} at ${new Date().toISOString()}`);
    
    // Add API metadata to request
    req.apiAccess = {
      authenticated: true,
      type: 'tracking',
      timestamp: new Date(),
      keyUsed: apiKey.substring(0, 12) + '...' // Log partial key for debugging
    };

    next();
  } catch (error) {
    console.error('Tracking API authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error_code: 'AUTH_ERROR'
    });
  }
};

// Rate limiting for API endpoints
const apiRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const apiKey = req.header('X-API-Key') || req.header('Authorization')?.replace('Bearer ', '');
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, timestamps] of requests.entries()) {
      requests.set(key, timestamps.filter(time => time > windowStart));
      if (requests.get(key).length === 0) {
        requests.delete(key);
      }
    }

    // Check current API key usage
    const keyRequests = requests.get(apiKey) || [];
    
    if (keyRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'API rate limit exceeded',
        error_code: 'RATE_LIMIT_EXCEEDED',
        retry_after: Math.ceil(windowMs / 1000)
      });
    }

    // Add current request
    keyRequests.push(now);
    requests.set(apiKey, keyRequests);

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': maxRequests - keyRequests.length,
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
    });

    next();
  };
};

module.exports = {
  apiKeyAuth,
  trackingApiAuth,
  apiRateLimit
};