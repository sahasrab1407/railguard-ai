'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * In-memory store – replace with your persistence layer when ready.
 * @type {Map<string, object>}
 */
const store = new Map();

/**
 * Retrieve all alerts, with optional query-based filtering.
 * @param {object} query – parsed query string params (e.g. { severity, status })
 * @returns {object[]}
 */
const findAll = async (query = {}) => {
  let alerts = Array.from(store.values());

  if (query.severity) {
    alerts = alerts.filter((a) => a.severity === query.severity);
  }
  if (query.status) {
    alerts = alerts.filter((a) => a.status === query.status);
  }

  return alerts;
};

/**
 * Create a new alert.
 * @param {object} data
 * @returns {object}
 */
const create = async (data) => {
  const alert = {
    id:        uuidv4(),
    severity:  data.severity  || 'LOW',
    status:    data.status    || 'OPEN',
    message:   data.message   || '',
    trainId:   data.trainId   || null,
    routeId:   data.routeId   || null,
    metadata:  data.metadata  || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.set(alert.id, alert);
  return alert;
};

/**
 * Find an alert by ID.
 * @param {string} id
 * @returns {object|null}
 */
const findById = async (id) => store.get(id) ?? null;

/**
 * Update an existing alert.
 * @param {string} id
 * @param {object} data
 * @returns {object|null}
 */
const update = async (id, data) => {
  const existing = store.get(id);
  if (!existing) return null;

  const updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
  store.set(id, updated);
  return updated;
};

/**
 * Delete an alert.
 * @param {string} id
 */
const remove = async (id) => {
  store.delete(id);
};

module.exports = { findAll, create, findById, update, remove };
