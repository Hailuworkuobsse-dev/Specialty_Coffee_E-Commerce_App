// Rate Limiter Middleware - Phase 5: Security Hardening

import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Prevents abuse and DDoS attacks
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts, please try again after 15 minutes.'
    }
  },
  skipSuccessfulRequests: true, // Only count failed requests
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Search endpoint rate limiter
 * Prevents search abuse
 */
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 searches per minute
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many search requests, please slow down.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Checkout rate limiter
 * Prevents checkout spam
 */
export const checkoutLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 checkouts per 5 minutes
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many checkout attempts, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  apiLimiter,
  authLimiter,
  searchLimiter,
  checkoutLimiter
};
