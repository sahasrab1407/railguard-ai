'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../config/logger');

// ─── Client Initialisation ────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL   = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

/**
 * Lazily initialised Gemini model instance.
 * Throws a clear error at call-time (not at module load) if the key is absent.
 */
let _model = null;

const getModel = () => {
  if (!GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to your .env file before calling gemini.service.'
    );
  }
  if (!_model) {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    _model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: 'application/json',  // forces JSON-only output
        temperature:      0.2,                 // low temperature → deterministic output
        maxOutputTokens:  512,
      },
    });
  }
  return _model;
};

// ─── Prompt Builder ───────────────────────────────────────────────────────────

/**
 * Build the structured prompt sent to Gemini.
 * The risk values are injected verbatim – Gemini must NOT recalculate them.
 *
 * @param {object} assessment
 * @param {string} assessment.assetId
 * @param {number} assessment.riskScore   - 0–100
 * @param {string} assessment.riskLevel   - LOW | MEDIUM | HIGH | CRITICAL
 * @param {string} assessment.weatherRisk - LOW | MEDIUM | HIGH
 * @param {string[]} assessment.factors   - contributing risk factors
 * @returns {string}
 */
const buildPrompt = ({ assetId, riskScore, riskLevel, weatherRisk, factors }) => {
  const factorList = factors.length
    ? factors.map((f, i) => `  ${i + 1}. ${f}`).join('\n')
    : '  (none recorded)';

  return `
You are a railway asset management AI assistant.
A rule-based risk engine has already calculated the risk for a railway asset.
Your job is ONLY to explain the results and provide maintenance guidance — do NOT recalculate the risk.

## Asset Risk Assessment
- Asset ID    : ${assetId ?? 'UNKNOWN'}
- Risk Score  : ${riskScore} / 100
- Risk Level  : ${riskLevel}
- Weather Risk: ${weatherRisk}
- Contributing Factors:
${factorList}

## Your Task
Based ONLY on the information above, respond with a single valid JSON object that matches this exact schema:

{
  "summary": "<2–3 sentence explanation of why this asset is at risk>",
  "recommendation": "<concrete maintenance actions to address the identified factors>",
  "urgency": "<one of: IMMEDIATE | WITHIN_7_DAYS | WITHIN_30_DAYS | ROUTINE>",
  "inspectionWindow": "<e.g. 'Within 24 hours', 'Within 7 days', 'Next scheduled maintenance cycle'>"
}

Rules:
- Output ONLY the JSON object – no markdown, no extra text.
- Base urgency on riskLevel: CRITICAL → IMMEDIATE, HIGH → WITHIN_7_DAYS, MEDIUM → WITHIN_30_DAYS, LOW → ROUTINE.
- Keep language professional and concise.
`.trim();
};

// ─── Response Validator ───────────────────────────────────────────────────────

const REQUIRED_KEYS = ['summary', 'recommendation', 'urgency', 'inspectionWindow'];

const VALID_URGENCY = new Set([
  'IMMEDIATE',
  'WITHIN_7_DAYS',
  'WITHIN_30_DAYS',
  'ROUTINE',
]);

/**
 * Validate and normalise the parsed JSON from Gemini.
 *
 * @param {unknown} parsed
 * @returns {{ summary: string, recommendation: string, urgency: string, inspectionWindow: string }}
 * @throws {Error} if required fields are missing or urgency is not a recognised value
 */
const validateResponse = (parsed) => {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Gemini response is not a JSON object.');
  }

  for (const key of REQUIRED_KEYS) {
    if (typeof parsed[key] !== 'string' || parsed[key].trim() === '') {
      throw new Error(`Gemini response is missing or has an empty "${key}" field.`);
    }
  }

  const urgency = parsed.urgency.trim().toUpperCase();
  if (!VALID_URGENCY.has(urgency)) {
    throw new Error(`Gemini returned an unrecognised urgency value: "${parsed.urgency}".`);
  }

  return {
    summary:          parsed.summary.trim(),
    recommendation:   parsed.recommendation.trim(),
    urgency,
    inspectionWindow: parsed.inspectionWindow.trim(),
  };
};

