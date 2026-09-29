'use strict';

/**
 * Wraps an async route handler and forwards any rejected promise
 * to Express's next(err) so the global error handler picks it up.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { … }));
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
