'use strict';

const express = require('express');
const router  = express.Router();

const healthRouter     = require('./health.routes');
const alertsRouter     = require('./alerts.routes');
const incidentsRouter  = require('./incidents.routes');
const analysisRouter   = require('./analysis.routes');
const automationRouter = require('./automation.routes');

// ─── Mount Sub-Routers ────────────────────────────────────────────────────────
router.use('/health',     healthRouter);
router.use('/alerts',     alertsRouter);
router.use('/incidents',  incidentsRouter);
router.use('/analysis',   analysisRouter);
router.use('/automation', automationRouter);

module.exports = router;
