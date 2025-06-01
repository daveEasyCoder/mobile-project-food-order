/**
 * Request logging middleware
 * Logs all incoming requests and outgoing responses
 */
import logger from '../utils/logger.js';

// Create a logger for the middleware
const log = logger.createLogger('RequestLogger');

/**
 * Middleware to log all requests and responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestLogger = (req, res, next) => {
  // Get request start time
  const startTime = Date.now();
  
  // Generate a unique request ID
  const requestId = Math.random().toString(36).substring(2, 15);
  
  // Add request ID to the request object for tracking
  req.requestId = requestId;
  
  // Log the incoming request
  log.info(`${req.method} ${req.originalUrl}`, {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'unauthenticated'
  });
  
  // Log request body for non-GET requests, but sanitize sensitive information
  if (req.method !== 'GET' && req.body) {
    const sanitizedBody = { ...req.body };
    
    // Sanitize sensitive fields
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';
    if (sanitizedBody.accessToken) sanitizedBody.accessToken = '[REDACTED]';
    
    log.debug(`Request body for ${requestId}`, sanitizedBody);
  }
  
  // Capture the original end method
  const originalEnd = res.end;
  
  // Override the end method to log response information
  res.end = function(chunk, encoding) {
    // Calculate request duration
    const duration = Date.now() - startTime;
    
    // Get response status code
    const statusCode = res.statusCode;
    
    // Determine log level based on status code
    const logLevel = statusCode >= 500 ? 'error' : 
                     statusCode >= 400 ? 'warn' : 'info';
    
    // Log the response
    log[logLevel](`${req.method} ${req.originalUrl} ${statusCode} ${duration}ms`, {
      requestId,
      statusCode,
      duration,
      contentLength: res.get('Content-Length'),
      contentType: res.get('Content-Type')
    });
    
    // Call the original end method
    return originalEnd.apply(this, arguments);
  };
  
  next();
};

/**
 * Error logging middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorLogger = (err, req, res, next) => {
  log.error(`Error processing ${req.method} ${req.originalUrl}`, {
    requestId: req.requestId,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      status: err.statusCode || 500
    }
  });
  
  next(err);
};

export { requestLogger, errorLogger };
