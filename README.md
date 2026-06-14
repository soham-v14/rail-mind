# RailMind

**AI-Powered Railway Safety, Monitoring & Decision Intelligence Platform**

> *"Predicting incidents before they happen and helping operators respond in real time."*

## 🌐 Live Demo

**Dashboard:** https://rail-mind-nine.vercel.app/

---

## Overview

RailMind is an intelligent co-pilot for railway operations. Instead of operators staring at dozens of disparate screens, RailMind continuously watches CCTV feeds, monitors track conditions, predicts delays, detects dangerous situations, and suggests actions automatically.

### The Problem

Railways suffer from:
- Track failures and signal faults
- Human intrusions (trespassing, track crossing)
- Unattended objects at stations and platforms
- Delays cascading across the network
- Slow emergency response
- Lack of unified monitoring

Current systems are **reactive**. RailMind makes them **predictive**.

---

## System Architecture

```
                    CCTV Feeds
                         |
                         V
      +--------------------------------+
      |    Computer Vision Engine      |
      |  (YOLOv8 + ByteTrack + OpenCV) |
      +--------------------------------+
                         |
                         V
      +--------------------------------+
      |     Event Intelligence Layer   |
      +--------------------------------+
          /         |           \
         /          |            \
 Track Risk    Delay Engine    Safety Engine
 Prediction    Forecasting     Incident AI
         \         |            /
          \        |           /
               RailMind
          Decision Engine
                    |
                    V
      +--------------------------------+
      |   Control Room Dashboard      |
      |   (Next.js + Tailwind + Map)  |
      +--------------------------------+
```

---

## Modules

### 1. Human / Obstacle Detection on Tracks *(built)*

Real-time detection of objects and hazards from CCTV feeds using computer vision.

| Feature | Description |
|---------|-------------|
| **Human Intrusion** | Detect people on tracks, trespassing, crossing railway lines |
| **Unattended Object** | Detect bags, suitcases, suspicious objects near platforms/tracks |
| **Track Obstacle** | Detect vehicles, debris, and obstructions on railway lines |
| **Animal Detection** | Detect animals on or near tracks |

**Tech:** YOLOv8, ByteTrack, OpenCV, PyTorch

#### Usage

```bash
# Run with webcam
python3 run_detection.py 0

# Run with video file (enable ByteTrack)
python3 run_detection.py sample_video.mp4 --track

# Run on single image
python3 run_detection.py image.jpg

# Record output
python3 run_detection.py 0 --output recording.mp4
```

### 2. Incident Risk Prediction *(built)*

Predict incident likelihood using weather, track condition, crowd density, and operational data.

**Inputs:** Weather, train speed, track conditions, maintenance history, crowd density, visibility, time of day, track geometry
**Output:** Section risk score (0–100), risk category, top 5 contributing factors, inspection recommendation
**Model:** XGBoost (trained on 10K synthetic railway samples)

#### Usage

```bash
# Start the API
uvicorn modules.risk_prediction.app:app --host 0.0.0.0 --port 8001

# Predict risk for a section
curl -X POST http://localhost:8001/risk/predict \
  -H "Content-Type: application/json" \
  -d '{"weather_encoded":3,"track_condition_encoded":2,"crowd_density_encoded":3,"is_night":1}'
```

### 3. Emergency Recommendation Agent *(built)*

When an incident is detected, an AI agent generates structured response actions. Uses LangGraph for the stateful workflow: `classify → recommend → format`. Falls back to a comprehensive rule engine when no LLM API key is set.

**Example:**
> Person detected on track → Risk: Critical → Actions: Stop Train 12045, Notify nearest station, Activate platform announcement, Alert RPF, Dispatch emergency unit

**Tech:** LangGraph, LangChain, OpenAI (optional), rule-based fallback

#### Usage

```bash
# Without LLM (rule-based fallback — works immediately)
uvicorn modules.emergency_agent.app:app --host 0.0.0.0 --port 8002

# With LLM (set API key in .env)
export OPENAI_API_KEY=sk-...
uvicorn modules.emergency_agent.app:app --host 0.0.0.0 --port 8002

# Assess an incident
curl -X POST http://localhost:8002/emergency/assess \
  -H "Content-Type: application/json" \
  -d '{"incident_type":"fire_hazard","location":"Platform 3, Dadar","severity":"critical","risk_score":92}'
```

### 4. Unified Backend API *(built)*

