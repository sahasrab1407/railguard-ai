'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * In-memory store – replace with your persistence layer when ready.
 * @type {Map<string, object>}
 */
const store = new Map();

/**
 * Retrieve all incidents with optional filtering.
 * @param {object} query – parsed query string params (e.g. { type, status })
 * @returns {object[]}
 */
const findAll = async (query = {}) => {
  let incidents = Array.from(store.values());

  if (query.type) {
    incidents = incidents.filter((i) => i.type === query.type);
  }
  if (query.status) {
    incidents = incidents.filter((i) => i.status === query.status);
  }

  return incidents;
};

/**
 * Create a new incident.
 * @param {object} data
 * @returns {object}
 */
const create = async (data) => {
  const incident = {
    id:          uuidv4(),
    type:        data.type        || 'UNCLASSIFIED',
    status:      data.status      || 'REPORTED',
    description: data.description || '',
    trainId:     data.trainId     || null,
    routeId:     data.routeId     || null,
    location:    data.location    || null,
    metadata:    data.metadata    || {},
    reportedAt:  new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };
  store.set(incident.id, incident);
  return incident;
};

/**
 * Find an incident by ID.
 * @param {string} id
 * @returns {object|null}
 */
const findById = async (id) => store.get(id) ?? null;

/**
 * Update an incident.
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
 * Delete an incident.
 * @param {string} id
 */
const remove = async (id) => {
  store.delete(id);
};

module.exports = { findAll, create, findById, update, remove };
