'use strict';

const express = require('express');
const router  = express.Router();
const alertsController = require('../controllers/alerts.controller');

/**
 * GET    /api/alerts       – list all alerts
 * POST   /api/alerts       – create a new alert
 * GET    /api/alerts/:id   – get a single alert
 * PATCH  /api/alerts/:id   – update an alert
 * DELETE /api/alerts/:id   – delete an alert
 */
router.get   ('/',    alertsController.getAllAlerts);
router.post  ('/',    alertsController.createAlert);
router.get   ('/:id', alertsController.getAlertById);
router.patch ('/:id', alertsController.updateAlert);
router.delete('/:id', alertsController.deleteAlert);

module.exports = router;
