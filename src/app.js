'use strict';

const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');
const compression = require('compression');

const corsOptions  = require('./config/cors');
const rateLimiter  = require('./config/rateLimiter');
const logger       = require('./config/logger');
const apiRouter    = require('./routes');
const { getHealth } = require('./controllers/health.controller');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const requestId    = require('./middlewares/requestId');

const app = express();

// ─── Security & Compression ───────────────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());

// ─── Request Parsing ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Observability ───────────────────────────────────────────────────────────
app.use(requestId);
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);

// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use('/api', rateLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/', getHealth);
app.use('/api', apiRouter);

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
