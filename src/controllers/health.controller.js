'use strict';

/**
 * GET /api/health
 * Lightweight liveness probe – used by load balancers / orchestrators.
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status:  'ok',
    service: 'railguard-ai-backend',
    uptime:  Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };
