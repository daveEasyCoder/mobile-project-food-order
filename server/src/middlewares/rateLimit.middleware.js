import rateLimit from 'express-rate-limit';

/**
 * Standard rate limiter for general API endpoints
 * Limits to 100 requests per 15 minutes per IP
 */
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

/**
 * Authentication rate limiter for login/signup endpoints
 * More restrictive to prevent brute force attacks
 * Limits to 10 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
  }
});

/**
 * Order creation rate limiter
 * Limits to 20 orders per hour per IP
 */
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 order creations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Order creation limit reached, please try again later'
  }
});

/**
 * Admin endpoints rate limiter
 * Limits to 50 requests per 15 minutes per IP
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many admin requests from this IP, please try again after 15 minutes'
  }
});
