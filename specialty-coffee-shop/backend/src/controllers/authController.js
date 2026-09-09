// Auth Controller - Authentication Request Handlers
// Phase 4: Authentication & RBAC

import * as authService from '../services/authService.js';
import { loginSchema, registerSchema } from '../schemas/validations.js';

/**
 * Register new user
 */
export const register = async (req, res) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);

    const user = await authService.registerUser(validatedData);

    res.status(201).json({
      success: true,
      data: { user },
      message: 'Registration successful. Please login.'
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    if (error.message === 'Email already registered') {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }

    throw error;
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    // Validate input
    const { email, password } = loginSchema.parse(req.body);

    const result = await authService.loginUser(email, password);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        expiresIn: result.expiresIn,
        user: result.user
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    if (['Invalid credentials', 'Account is deactivated'].includes(error.message)) {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }

    throw error;
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    const result = await authService.refreshAccessToken(refreshToken);

    // Set new refresh token in cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        expiresIn: result.expiresIn
      }
    });
  } catch (error) {
    if (['Invalid refresh token', 'Refresh token expired', 'Refresh token has been revoked'].includes(error.message)) {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }

    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await authService.logoutUser(refreshToken);
      res.clearCookie('refreshToken');
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await authService.getUserProfile(userId);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, phone } = req.body;

    const user = await authService.updateUserProfile(userId, { firstName, lastName, phone });

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    await authService.changePassword(userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    if (error.message === 'User not found' || error.message === 'Current password is incorrect') {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }

    throw error;
  }
};

export default {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword
};
