import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './config/logger.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/healthRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import entityRoutes from './routes/entityRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Core Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(requestIdMiddleware);
app.use('/api/', rateLimiter({ windowMs: 60 * 1000, max: 100 }));

// HTTP Request Logger
app.use((req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl}`, {
    requestId: req.id,
    ip: req.ip
  });
  next();
});

// API Route Mounts
app.use('/api/health', healthRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/sources', uploadRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/entities', entityRoutes);

// 404 Route Catch-All
app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`,
    requestId: req.id
  });
});

// Centralized Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`🚀 Veritas ER Production Backend running on http://localhost:${PORT}`);
});

// Graceful Process Termination
const gracefulShutdown = (signal) => {
  logger.warn(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP Server closed. Process exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