// ─── Fallback Builder ─────────────────────────────────────────────────────────

/**
 * Rule-based fallback used when Gemini is unavailable or returns invalid output.
 * Ensures the API always returns a well-formed response.
 *
 * @param {object} assessment
 * @returns {{ summary: string, recommendation: string, urgency: string, inspectionWindow: string, _fallback: true }}
 */
const buildFallback = ({ assetId, riskScore, riskLevel, weatherRisk, factors }) => {
  const urgencyMap = {
    CRITICAL: 'IMMEDIATE',
    HIGH:     'WITHIN_7_DAYS',
    MEDIUM:   'WITHIN_30_DAYS',
    LOW:      'ROUTINE',
  };

  const windowMap = {
    CRITICAL: 'Within 24 hours',
    HIGH:     'Within 7 days',
    MEDIUM:   'Within 30 days',
    LOW:      'Next scheduled maintenance cycle',
  };

  const factorSummary = factors.length
    ? `Contributing factors include: ${factors.join('; ')}.`
    : 'No specific risk factors were recorded.';

  return {
    summary: `Asset ${assetId ?? 'UNKNOWN'} has a risk score of ${riskScore}/100 (${riskLevel}) ` +
             `with a weather risk of ${weatherRisk}. ${factorSummary}`,
    recommendation:
      'Conduct a full physical inspection. Address all flagged sensor readings. ' +
      'Review maintenance logs and escalate to the engineering team if the risk level is CRITICAL or HIGH.',
    urgency:          urgencyMap[riskLevel]  ?? 'ROUTINE',
    inspectionWindow: windowMap[riskLevel]   ?? 'Next scheduled maintenance cycle',
    _fallback:        true,  // signals to callers that Gemini was not used
  };
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Explain a pre-calculated railway asset risk assessment using Gemini.
 *
 * This function does NOT calculate risk — it only interprets the result
 * produced by analysis.service.assessRisk() and returns human-readable guidance.
 *
 * @param {object}   assessment
 * @param {string}   [assessment.assetId]
 * @param {number}   assessment.riskScore        - 0–100, from analysis.service
 * @param {string}   assessment.riskLevel        - LOW | MEDIUM | HIGH | CRITICAL
 * @param {string}   assessment.weatherRisk      - LOW | MEDIUM | HIGH
 * @param {string[]} assessment.factors          - contributing risk factors
 *
 * @returns {Promise<{
 *   summary:          string,
 *   recommendation:   string,
 *   urgency:          string,
 *   inspectionWindow: string,
 *   _fallback?:       true
 * }>}
 */
const explainRisk = async (assessment) => {
  const { assetId, riskScore, riskLevel, weatherRisk, factors = [] } = assessment;

  // ── Input guard ───────────────────────────────────────────────────────────
  if (riskScore === undefined || riskScore === null || !riskLevel || !weatherRisk) {
    throw new Error(
      'gemini.service.explainRisk requires riskScore, riskLevel, and weatherRisk from analysis.service.'
    );
  }

  // ── Call Gemini ───────────────────────────────────────────────────────────
  try {
    const model  = getModel();
    const prompt = buildPrompt({ assetId, riskScore, riskLevel, weatherRisk, factors });

    logger.debug(`[gemini.service] Sending risk explanation request for asset: ${assetId}`);

    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    logger.debug(`[gemini.service] Raw Gemini response: ${text}`);

    // responseMimeType: 'application/json' means the SDK already parses this,
    // but we defensively parse ourselves to handle edge-cases.
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`Gemini returned non-JSON text: ${text.slice(0, 200)}`);
    }

    const validated = validateResponse(parsed);

    logger.info(`[gemini.service] Risk explanation generated for asset: ${assetId}`);
    return validated;

  } catch (err) {
    logger.warn(
      `[gemini.service] Gemini call failed for asset ${assetId} — using fallback. Reason: ${err.message}`
    );

    return buildFallback({ assetId, riskScore, riskLevel, weatherRisk, factors });
  }
};

module.exports = { explainRisk };
