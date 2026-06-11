# RailMind

**AI-Powered Railway Safety, Monitoring & Decision Intelligence Platform**

> *"Predicting incidents before they happen and helping operators respond in real time."*

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

### 1. Human / Obstacle Detection on Tracks ✅ *(built)*

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

### 2. Incident Risk Prediction *(planned)*

Predict incident likelihood using historical and real-time data.

**Inputs:** Weather, train speed, track conditions, maintenance history, crowd density
**Output:** Section risk score, contributing factors, inspection recommendation
**Model:** XGBoost / LightGBM

### 3. Emergency Recommendation Agent *(planned)*

When an incident is detected, an LLM agent generates structured response actions.

**Example:**
> Person detected on track → Risk: Critical → Actions: Stop Train 12045, Notify nearest station, Activate platform announcement, Alert RPF, Dispatch emergency unit

**Tech:** LangGraph, LangChain, Gemini/OpenAI

### 4. Delay Propagation Intelligence *(planned)*

Predict how a single delayed train cascades across the network.

**Model:** XGBoost over temporal graph data

### 5. Railway Digital Twin *(planned)*

Interactive map dashboard showing trains, stations, incidents, alerts, and delays in real time.

**Tech:** Next.js, React, Tailwind, WebSockets

### 6. AI Agent Layer *(planned)*

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
| Risk Prediction | XGBoost / LightGBM |
| Agent Framework | LangGraph |
| RAG | FAISS |
| Backend | FastAPI |
| Database | PostgreSQL |
| Realtime | WebSockets + Redis |
| Frontend | Next.js + React + Tailwind |
| Deployment | Docker |

---

## Project Structure

```
rail-mind/
├── modules/
│   ├── __init__.py
│   └── detection/
│       ├── __init__.py
│       ├── config.py         # Model config, class mappings, categories
│       ├── detector.py       # YOLOv8 detection wrapper
│       ├── tracker.py        # ByteTrack tracking wrapper
│       ├── alert.py          # Alert engine (classification, dedup, viz)
│       ├── pipeline.py       # Full detection → tracking → alert pipeline
│       └── cli.py            # CLI entry point
├── run_detection.py          # Top-level entry point
├── requirements.txt
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- pip

### Install

```bash
git clone https://github.com/rohankharche34/rail-mind.git
cd rail-mind
pip install -r requirements.txt
```

### Run Detection

```bash
# Webcam
python3 run_detection.py 0 --track

# Video file
python3 run_detection.py path/to/video.mp4 --track --output result.mp4

# Image
python3 run_detection.py path/to/image.jpg
```

---

## What Makes RailMind Stand Out

Most teams: **Detect object → Send alert**

RailMind: **Detect → Predict → Recommend → Simulate → Assist**

A complete intelligence platform, not just a detection system.

---

## License

MIT
