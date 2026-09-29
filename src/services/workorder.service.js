'use strict';

const { v4: uuidv4 } = require('uuid');

// ─── Config ───────────────────────────────────────────────────────────────────

/**
 * Maps a riskLevel to its corresponding work order priority and deadline.
 * deadline is either an ISO offset string or a human-readable label for
 * levels that do not have a fixed due-date (LOW).
 */
const RISK_POLICY = {
  CRITICAL: {
    priority:       'CRITICAL',
    deadlineLabel:  'Within 24 hours',
    deadlineOffset: 24 * 60 * 60 * 1000,           // 24 h in ms
  },
  HIGH: {
    priority:       'HIGH',
    deadlineLabel:  'Within 7 days',
    deadlineOffset: 7 * 24 * 60 * 60 * 1000,       // 7 days in ms
  },
  MEDIUM: {
    priority:       'MEDIUM',
    deadlineLabel:  'Within 30 days',
    deadlineOffset: 30 * 24 * 60 * 60 * 1000,      // 30 days in ms
  },
  LOW: {
    priority:       'LOW',
    deadlineLabel:  'Next maintenance cycle',
    deadlineOffset: null,                           // no fixed timestamp
  },
};

// ─── generateWorkOrder ────────────────────────────────────────────────────────

/**
 * Automatically generate a maintenance work order from a risk assessment.
 *
 * Priority and deadline are derived entirely from riskLevel according to the
 * policy table above — no manual mapping is needed by callers.
 *
 * @param {object} assessment
 * @param {string} [assessment.assetId]       - identifier of the railway asset
 * @param {number} assessment.riskScore       - 0–100, informational only
 * @param {string} assessment.riskLevel       - CRITICAL | HIGH | MEDIUM | LOW
 * @param {string} [assessment.requiredSkill] - skill required to service this asset
 *
 * @returns {{
 *   workOrderId:   string,
 *   assetId:       string|null,
 *   riskScore:     number,
 *   priority:      string,
 *   deadline:      string,
 *   requiredSkill: string|null,
 *   status:        'PENDING',
 *   createdAt:     string
 * }}
 *
 * @throws {Error} if riskLevel is not one of the recognised values
 */
const generateWorkOrder = ({ assetId = null, riskScore = 0, riskLevel, requiredSkill = null } = {}) => {
  const policy = RISK_POLICY[riskLevel];

  if (!policy) {
    throw new Error(
      `workorder.service: unrecognised riskLevel "${riskLevel}". ` +
      `Expected one of: ${Object.keys(RISK_POLICY).join(', ')}.`
    );
  }

  const now = new Date();

  // Compute the deadline: either a fixed ISO timestamp or the human-readable label
  const deadline = policy.deadlineOffset !== null
    ? new Date(now.getTime() + policy.deadlineOffset).toISOString()
    : policy.deadlineLabel;

  return {
    workOrderId:   uuidv4(),
    assetId,
    riskScore,
    priority:      policy.priority,
    deadline,
    requiredSkill,
    status:        'PENDING',
    createdAt:     now.toISOString(),
  };
};

module.exports = { generateWorkOrder };
