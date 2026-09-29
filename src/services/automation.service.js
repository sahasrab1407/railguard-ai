'use strict';

const analysisService = require('./analysis.service');
const geminiService = require('./gemini.service');
const workorderService = require('./workorder.service');
const crewService = require('./crew.service');
const logger = require('../config/logger');

const {
  saveRiskAssessment,
  saveAiExplanation,
  createWorkOrder,
  assignCrew: saveCrewAssignment
} = require('./supabase.service');

// ─── runAutomationPipeline ────────────────────────────────────────────────────

const runAutomationPipeline = async ({ assetData, crews = [] } = {}) => {
  if (!assetData || typeof assetData !== 'object') {
    throw new Error('automation.service: "assetData" is required.');
  }

  const assetId = assetData.assetId ?? null;
  logger.info(`[automation] Starting pipeline for asset: ${assetId}`);

  // ── Stage 1: Risk Assessment ──────────────────────────────────────────────
  logger.debug('[automation] Stage 1 — assessRisk');

  const riskAssessment = await analysisService.assessRisk(assetData);

  await saveRiskAssessment(
    riskAssessment.assetId,
    riskAssessment.riskScore,
    riskAssessment.riskLevel
  );

  logger.info(
    `[automation] Risk assessed — score: ${riskAssessment.riskScore}, ` +
    `level: ${riskAssessment.riskLevel}, weatherRisk: ${riskAssessment.weatherRisk}`
  );

  // ── Stage 2: AI Explanation ───────────────────────────────────────────────
  logger.debug('[automation] Stage 2 — explainRisk (Gemini)');

  const aiExplanation = await geminiService.explainRisk(riskAssessment);

  await saveAiExplanation(
    riskAssessment.assetId,
    aiExplanation.summary
  );

  logger.info(
    `[automation] AI explanation generated — urgency: ${aiExplanation.urgency}` +
    (aiExplanation._fallback ? ' (fallback)' : '')
  );

  // ── Stage 3: Work Order ───────────────────────────────────────────────────
  logger.debug('[automation] Stage 3 — generateWorkOrder');

  const workOrder = workorderService.generateWorkOrder({
    assetId: riskAssessment.assetId,
    riskScore: riskAssessment.riskScore,
    riskLevel: riskAssessment.riskLevel,
    requiredSkill: assetData.requiredSkill ?? null,
  });

  await createWorkOrder({
    workOrderId: workOrder.workOrderId,
    assetId: workOrder.assetId,
    priority: workOrder.priority,
    deadline: workOrder.deadline,
    description: aiExplanation.summary
  });

  logger.info(
    `[automation] Work order created — ID: ${workOrder.workOrderId}, ` +
    `priority: ${workOrder.priority}, deadline: ${workOrder.deadline}`
  );

  // ── Stage 4: Crew Assignment ──────────────────────────────────────────────
  logger.debug('[automation] Stage 4 — assignCrew');

  const crewAssignment = crewService.assignCrew({ workOrder, crews });

  if (crewAssignment.assignedCrew) {
    await saveCrewAssignment(
      workOrder.workOrderId,
      crewAssignment.assignedCrew.crewId
    );
  }

  logger.info(
    `[automation] Crew assignment — ` +
    (crewAssignment.assignedCrew
      ? `assigned: ${crewAssignment.assignedCrew.name} (${crewAssignment.assignedCrew.crewId})`
      : `unassigned: ${crewAssignment.assignmentReason}`)
  );

  // ── Return full pipeline result ───────────────────────────────────────────
  logger.info(`[automation] Pipeline complete for asset: ${assetId}`);

  return {
    riskAssessment,
    aiExplanation,
    workOrder,
    crewAssignment,
  };
};

module.exports = { runAutomationPipeline };