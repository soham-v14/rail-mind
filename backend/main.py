import os
import sys
from contextlib import asynccontextmanager

# Add project root to path so module imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from backend.db.database import init_db
from backend.db import models  # noqa: F401 — ensure models are registered before init_db
from backend.ws.manager import manager
from backend.routers import trains, alerts, dashboard

# Module routers
from modules.risk_prediction.router import router as risk_router
from modules.emergency_agent.router import router as emergency_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("RailMind backend starting...")
    init_db()
    print("Database tables ready.")
    yield
    print("RailMind backend shutting down...")


app = FastAPI(
    title="RailMind — Unified Backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Internal API routers
app.include_router(trains.router)
app.include_router(alerts.router)
app.include_router(dashboard.router)

# Module routers
app.include_router(risk_router)
app.include_router(emergency_router)


@app.get("/")
def root():
    return {
        "service": "RailMind Unified Backend",
        "version": "1.0.0",
        "endpoints": {
            "GET  /": "This page",
            "GET  /api/dashboard/summary": "Dashboard summary stats",
            "GET  /api/dashboard/map": "Map data (trains, stations, risk zones)",
            "GET  /api/trains": "List all trains",
            "GET  /api/alerts": "List alerts",
            "POST /risk/predict": "Risk prediction",
            "POST /emergency/assess": "Emergency assessment",
            "WS   /ws": "Real-time event stream",
        },
    }


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
