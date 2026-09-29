'use strict';

const express              = require('express');
const router               = express.Router();
const automationController = require('../controllers/automation.controller');

/**
 * POST /api/automation/run – execute the full RailGuard AI pipeline
 */
router.post('/run', automationController.runAutomation);

module.exports = router;
