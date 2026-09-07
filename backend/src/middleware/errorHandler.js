import { logger } from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled API Error', {
    requestId: req.id,
    url: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: err.stack
  });

  const statusCode = err.statusCode || err.status || 500;
  const response = {
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred on the server.',
    requestId: req.id
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
