'use strict';

const asyncHandler  = require('../middlewares/asyncHandler');
const alertsService = require('../services/alerts.service');

/**
 * GET /api/alerts
 */
const getAllAlerts = asyncHandler(async (req, res) => {
  const alerts = await alertsService.findAll(req.query);
  res.status(200).json({ success: true, data: alerts });
});

/**
 * POST /api/alerts
 */
const createAlert = asyncHandler(async (req, res) => {
  const alert = await alertsService.create(req.body);
  res.status(201).json({ success: true, data: alert });
});

/**
 * GET /api/alerts/:id
 */
const getAlertById = asyncHandler(async (req, res) => {
  const alert = await alertsService.findById(req.params.id);
  if (!alert) {
    const err = new Error(`Alert not found: ${req.params.id}`);
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, data: alert });
});

/**
 * PATCH /api/alerts/:id
 */
const updateAlert = asyncHandler(async (req, res) => {
  const alert = await alertsService.update(req.params.id, req.body);
  if (!alert) {
    const err = new Error(`Alert not found: ${req.params.id}`);
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, data: alert });
});

/**
 * DELETE /api/alerts/:id
 */
const deleteAlert = asyncHandler(async (req, res) => {
  await alertsService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAllAlerts, createAlert, getAlertById, updateAlert, deleteAlert };
