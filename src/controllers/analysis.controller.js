'use strict';

const asyncHandler      = require('../middlewares/asyncHandler');
const analysisService   = require('../services/analysis.service');
const geminiService     = require('../services/gemini.service');

/**
 * POST /api/analysis/risk
 * Body: { assetId, wearPercentage, vibrationLevel, temperature, lastMaintenanceDays }
 *
 * 1. Calculates risk via the rule-based engine (analysis.service).
 * 2. Passes the result to Gemini for a human-readable explanation (gemini.service).
 * 3. Returns both payloads in a single combined response.
 */
const runRiskAnalysis = asyncHandler(async (req, res) => {
  const riskAssessment = await analysisService.assessRisk(req.body);
  const aiExplanation  = await geminiService.explainRisk(riskAssessment);

  res.status(200).json({
    success: true,
    data: {
      riskAssessment,
      aiExplanation,
    },
  });
});

/**
 * POST /api/analysis/predict
 * Body: { trainId, routeId, historicalData, … }
 */
const runPrediction = asyncHandler(async (req, res) => {
  const result = await analysisService.predict(req.body);
  res.status(200).json({ success: true, data: result });
});

module.exports = { runRiskAnalysis, runPrediction };