A FastAPI backend that integrates all modules, exposes REST and WebSocket endpoints, and connects to PostgreSQL for persistent storage.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/dashboard/summary` | Aggregated stats (trains, alerts, avg risk) |
| `GET` | `/api/dashboard/map` | Trains, stations, risk zones |
| `GET` | `/api/trains` | List all trains |
| `GET` | `/api/alerts` | List alerts |
| `POST` | `/risk/predict` | Risk prediction |
| `POST` | `/emergency/assess` | Emergency assessment |
| `WS` | `/ws` | Real-time event stream |

**Tech:** FastAPI, SQLAlchemy 2.0, PostgreSQL, Redis, WebSockets

#### Usage

```bash
# Install backend dependencies
pip install -r backend/requirements.txt

# Run with local database
python backend/seed.py    # Creates tables and seeds demo data
uvicorn backend.main:app --reload
# Opens at http://localhost:8000

# Run with Docker Compose (includes Redis)
docker compose up
```

### 5. Interactive Railway Command Dashboard *(built)*

A real-time control room dashboard with multi-page navigation, live map, CCTV viewer, alerts, emergency recommendations, and AI chat assistant.

**Pages:**

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Home** | Railway overview with stats cards, system status, feature links, and news updates |
| `/dashboard` | **Command Center** | Full operational dashboard with live map, CCTV, alerts, emergency recs, AI assistant |
| `/map` | **Live Map** | Full-screen interactive Leaflet map with trains, stations, and risk zones |
| `/alerts` | **Alerts & Incidents** | Active alerts and emergency recommendations side by side |
| `/cctv` | **Surveillance** | Dedicated CCTV feed viewer with camera switching |
| `/assistant` | **AI Assistant** | Conversational AI interface for railway queries |

**Components:**

| Component | Description |
|-----------|-------------|
| **Sidebar** | Collapsible navigation panel with feature links and active route highlighting |
| **Live Network Map** | Leaflet map with train positions (color-coded: on-time/delayed/critical), stations (crowd density), and risk zone circles |
| **CCTV Feed Viewer** | Simulated multi-camera feed with auto-rotate and thumbnail navigation |
| **Risk Alert Panel** | Scrollable list of active alerts with severity badges, icons, and relative timestamps |
| **Emergency Recommendations** | Collapsible cards with step-by-step actions, priorities, and assigned stakeholders |
| **AI Chat Assistant** | Conversational interface answering queries about delays, risks, emergencies, and trains |
| **Dashboard Header** | Top bar with title, system status indicator, and live clock |

**Tech:** Next.js 16, TypeScript, Tailwind CSS 4, Leaflet, Lucide Icons

#### Usage

```bash
cd dashboard
npm install
npm run dev
# Opens at http://localhost:3000
```

### 6. Delay Propagation Intelligence *(planned)*

Predict how a single delayed train cascades across the network.

**Model:** XGBoost over temporal graph data

### 7. Railway Digital Twin *(planned)*

Interactive map dashboard showing trains, stations, incidents, alerts, and delays in real time.

**Tech:** Next.js, React, Tailwind, WebSockets

### 8. AI Agent Layer *(planned)*

Conversational agent that operators can query:

> *"Why is Train 12045 delayed?"*
> → "Delay caused by signal congestion near Nashik. Estimated recovery: 18 minutes."

**Tech:** LangGraph, RAG (FAISS), LLM

---

## AI Stack

| Component | Technology |
|-----------|------------|
| Vision Detection | YOLOv8 (Ultralytics) |
| Object Tracking | ByteTrack |
| Risk Prediction | XGBoost |
| Agent Framework | LangGraph + LangChain |
| LLM (optional) | OpenAI (GPT-4o-mini) |
| Rule Engine | Built-in fallback (7 incident types) |
| Backend | FastAPI + SQLAlchemy |
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Maps | Leaflet |
| Icons | Lucide React |
| Database | PostgreSQL (via psycopg2) |
| Realtime | WebSockets + Redis |
| Deployment | Docker Compose |

---

## Project Structure

```
rail-mind/
├── data/                          # Sample images and videos
├── models/                        # Trained model files
├── backend/                       # Unified FastAPI backend
│   ├── db/
│   │   ├── database.py            # SQLAlchemy engine & session
│   │   ├── models.py              # ORM models (Train, Station, Alert, etc.)
│   │   └── schema.sql             # PostgreSQL DDL
│   ├── routers/
│   │   ├── dashboard.py           # Dashboard summary & map endpoints
│   │   ├── trains.py              # Train listing endpoint
│   │   └── alerts.py              # Alerts endpoint
│   ├── ws/
│   │   ├── manager.py             # WebSocket connection manager
│   │   └── redis_client.py        # Redis pub/sub client
│   ├── main.py                    # FastAPI app entry point
│   ├── seed.py                    # Database seeder
│   └── requirements.txt
├── dashboard/                     # Interactive Command Center (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Root layout with sidebar
│   │   │   ├── page.tsx           # Home page (overview + news)
│   │   │   ├── dashboard/page.tsx # Command Center (full dashboard)
│   │   │   ├── map/page.tsx       # Live map page
│   │   │   ├── alerts/page.tsx    # Alerts & incidents page
│   │   │   ├── cctv/page.tsx      # CCTV surveillance page
│   │   │   └── assistant/page.tsx # AI assistant page
│   │   ├── components/
│   │   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── MapView.tsx        # Leaflet map with trains/stations/risk zones
│   │   │   ├── CctvFeed.tsx       # Multi-camera feed viewer
│   │   │   ├── RiskAlertPanel.tsx # Active alerts list
│   │   │   ├── EmergencyRecommendations.tsx
│   │   │   └── AiChatAssistant.tsx
│   │   └── lib/
│   │       ├── types.ts           # TypeScript interfaces
│   │       ├── mockData.ts        # Demo data
│   │       └── api.ts             # API client
│   ├── package.json
│   └── next.config.ts
├── modules/
│   ├── detection/                 # Human/Obstacle Detection (YOLOv8 + ByteTrack)
│   │   ├── config.py
│   │   ├── detector.py
│   │   ├── tracker.py
│   │   ├── alert.py
│   │   ├── pipeline.py
│   │   └── cli.py
│   ├── risk_prediction/           # Incident Risk Prediction (XGBoost + FastAPI)
│   │   ├── config.py
│   │   ├── data_generator.py
│   │   ├── train.py
│   │   ├── model.py
│   │   ├── schemas.py
│   │   ├── router.py
│   │   └── app.py
│   └── emergency_agent/           # Emergency Recommendation Agent (LangGraph)
│       ├── config.py
│       ├── schemas.py
│       ├── nodes.py
│       ├── graph.py
│       ├── router.py
│       └── app.py
├── run_detection.py
├── requirements.txt               # ML module dependencies
├── docker-compose.yml             # Redis + Backend + Dashboard
├── Dockerfile                     # Backend container
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

