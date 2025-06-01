/**
 * Simple in-memory cache implementation
 * Caches API responses to improve performance
 */

// Simple in-memory cache store
const cacheStore = new Map();

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in seconds
 * @returns {Function} Express middleware
 */
export const cacheMiddleware = (duration = 60) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create a cache key from the request URL and query parameters
    const cacheKey = `${req.originalUrl || req.url}`;
    
    // Check if we have a cached response
    const cachedResponse = cacheStore.get(cacheKey);
    
    if (cachedResponse && cachedResponse.expiry > Date.now()) {
      // Return the cached response
      return res.status(200).json({
        ...cachedResponse.data,
        _cached: true
      });
    }

    // Store the original res.json method
    const originalJson = res.json;
    
    // Override res.json method to cache the response
    res.json = function(data) {
      // Store in cache
      cacheStore.set(cacheKey, {
        data,
        expiry: Date.now() + (duration * 1000)
      });
      
      // Call the original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Cache middleware for product listings
 * Caches for 5 minutes
 */
export const productCacheMiddleware = cacheMiddleware(300);

/**
 * Cache middleware for user favorites
 * Caches for 2 minutes
 */
export const favoritesCacheMiddleware = cacheMiddleware(120);

/**
 * Utility function to clear cache for a specific key pattern
 * @param {string} keyPattern - Pattern to match cache keys
 */
export const clearCache = (keyPattern) => {
  for (const key of cacheStore.keys()) {
    if (key.includes(keyPattern)) {
      cacheStore.delete(key);
    }
  }
};

/**
 * Middleware to clear cache for specific routes when data changes
 * @param {string} keyPattern - Pattern to match cache keys
 */
export const clearCacheMiddleware = (keyPattern) => {
  return (req, res, next) => {
    // Store the original end method
    const originalEnd = res.end;
    
    // Override the end method
    res.end = function(...args) {
      // Only clear cache if the request was successful (2xx status)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        clearCache(keyPattern);
      }
      
      // Call the original end method
      return originalEnd.apply(this, args);
    };
    
    next();
  };
};
