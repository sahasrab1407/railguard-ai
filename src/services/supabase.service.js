// supabaseService.js
// Supabase client + helper functions for RailGuard AI automation pipeline
// Install: npm install @supabase/supabase-js
// Env vars required: SUPABASE_URL, SUPABASE_ANON_KEY
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
console.log('SUPABASE_URL =', supabaseUrl);
console.log('SUPABASE_KEY exists =', !!supabaseKey);
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 1. RISK ASSESSMENT
 * Saves the calculated risk score and priority level to an asset.
 * @param {string} assetId - text asset_id, e.g. "TRK-1001"
 * @param {number} riskScore - 0-100
 * @param {string} priority - "Critical" | "High" | "Medium" | "Low"
 */
async function saveRiskAssessment(assetId, riskScore, priority) {
    const { data, error } = await supabase
        .from('assets')
        .update({ risk_score: riskScore, priority: priority })
        .eq('asset_id', assetId)
        .select();

    if (error) throw error;
    return data;
}

/**
 * 2. AI EXPLANATION
 * Saves Gemini's natural-language explanation of an asset's risk.
 * @param {string} assetId
 * @param {string} explanationText
 */
async function saveAiExplanation(assetId, explanationText) {
    const { data, error } = await supabase
        .from('assets')
        .update({ ai_explanation: explanationText })
        .eq('asset_id', assetId)
        .select();

    if (error) throw error;
    return data;
}

/**
 * 3. WORK ORDER
 * Creates a new work order linked to an asset.
 * @param {Object} params
 * @param {string} params.workOrderId - e.g. "WO-1024"
 * @param {string} params.assetId - text asset_id, e.g. "TRK-1001"
 * @param {string} params.priority
 * @param {string} params.deadline - ISO timestamp string, e.g. "2026-10-05T00:00:00Z"
 * @param {string} params.description - AI-generated work order description
 */
async function createWorkOrder({ workOrderId, assetId, priority, deadline, description }) {
    // Look up the asset's internal UUID from its text asset_id
    const { data: asset, error: assetError } = await supabase
        .from('assets')
        .select('id')
        .eq('asset_id', assetId)
        .single();

    if (assetError) throw assetError;

    const { data, error } = await supabase
        .from('work_orders')
        .insert({
            work_order_id: workOrderId,
            asset_id: asset.id,
            priority,
            deadline,
            description,
            status: 'open'
        })
        .select();

    if (error) throw error;
    return data;
}

/**
 * 4. CREW ASSIGNMENT
 * Assigns a crew to a work order and marks that crew as busy.
 * @param {string} workOrderId - e.g. "WO-1024"
 * @param {string} crewId - e.g. "C04"
 */
async function assignCrew(workOrderId, crewId) {
    // Look up crew's internal UUID + current workload
    const { data: crew, error: crewError } = await supabase
        .from('crews')
        .select('id, current_workload')
        .eq('crew_id', crewId)
        .single();

    if (crewError) throw crewError;

    // Link crew to the work order
    const { data: workOrder, error: woError } = await supabase
        .from('work_orders')
        .update({ assigned_crew: crew.id, status: 'assigned' })
        .eq('work_order_id', workOrderId)
        .select();

    if (woError) throw woError;

    // Mark crew unavailable and bump their workload
    const { error: crewUpdateError } = await supabase
        .from('crews')
        .update({ availability: false, current_workload: crew.current_workload + 1 })
        .eq('crew_id', crewId);

    if (crewUpdateError) throw crewUpdateError;

    return workOrder;
}

module.exports = {
    supabase,
    saveRiskAssessment,
    saveAiExplanation,
    createWorkOrder,
    assignCrew
};