## Database

RailMind uses **PostgreSQL** with **SQLAlchemy 2.0** ORM. By default, it connects to a local `postgres:16-alpine` container defined in `docker-compose.yml`.

### Using Supabase (Cloud PostgreSQL)

RailMind is fully compatible with Supabase (managed PostgreSQL). To switch:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your connection URI from Project Settings → Database
3. Set it in `.env`:

```
DATABASE_URL=postgresql+psycopg2://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?sslmode=require
```

4. Run with Docker (Redis only):
```bash
docker compose up
# or without Docker:
python backend/seed.py && uvicorn backend.main:app --reload
```

### Tables

| Table | Description |
|-------|-------------|
| `trains` | Live train positions, speed, status, delay |
| `stations` | Station metadata |
| `sections` | Track sections with location and radius |
| `alerts` | Detected incidents with severity, type, location |
| `incidents` | Escalated alerts with action plans and stakeholders |
| `risk_logs` | Historical risk predictions with factors |
| `crowd_logs` | Crowd density measurements |

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | No | `postgresql+psycopg2://railmind:railmind@localhost:5432/railmind` | PostgreSQL connection string |
| `OPENAI_API_KEY` | No | — | API key for LLM-powered emergency recommendations. Without it, a rule-based fallback is used. |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI model name. |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 22+
- npm
- Docker & Docker Compose (optional, for containerized setup)

### Quick Start (Full Stack)

```bash
# 1. Clone the repo
git clone https://github.com/rohankharche34/rail-mind.git
cd rail-mind

# 2. Backend setup
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings (DATABASE_URL, OPENAI_API_KEY, etc.)

# 4. Seed the database and start the backend
python backend/seed.py
uvicorn backend.main:app --reload
# API at http://localhost:8000

# 5. Frontend setup (separate terminal)
cd dashboard
npm install
npm run dev
# Dashboard at http://localhost:3000
```

### Docker Setup

```bash
docker compose up
# Backend at http://localhost:8000
# Dashboard at http://localhost:3000
```

### Run Individual Modules

```bash
# Detection module
python3 run_detection.py 0 --track

# Risk prediction API
uvicorn modules.risk_prediction.app:app --host 0.0.0.0 --port 8001

# Emergency agent API
uvicorn modules.emergency_agent.app:app --host 0.0.0.0 --port 8002
```

---

## What Makes RailMind Stand Out

Most teams: **Detect object → Send alert**

RailMind: **Detect → Predict → Recommend → Simulate → Assist**

A complete intelligence platform, not just a detection system.

---

## License

MIT
