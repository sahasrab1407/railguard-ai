# 🚂 RailGuard AI – Backend API

Node.js + Express REST API backend for the RailGuard AI platform.

---

## Project Structure

```
RailGaurd/
├── src/
│   ├── server.js            # Entry point – starts HTTP server & wires signals
│   ├── app.js               # Express app factory (middleware + routes)
│   ├── config/
│   │   ├── cors.js          # CORS policy (driven by ALLOWED_ORIGINS env var)
│   │   ├── logger.js        # Winston logger
│   │   └── rateLimiter.js   # express-rate-limit config
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── alerts.controller.js
│   │   ├── incidents.controller.js
│   │   └── analysis.controller.js
│   ├── middlewares/
│   │   ├── asyncHandler.js  # Wraps async handlers to forward errors to Express
│   │   ├── errorHandler.js  # Global 404 + error handler
│   │   └── requestId.js     # Stamps every request with X-Request-ID
│   ├── routes/
│   │   ├── index.js         # Aggregates all domain routers under /api
│   │   ├── health.routes.js
│   │   ├── alerts.routes.js
│   │   ├── incidents.routes.js
│   │   └── analysis.routes.js
│   └── services/
│       ├── alerts.service.js    # Business logic for alerts (in-memory store)
│       ├── incidents.service.js # Business logic for incidents (in-memory store)
│       └── analysis.service.js  # Stub AI analysis (risk scoring, prediction)
├── .env.example
├── .gitignore
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env as needed
```

### 3. Start the dev server

```bash
npm run dev
```

The server starts on **http://localhost:3000** by default.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|---------------------------|---------------------------|
| GET | `/api/health` | Liveness probe |
| GET | `/api/alerts` | List all alerts |
| POST | `/api/alerts` | Create an alert |
| GET | `/api/alerts/:id` | Get alert by ID |
| PATCH | `/api/alerts/:id` | Update an alert |
| DELETE | `/api/alerts/:id` | Delete an alert |
| GET | `/api/incidents` | List all incidents |
| POST | `/api/incidents` | Report an incident |
| GET | `/api/incidents/:id` | Get incident by ID |
| PATCH | `/api/incidents/:id` | Update an incident |
| DELETE | `/api/incidents/:id` | Delete an incident |
| POST | `/api/analysis/risk` | Run risk analysis |
| POST | `/api/analysis/predict` | Run predictive analysis |

### Query Filters

- `GET /api/alerts?severity=HIGH&status=OPEN`
- `GET /api/incidents?type=COLLISION&status=REPORTED`

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `NODE_ENV` | `development` | Environment (`development` / `production`) |
| `ALLOWED_ORIGINS` | _(empty = all)_ | Comma-separated allowed CORS origins |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate-limit window in ms (15 min) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `LOG_LEVEL` | `info` | Winston log level |

---

## Next Steps

- [ ] Add a database layer (MongoDB / PostgreSQL / etc.) and replace the in-memory stores
- [ ] Add request validation middleware (e.g. Zod / Joi)
- [ ] Add authentication / authorization (JWT or API key)
- [ ] Integrate AI model into `analysis.service.js`
- [ ] Add unit & integration tests (Jest / Supertest)
