'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Attaches a unique X-Request-ID header to every request so that
 * log entries can be correlated across the request lifecycle.
 */
const requestId = (req, res, next) => {
  const id = req.headers['x-request-id'] || uuidv4();
  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
};

module.exports = requestId;
