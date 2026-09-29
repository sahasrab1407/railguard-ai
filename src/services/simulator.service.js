'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Risk increase applied per day of maintenance delay (percentage points). */
const RISK_INCREASE_PER_DAY = 1.5;

/** Maximum allowable risk score. */
const MAX_RISK = 100;

// ─── Recommendation Thresholds ────────────────────────────────────────────────

/**
 * Ordered from highest to lowest so the first matching threshold wins.
 * Add or adjust thresholds here without touching the core logic.
 */
const RECOMMENDATION_THRESHOLDS = [
  {
    minRisk:        90,
    recommendation: 'Immediate maintenance required. Delay may cause asset failure.',
  },
  {
    minRisk:        75,
    recommendation: 'High risk. Maintenance should be scheduled urgently.',
  },
  {
    minRisk:        50,
    recommendation: 'Moderate risk. Monitor asset closely.',
  },
  {
    minRisk:        0,
    recommendation: 'Low risk. Continue planned maintenance schedule.',
  },
];

// ─── simulateDelay ────────────────────────────────────────────────────────────

/**
 * Simulate how a railway asset's risk evolves if maintenance is delayed.
 *
 * Risk grows linearly at {@link RISK_INCREASE_PER_DAY} percentage points per
 * day of delay and is capped at {@link MAX_RISK}.
 *
 * @param {object} params
 * @param {number} params.riskScore  - current risk score (0–100)
 * @param {number} params.delayDays  - number of days maintenance is delayed
 *
 * @returns {{
 *   currentRisk:     number,
 *   delayDays:       number,
 *   futureRisk:      number,
 *   riskIncrease:    number,
 *   recommendation:  string
 * }}
 *
 * @throws {Error} if riskScore or delayDays are outside valid ranges
 */
const simulateDelay = ({ riskScore, delayDays }) => {
  // ── Input validation ───────────────────────────────────────────────────────
  if (typeof riskScore !== 'number' || riskScore < 0 || riskScore > 100) {
    throw new Error(
      `simulator.service: "riskScore" must be a number between 0 and 100, got: ${riskScore}.`
    );
  }

  if (typeof delayDays !== 'number' || delayDays < 0 || !Number.isFinite(delayDays)) {
    throw new Error(
      `simulator.service: "delayDays" must be a non-negative finite number, got: ${delayDays}.`
    );
  }

  // ── Core calculation ───────────────────────────────────────────────────────
  const rawIncrease = delayDays * RISK_INCREASE_PER_DAY;
  const rawFuture   = riskScore + rawIncrease;

  const futureRisk   = Math.min(parseFloat(rawFuture.toFixed(2)),   MAX_RISK);
  const riskIncrease = parseFloat((futureRisk - riskScore).toFixed(2));

  // ── Recommendation ────────────────────────────────────────────────────────
  const { recommendation } = RECOMMENDATION_THRESHOLDS.find(
    (t) => futureRisk >= t.minRisk
  );

  return {
    currentRisk:    riskScore,
    delayDays,
    futureRisk,
    riskIncrease,
    recommendation,
  };
};

module.exports = { simulateDelay };
