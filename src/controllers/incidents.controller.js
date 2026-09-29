'use strict';

const asyncHandler       = require('../middlewares/asyncHandler');
const incidentsService   = require('../services/incidents.service');

/**
 * GET /api/incidents
 */
const getAllIncidents = asyncHandler(async (req, res) => {
  const incidents = await incidentsService.findAll(req.query);
  res.status(200).json({ success: true, data: incidents });
});

/**
 * POST /api/incidents
 */
const createIncident = asyncHandler(async (req, res) => {
  const incident = await incidentsService.create(req.body);
  res.status(201).json({ success: true, data: incident });
});

/**
 * GET /api/incidents/:id
 */
const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await incidentsService.findById(req.params.id);
  if (!incident) {
    const err = new Error(`Incident not found: ${req.params.id}`);
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, data: incident });
});

/**
 * PATCH /api/incidents/:id
 */
const updateIncident = asyncHandler(async (req, res) => {
  const incident = await incidentsService.update(req.params.id, req.body);
  if (!incident) {
    const err = new Error(`Incident not found: ${req.params.id}`);
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, data: incident });
});

/**
 * DELETE /api/incidents/:id
 */
const deleteIncident = asyncHandler(async (req, res) => {
  await incidentsService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAllIncidents, createIncident, getIncidentById, updateIncident, deleteIncident };
