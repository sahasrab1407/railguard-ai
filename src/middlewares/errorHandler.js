'use strict';

const logger = require('../config/logger');

/**
 * 404 handler – called when no route matches.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler.
 * Express identifies this as an error handler because it has 4 parameters.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  logger.error(`[${req.id}] ${err.message}`, { stack: err.stack });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    requestId: req.id,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
