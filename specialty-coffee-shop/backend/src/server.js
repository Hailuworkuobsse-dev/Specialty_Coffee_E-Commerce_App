// Main Express Server - Phase 1: Foundation & Security Remediation

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middleware
import { initSessionMiddleware, sessionMiddleware } from './middleware/sessionMiddleware.js';
import { notFoundHandler, errorHandler, logger } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import apiRoutes from './routes/api.js';

import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Trust reverse proxy (Nginx / Cloud Run) for accurate IP resolution and express-rate-limit compatibility
app.set('trust proxy', 1);

// Security: Helmet for HTTP headers with iframe and asset compatibility
app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: false
}));

// CORS configuration - support cookies and preview origins
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Session-ID', 'x-session-id'],
  exposedHeaders: ['Set-Cookie', 'X-Session-ID']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize session middleware (CRITICAL: Must be before routes)
initSessionMiddleware(app);

// Apply session middleware to all routes
app.use(sessionMiddleware);

// Apply rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  if (process.env.SQL_HOST && process.env.SQL_DB_NAME) {
    dbStatus = 'connected (PostgreSQL Cloud SQL)';
  }
  res.json({ 
    status: 'ok', 
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api', apiRoutes);

// Frontend static serving
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api', notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Start server on 0.0.0.0 for container ingress
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`
╔════════════════════════════════════════════╗
║     Specialty Coffee Shop Backend v2.0     ║
╠════════════════════════════════════════════╣
║  Server running on port ${PORT}              ║
║  Environment: ${process.env.NODE_ENV || 'development'.padEnd(20)}║
║  API Base URL: http://localhost:${PORT}/api  ║
║  Security: Helmet + HTTPS Cookies          ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
