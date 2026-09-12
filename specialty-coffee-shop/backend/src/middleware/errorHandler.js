// Error Handler Middleware - Phase 1: Standardized Error Responses

import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'specialty-coffee-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Standard API Response Interface
 * { success: boolean, data?: T, error?: { code, message, details? } }
 */
export const apiResponse = (res, statusCode, data, error = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 400,
    timestamp: new Date().toISOString()
  };
  
  if (data !== undefined && data !== null) {
    response.data = data;
  }
  
  if (error) {
    response.error = typeof error === 'string' 
      ? { code: 'ERROR', message: error }
      : error;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Not Found Handler (404)
 */
export const notFoundHandler = (req, res, next) => {
  return apiResponse(res, 404, null, {
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`
  });
};

/**
 * Global Error Handler (500)
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Prisma errors
  if (err.code === 'P2002') {
    return apiResponse(res, 409, null, {
      code: 'DUPLICATE_ENTRY',
      message: 'A record with this value already exists',
      details: err.meta?.target || 'Unique constraint failed'
    });
  }
  
  if (err.code === 'P2025') {
    return apiResponse(res, 404, null, {
      code: 'RECORD_NOT_FOUND',
      message: 'The requested record was not found'
    });
  }
  
  // Zod validation errors
  if (err.name === 'ZodError') {
    return apiResponse(res, 400, null, {
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return apiResponse(res, 401, null, {
      code: 'INVALID_TOKEN',
      message: 'Invalid authentication token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return apiResponse(res, 401, null, {
      code: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired'
    });
  }
  
  // Default error response
  const isProduction = process.env.NODE_ENV === 'production';
  return apiResponse(res, 500, null, {
    code: 'INTERNAL_ERROR',
    message: isProduction ? 'Internal server error' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
};

/**
 * Async handler wrapper to catch async errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default {
  logger,
  apiResponse,
  notFoundHandler,
  errorHandler,
  asyncHandler
};

// Named export for logger to be imported directly
export { logger };
