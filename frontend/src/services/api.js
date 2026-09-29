/**
 * RailGuard AI - API Service Layer
 * 
 * Backend integration for automated risk assessment, AI diagnostic synthesis,
 * work order generation, and maintenance crew assignment.
 */

// Base backend URL - live Render railway backend by default, overridable via VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://railguard-ai-xkpt.onrender.com";

/**
 * Execute the full RailGuard AI automation pipeline
 * 
 * @param {Object} params
 * @param {Object} params.assetData - { assetId, wearPercentage, vibrationLevel, temperature, lastMaintenanceDays, requiredSkill }
 * @param {Array}  params.crews     - Array of crew objects or empty []
 * @param {string} [customBaseUrl]  - Optional override for custom URL
 * @returns {Promise<Object>} API response data
 */
export async function runAutomation(params, customBaseUrl = null) {
  const baseUrl = (customBaseUrl && customBaseUrl.trim()) ? customBaseUrl.trim().replace(/\/+$/, '') : API_BASE_URL;
  const endpoint = `${baseUrl}/api/automation/run`;

  const payload = {
    assetData: {
      assetId: params.assetData?.assetId || 'TRK-1001',
      wearPercentage: Number(params.assetData?.wearPercentage ?? 85),
      vibrationLevel: Number(params.assetData?.vibrationLevel ?? 9.4),
      temperature: Number(params.assetData?.temperature ?? 53),
      lastMaintenanceDays: Number(params.assetData?.lastMaintenanceDays ?? 210),
      requiredSkill: params.assetData?.requiredSkill || 'TRACK'
    },
    crews: Array.isArray(params.crews) ? params.crews : []
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        // Fallback to text if JSON parse fails
        const errorText = await response.text();
        if (errorText) errorMessage = errorText.slice(0, 150);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Unable to connect to RailGuard backend at ${baseUrl}. Ensure backend server is running on port 3000.`);
    }
    throw error;
  }
}

/**
 * Check backend API health status
 */
export async function checkBackendHealth(customBaseUrl = null) {
  const baseUrl = (customBaseUrl && customBaseUrl.trim()) ? customBaseUrl.trim().replace(/\/+$/, '') : API_BASE_URL;
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ok' || data.success === true;
  } catch {
    return false;
  }
}

/**
 * High-fidelity fallback / demo simulation data matching the backend schema
 * Allows immediate evaluation if backend is not started yet.
 */
export function getDemoResponse(assetData) {
  const wear = Number(assetData.wearPercentage || 85);
  const vib = Number(assetData.vibrationLevel || 9.4);
  const temp = Number(assetData.temperature || 53);
  const days = Number(assetData.lastMaintenanceDays || 210);
  const skill = assetData.requiredSkill || 'TRACK';
  const assetId = assetData.assetId || 'TRK-1001';

  let riskScore = 0;
  const factors = [];

  if (wear > 80) { riskScore += 40; factors.push(`Critical surface wear: ${wear}% exceeds 80% safety threshold`); }
  else if (wear > 60) { riskScore += 25; factors.push(`Moderate rail wear: ${wear}%`); }

  if (vib > 8) { riskScore += 30; factors.push(`Severe dynamic vibration: ${vib}G indicates structural ballast deflection`); }
  else if (vib > 5) { riskScore += 15; factors.push(`Elevated vibration signature: ${vib}G`); }

  if (temp > 45) { riskScore += 20; factors.push(`Extreme track temperature: ${temp}°C promotes thermal buckling`); }
  else if (temp > 35) { riskScore += 10; factors.push(`High ambient temperature: ${temp}°C`); }

  if (days > 180) { riskScore += 10; factors.push(`Overdue maintenance cycle: ${days} days since last physical inspection`); }

  if (temp > 50) { riskScore += 10; factors.push('Weather Advisory: Thermal expansion danger exceeded 50°C'); }
  if (temp > 45 && wear > 70) factors.push('Compound Risk: Combined extreme thermal expansion + severe material degradation');

  riskScore = Math.min(100, Math.max(0, riskScore));

  const riskLevel = riskScore >= 81 ? 'CRITICAL' : riskScore >= 61 ? 'HIGH' : riskScore >= 31 ? 'MEDIUM' : 'LOW';
  const weatherRisk = temp > 45 ? 'HIGH' : temp > 35 ? 'MEDIUM' : 'LOW';

  const urgency = riskScore >= 80 ? 'IMMEDIATE' : riskScore >= 60 ? 'HIGH' : 'SCHEDULED';
  const windowTime = riskScore >= 80 ? 'Within 24 hours' : riskScore >= 60 ? 'Within 48 hours' : 'Next scheduled 7-day maintenance window';

  return {
    success: true,
    data: {
      riskAssessment: {
        assetId: assetId,
        riskScore: riskScore,
        riskLevel: riskLevel,
        weatherRisk: weatherRisk,
        factors: factors.length > 0 ? factors : ['Routine operating stress parameters within standard tolerance']
      },
      aiExplanation: {
        summary: `Telemetry telemetry diagnostic indicates ${riskLevel.toLowerCase()} mechanical fatigue on asset ${assetId}. Primary drivers include wear at ${wear}%, high dynamic harmonic vibration (${vib}G), and high thermal stress (${temp}°C).`,
        recommendation: riskScore >= 80
          ? 'Impose immediate 30 km/h speed restriction on affected track block. Dispatch ultrasound flaw detection crew and inspect rail jointers for micro-fractures.'
          : 'Schedule ultrasonic flaw detection and re-lubricate rail gauge face during upcoming corridor night-shift closure.',
        urgency: urgency,
        inspectionWindow: windowTime
      },
      workOrder: {
        workOrderId: `WO-${Date.now().toString().slice(-6)}`,
        priority: riskLevel,
        deadline: new Date(Date.now() + (riskScore >= 80 ? 24 : 48) * 3600 * 1000).toISOString(),
        status: 'PENDING'
      },
      crewAssignment: {
        assignedCrew: {
          crewId: 'CRW-DELTA-04',
          name: 'Northern Sector Track Specialists'
        },
        assignmentReason: `Matched required skill (${skill}) with nearest rapid-response unit (distance: 4.2 km, low active workload).`
      }
    }
  };
}
