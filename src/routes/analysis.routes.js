'use strict';

const express = require('express');
const router  = express.Router();
const analysisController = require('../controllers/analysis.controller');

/**
 * POST /api/analysis/risk     – run a risk analysis
 * POST /api/analysis/predict  – run a predictive analysis
 */
router.post('/risk',    analysisController.runRiskAnalysis);
router.post('/predict', analysisController.runPrediction);

module.exports = router;
