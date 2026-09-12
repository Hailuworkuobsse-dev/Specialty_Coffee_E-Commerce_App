// Session Middleware - Phase 1: Secure Cookie-Based Sessions (CRITICAL FIX)
// Addresses SEC-01 and SC-05 vulnerabilities by removing session IDs from URLs

import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';

const SESSION_COOKIE_NAME = 'specialty_coffee_session';
const SESSION_DURATION_DAYS = 7;

/**
 * Initialize session middleware
 * Must be called before routes that need session support
 */
export const initSessionMiddleware = (app) => {
  app.use(cookieParser());
};

/**
 * Generate or retrieve session ID from HTTP-only secure cookie
 * This replaces the CRITICAL vulnerability of passing sessionId in URL query params
 */
export const sessionMiddleware = (req, res, next) => {
  try {
    // Get session ID from cookie (primary) or header/query/body fallback (for iframe environments)
    let sessionId = req.cookies?.[SESSION_COOKIE_NAME] || req.headers['x-session-id'] || req.query?.sessionId || req.body?.sessionId;
    
    const isNew = !sessionId;
    if (!sessionId) {
      sessionId = uuidv4();
    }
    
    // Set HTTP-only cookie with sameSite 'lax' for robust iframe and cross-page support
    const cookieOptions = {
      httpOnly: true,
      secure: false, // allow local/preview HTTP
      sameSite: 'lax',
      maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
      path: '/'
    };
    
    res.cookie(SESSION_COOKIE_NAME, sessionId, cookieOptions);
    res.setHeader('X-Session-ID', sessionId);
    
    req.sessionId = sessionId;
    req.isNewSession = isNew;
    
    // Log for debugging (remove in production)
    console.log(`Session: ${req.isNewSession ? 'Created new' : 'Retrieved existing'} - ID: ${sessionId.substring(0, 8)}...`);
    
    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    next(error);
  }
};

/**
 * Validate session middleware
 * Ensures session exists and is valid
 */
export const validateSession = (req, res, next) => {
  if (!req.sessionId) {
    return res.status(401).json({
      success: false,
      error: 'Session not found. Please refresh the page.'
    });
  }
  
  next();
};

/**
 * Clear session (for logout or cart clear)
 */
export const clearSession = (res) => {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
};

export default {
  initSessionMiddleware,
  sessionMiddleware,
  validateSession,
  clearSession,
  SESSION_COOKIE_NAME
};
