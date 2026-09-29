'use strict';

const asyncHandler       = require('../middlewares/asyncHandler');
const automationService  = require('../services/automation.service');

/**
 * POST /api/automation/run
 *
 * Runs the complete RailGuard AI automation pipeline in a single request:
 *   1. Risk assessment   (analysis.service)
 *   2. AI explanation    (gemini.service)
 *   3. Work order        (workorder.service)
 *   4. Crew assignment   (crew.service)
 *
 * Body: { assetData: { assetId, wearPercentage, vibrationLevel,
 *                       temperature, lastMaintenanceDays, requiredSkill },
 *         crews: [ { crewId, name, skill, available, distanceKm, workload } ] }
 */
const runAutomation = asyncHandler(async (req, res) => {
  const { assetData, crews } = req.body;

  const result = await automationService.runAutomationPipeline({ assetData, crews });

  res.status(200).json({
    success: true,
    data:    result,
  });
});

module.exports = { runAutomation };
