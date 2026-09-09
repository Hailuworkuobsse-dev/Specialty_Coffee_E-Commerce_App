// Auth Middleware - Authentication & Role-Based Access Control
// Phase 4: Authentication & RBAC

import jwt from 'jsonwebtoken';
import { verifyToken } from '../services/authService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Authenticate user via JWT token
 * Extracts token from Authorization header and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token required. Please login.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

/**
 * Optional authentication - attaches user if token present
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    }

    next();
  } catch (error) {
    next();
  }
};

/**
 * Require specific role(s) for access
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

export const requireCustomer = requireRole('CUSTOMER', 'MANAGER', 'FULFILLMENT', 'ADMIN');
export const requireManager = requireRole('MANAGER', 'ADMIN');
export const requireFulfillment = requireRole('FULFILLMENT', 'ADMIN');
export const requireAdmin = requireRole('ADMIN');

export default {
  authenticate,
  optionalAuth,
  requireRole,
  requireCustomer,
  requireManager,
  requireFulfillment,
  requireAdmin
};
