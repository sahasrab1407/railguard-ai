'use strict';

const express = require('express');
const router  = express.Router();
const incidentsController = require('../controllers/incidents.controller');

/**
 * GET    /api/incidents       – list all incidents
 * POST   /api/incidents       – report a new incident
 * GET    /api/incidents/:id   – get a single incident
 * PATCH  /api/incidents/:id   – update an incident
 * DELETE /api/incidents/:id   – remove an incident
 */
router.get   ('/',    incidentsController.getAllIncidents);
router.post  ('/',    incidentsController.createIncident);
router.get   ('/:id', incidentsController.getIncidentById);
router.patch ('/:id', incidentsController.updateIncident);
router.delete('/:id', incidentsController.deleteIncident);

module.exports = router;
