'use strict';

/**
 * Analysis Service
 *
 * assessRisk – rule-based railway asset risk engine.
 * predict     – stub for future AI/ML model integration.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Map a numeric score (0–100) to a named risk level.
 * @param {number} score
 * @returns {'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'}
 */
const scoreToLevel = (score) => {
  if (score >= 81) return 'CRITICAL';
  if (score >= 61) return 'HIGH';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
};

/**
 * Map a temperature reading to a weather risk level.
 * @param {number} temperature - degrees Celsius
 * @returns {'LOW'|'MEDIUM'|'HIGH'}
 */
const weatherToLevel = (temperature) => {
  if (temperature > 45) return 'HIGH';
  if (temperature > 35) return 'MEDIUM';
  return 'LOW';
};

// ─── assessRisk ───────────────────────────────────────────────────────────────

/**
 * Rule-based risk engine for a railway asset.
 *
 * Scoring table:
 *   Wear %          > 80  → +40 pts   | > 60  → +25 pts
 *   Vibration level > 8   → +30 pts   | > 5   → +15 pts
 *   Temperature °C  > 45  → +20 pts   | > 35  → +10 pts
 *   Maintenance age > 180 days         → +10 pts
 *
 * Weather intelligence (applied after base scoring):
 *   temp > 50                          → +10 pts  + advisory factor
 *   temp > 45 && wear > 70             → advisory factor (no extra pts)
 *   temp > 45 && vibration > 8         → advisory factor (no extra pts)
 *
 * Total is capped at 100.
 *
 * @param {object} payload
 * @param {string} [payload.assetId]
 * @param {number} [payload.wearPercentage]      - 0–100 %
 * @param {number} [payload.vibrationLevel]      - arbitrary units
 * @param {number} [payload.temperature]         - degrees Celsius
 * @param {number} [payload.lastMaintenanceDays] - days since last maintenance
 * @returns {Promise<{ assetId: string|null, riskScore: number, riskLevel: string, weatherRisk: string, factors: string[], analyzedAt: string }>}
 */
const assessRisk = async (payload) => {
  const {
    assetId             = null,
    wearPercentage      = 0,
    vibrationLevel      = 0,
    temperature         = 0,
    lastMaintenanceDays = 0,
  } = payload;

  let score   = 0;
  const factors = [];

  // ── Wear ──────────────────────────────────────────────────────────────────
  if (wearPercentage > 80) {
    score += 40;
    factors.push(`Critical wear level: ${wearPercentage}% (>80% threshold) +40 pts`);
  } else if (wearPercentage > 60) {
    score += 25;
    factors.push(`High wear level: ${wearPercentage}% (>60% threshold) +25 pts`);
  }

  // ── Vibration ─────────────────────────────────────────────────────────────
  if (vibrationLevel > 8) {
    score += 30;
    factors.push(`Severe vibration: ${vibrationLevel} (>8 threshold) +30 pts`);
  } else if (vibrationLevel > 5) {
    score += 15;
    factors.push(`Elevated vibration: ${vibrationLevel} (>5 threshold) +15 pts`);
  }

  // ── Temperature ───────────────────────────────────────────────────────────
  if (temperature > 45) {
    score += 20;
    factors.push(`Critical temperature: ${temperature}°C (>45°C threshold) +20 pts`);
  } else if (temperature > 35) {
    score += 10;
    factors.push(`High temperature: ${temperature}°C (>35°C threshold) +10 pts`);
  }

  // ── Maintenance age ───────────────────────────────────────────────────────
  if (lastMaintenanceDays > 180) {
    score += 10;
    factors.push(`Overdue maintenance: ${lastMaintenanceDays} days since last service (>180 days threshold) +10 pts`);
  }

  // ── Weather Intelligence ──────────────────────────────────────────────────
  // Rule 1: extreme heat adds bonus points
  if (temperature > 50) {
    score += 10;
    factors.push('Extreme heat may cause rail expansion and track deformation.');
  }

  // Rule 2: extreme heat compounded with high wear → structural stress advisory
  if (temperature > 45 && wearPercentage > 70) {
    factors.push(
      'High probability of rail expansion and structural stress due to extreme heat and track wear.'
    );
  }

  // Rule 3: extreme heat compounded with severe vibration → failure risk advisory
  if (temperature > 45 && vibrationLevel > 8) {
    factors.push('Combined heat and vibration increase track failure risk.');
  }

  // Cap at 100
  const riskScore = Math.min(score, 100);

  return {
    assetId,
    riskScore,
    riskLevel:   scoreToLevel(riskScore),
    weatherRisk: weatherToLevel(temperature),
    factors,
    analyzedAt:  new Date().toISOString(),
  };
};

/**
 * Run a predictive analysis to forecast potential incidents.
 *
 * @param {object} payload
 * @param {string} [payload.trainId]
 * @param {string} [payload.routeId]
 * @param {object} [payload.historicalData]
 * @returns {Promise<object>}
 */
const predict = async (payload) => {
  // TODO: integrate with AI model
  return {
    trainId:       payload.trainId  || null,
    routeId:       payload.routeId  || null,
    predictions:   [],              // array of { type, probability, timeframe }
    confidence:    0,               // 0–1
    predictedAt:   new Date().toISOString(),
  };
};

module.exports = { assessRisk, predict };
