\# 🚆 RailGuard AI



\*\*AI-Powered Predictive Railway Maintenance \& Workforce Automation Platform\*\*



RailGuard AI transforms raw railway inspection data into automated maintenance decisions — combining risk assessment, weather-aware analysis, AI-generated explanations, automatic work-order creation, and intelligent crew assignment into a single end-to-end workflow.



Built for Smart India Hackathon (SIH).



\---



\## 📌 Problem Statement



Railway infrastructure — tracks, signals, switches, and electrical systems — requires constant inspection and maintenance. Today, this involves large volumes of inspection data, maintenance records, and workforce constraints handled largely through manual decision-making, leading to:



\- Delayed maintenance actions

\- Poor resource allocation

\- Missed high-risk assets

\- Unexpected failures

\- Increased operational costs

\- Train delays and disruptions



\## 🎯 Our Solution



An intelligent platform that:



\- ✅ Analyzes inspection and historical maintenance data

\- ✅ Estimates asset failure risk (0–100 risk score)

\- ✅ Factors in weather impact (heatwaves, monsoons)

\- ✅ Prioritizes maintenance activities automatically

\- ✅ Generates work orders when risk crosses threshold

\- ✅ Assigns the nearest qualified crew automatically

\- ✅ Tracks full maintenance history per asset

\- ✅ Lets users simulate "what if we delay maintenance?" scenarios



\---



\## 🔁 Core Automation Workflow



```

Inspection Data + Weather Conditions

&#x20;             ↓

&#x20;    Risk Assessment Engine

&#x20;             ↓

&#x20;     Priority Classification

&#x20;             ↓

&#x20;  AI Explanation (Gemini)

&#x20;             ↓

&#x20; Auto Work Order Generation

&#x20;             ↓

&#x20;    Smart Crew Assignment

&#x20;             ↓

&#x20; Maintenance Tracking \& History

```



\---



\## ⭐ Key Features



| Feature | Description |

|---|---|

| \*\*AI Risk Assessment Engine\*\* | Scores each asset 0–100 based on wear %, vibration, inspection score, and maintenance history |

| \*\*Weather-Aware Risk Analysis\*\* | Adjusts risk in real time for heatwaves (track buckling risk) and monsoons (washout/water-logging risk) |

| \*\*Gemini AI Maintenance Advisor\*\* | Explains \*why\* an asset is high-risk in plain language for supervisors |

| \*\*Automatic Work Order Generator\*\* | Creates a work order automatically when risk score exceeds 80 |

| \*\*Smart Crew Assignment\*\* | Matches work orders to the nearest available crew with the right skill set |

| \*\*Maintenance Impact Simulator\*\* | Lets users simulate delaying maintenance and see projected risk increase |

| \*\*Operations Dashboard\*\* | Live view of total assets, high-risk assets, open work orders, crew availability, and weather alerts |



\---



\## 🏗️ Tech Stack



\- \*\*Frontend:\*\* React, deployed on Vercel

\- \*\*Backend:\*\* Node.js / Express, deployed on Render

\- \*\*Database:\*\* Supabase (PostgreSQL)

\- \*\*AI:\*\* Google Gemini API

\- \*\*Version Control:\*\* GitHub



\---



\## 📁 Project Structure



```

railguard-ai/

├── frontend/       # React dashboard, asset details, work orders, crew mgmt, simulator

├── backend/        # Express APIs, risk engine, Gemini integration, Supabase service

├── database/       # Supabase schema and seed scripts

│   ├── schema.sql

│   ├── add\_automation\_columns.sql

│   ├── maintenance\_history\_rebuild.sql

│   └── work\_orders\_seed.sql (optional test data)

└── README.md

```



\---



\## 🗄️ Database Schema



\*\*4 tables in Supabase:\*\*



| Table | Purpose |

|---|---|

| `assets` | Tracks, signals, switches, electrical systems + risk\_score, priority, ai\_explanation |

| `crews` | Maintenance crew skill, availability, distance, workload |

| `work\_orders` | Auto-generated when risk > 80; linked to asset + assigned crew |

| `maintenance\_history` | Log of past maintenance actions per asset |



Full schema: see \[`database/schema.sql`](./database/schema.sql)



\---



\## 🔌 API Endpoints (Backend)



| Method | Endpoint | Purpose |

|---|---|---|

| `POST` | `/analyze-asset` | Run risk assessment on an asset |

| `POST` | `/generate-work-order` | Create a work order for a high-risk asset |

| `POST` | `/assign-crew` | Assign the best-matched crew to a work order |

| `POST` | `/simulate-delay` | Simulate risk impact of delaying maintenance |

| `GET` | `/dashboard` | Fetch aggregated dashboard data |



\---



\## 🚀 Getting Started



\### Prerequisites

\- Node.js (v18+)

\- A Supabase project (see `/database/schema.sql` to set up tables)

\- A Google Gemini API key



\### 1. Clone the repo

```bash

git clone https://github.com/sahasrab1407/railguard-ai.git

cd railguard-ai

```



\### 2. Backend setup

```bash

cd backend

npm install

```



Create a `.env` file in `/backend`:

```

SUPABASE\_URL=your\_supabase\_project\_url

SUPABASE\_SERVICE\_KEY=your\_supabase\_service\_role\_key

GEMINI\_API\_KEY=your\_gemini\_api\_key

```



Run the backend:

```bash

npm start

```



\### 3. Frontend setup

```bash

cd frontend

npm install

npm start

```



\### 4. Database setup

Run these SQL files in your Supabase SQL Editor, in order:

1\. `database/schema.sql`

2\. `database/add\_automation\_columns.sql`



\---



\## 🎬 Demo Flow (2 minutes)



1\. Open Dashboard → shows 27 high-risk assets

2\. Select asset `TRK-2841`

3\. Risk analysis runs → Risk Score: 91, Priority: Critical

4\. Gemini explains: \*"High wear + heatwave conditions increase track deformation risk."\*

5\. Work order `WO-1024` auto-generated

6\. Crew `C04` auto-assigned

7\. Run the simulator: delay 7 days → risk jumps to 98



\---



\## 👨‍💻 Team



| Member | Role |

|---|---|

| \*\*Dharmesh\*\* | Frontend / UI + 3D visuals |

| \*\*Ishika\*\* | Backend + AI/Gemini integration |

| \*\*Sash\*\* | Database (Supabase), GitHub, Deployment |



\---



\## 🏆 Project USP



\- Weather-aware risk assessment (not just static scoring)

\- AI-powered maintenance recommendations in plain language

\- Fully automatic work order generation

\- Intelligent, skill-matched crew assignment

\- "What-if" maintenance delay simulator

\- End-to-end automation — from raw inspection data to assigned crew, with zero manual steps

