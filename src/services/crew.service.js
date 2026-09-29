'use strict';

// ─── assignCrew ───────────────────────────────────────────────────────────────

/**
 * Automatically assign the best available maintenance crew for a work order.
 *
 * Selection algorithm (in priority order):
 *   1. Must be available            (crew.available === true)
 *   2. Must match the required skill (crew.skill === workOrder.requiredSkill)
 *   3. Lowest workload wins
 *   4. On workload tie → nearest crew by distanceKm wins
 *
 * @param {object}   params
 * @param {object}   params.workOrder             - work order produced by workorder.service
 * @param {string}   params.workOrder.workOrderId
 * @param {string}   params.workOrder.priority
 * @param {string}   [params.workOrder.requiredSkill] - skill needed to service this order
 * @param {object[]} params.crews                 - pool of candidate crews
 * @param {string}   params.crews[].crewId
 * @param {string}   params.crews[].name
 * @param {string}   params.crews[].skill
 * @param {boolean}  params.crews[].available
 * @param {number}   params.crews[].distanceKm    - distance to asset site in km
 * @param {number}   params.crews[].workload       - current active task count (lower = less busy)
 *
 * @returns {{
 *   assignedCrew:       object | null,
 *   assignmentReason:   string,
 *   assignedAt:         string | null
 * }}
 */
const assignCrew = ({ workOrder, crews = [] }) => {
  // ── Guard ──────────────────────────────────────────────────────────────────
  if (!workOrder || typeof workOrder !== 'object') {
    throw new Error('crew.service.assignCrew: "workOrder" is required.');
  }

  const requiredSkill = workOrder.requiredSkill ?? null;

  // ── Step 1: available only ─────────────────────────────────────────────────
  const available = crews.filter((c) => c.available === true);

  if (available.length === 0) {
    return {
      assignedCrew:     null,
      assignmentReason: 'No crews are currently available.',
      assignedAt:       null,
    };
  }

  // ── Step 2: skill match ────────────────────────────────────────────────────
  const skilled = requiredSkill
    ? available.filter((c) => c.skill === requiredSkill)
    : available;                    // if no skill requirement, all available qualify

  if (skilled.length === 0) {
    return {
      assignedCrew:     null,
      assignmentReason: `No available crew has the required skill: "${requiredSkill}".`,
      assignedAt:       null,
    };
  }

  // ── Steps 3 & 4: lowest workload, then nearest ─────────────────────────────
  const best = skilled.reduce((chosen, candidate) => {
    if (candidate.workload < chosen.workload) return candidate;
    if (candidate.workload === chosen.workload &&
        candidate.distanceKm < chosen.distanceKm) return candidate;
    return chosen;
  });

  // ── Build reason string ────────────────────────────────────────────────────
  const tiedOnWorkload = skilled.filter((c) => c.workload === best.workload);
  const tieBreakUsed   = tiedOnWorkload.length > 1;

  const reasonParts = [
    `Assigned "${best.name}" (ID: ${best.crewId})`,
    requiredSkill ? `skill match: ${best.skill}` : null,
    `workload: ${best.workload} active task(s)`,
    tieBreakUsed ? `nearest on workload tie at ${best.distanceKm} km` : `distance: ${best.distanceKm} km`,
  ].filter(Boolean);

  return {
    assignedCrew:     best,
    assignmentReason: reasonParts.join(' | '),
    assignedAt:       new Date().toISOString(),
  };
};

module.exports = { assignCrew };
