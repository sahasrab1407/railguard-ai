'use strict';

const express = require('express');
const router  = express.Router();
const healthController = require('../controllers/health.controller');

/**
 * GET /api/health
 * Returns server health status.
 */
router.get('/', healthController.getHealth);

module.exports = router;
