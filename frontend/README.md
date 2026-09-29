# 🚂 RailGuard AI – Frontend Dashboard

Modern, production-grade operations center frontend for **RailGuard AI**, built with **React**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Features

1. **Operations Center Hero**
   - RailGuard AI logo with signal pulse beacons and system clock.
   - Operations status badge and real-time backend endpoint configuration.
2. **Railway Telemetry KPIs**
   - Assets Monitored (1,482 tracks & switches)
   - Active Work Orders
   - Critical Risks
   - Crew Availability (94% readiness)
3. **Asset Analysis Form**
   - 6 Input parameters: Asset ID, Wear Percentage, Vibration Level, Temperature, Last Maintenance Days, Required Skill.
   - Dual-input controls (numeric fields + synchronized range sliders).
   - Quick scenario presets (Critical Track Defect, Overheated Signal Relay, Switch Point Wear, Routine Catenary).
   - Regional crew roster dispatch option.
4. **Animated Railway Loading State**
   - High-speed train animation gliding over sleeper tracks with telemetry sparks.
   - 4-stage pipeline checklist reflecting real-time diagnosis progress.
5. **Color-Coded Risk Assessment Card**
   - Circular gauge meter (0–100 risk score).
   - Standard safety color coding:
     - `CRITICAL` = Red
     - `HIGH` = Orange
     - `MEDIUM` = Yellow
     - `LOW` = Green
   - Extreme thermal & weather risk impact badge.
   - Contributing diagnostic factors list.
6. **Gemini AI Insights Card**
   - Comprehensive diagnostic summary.
   - Actionable AI protocol recommendation.
   - Urgency rating and Inspection Window SLA countdown.
   - One-click copy for dispatch reports.
7. **Work Order Synthesis Card**
   - Unique Work Order ID.
   - Priority, Deadline, and Status.
   - "Acknowledge & Dispatch" workflow action.
8. **Crew Assignment Card**
   - Matched crew name and ID.
   - Allocation justification & trade matching.
   - Distance and radio dispatch metrics.
9. **Resilient Error Handling & Live Simulation**
   - Friendly error diagnostics.
   - One-click Retry and Instant Simulation Demo fallback.
10. **Backend API Integration Layer (`api.js`)**
    - Clean service layer calling `POST /api/automation/run`.
    - Centralized `API_BASE_URL` constant.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```

---

## 🔌 Connecting to Backend

In `frontend/src/services/api.js`:
```javascript
export const API_BASE_URL = "http://localhost:3000"; // REPLACE_WITH_BACKEND_URL
```
You can also change the backend URL directly from the header settings gear icon in the UI at runtime.
