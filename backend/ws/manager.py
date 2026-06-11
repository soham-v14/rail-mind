import json
import asyncio
from typing import Set
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self._connections: Set[WebSocket] = set()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self._connections.add(ws)

    def disconnect(self, ws: WebSocket):
        self._connections.discard(ws)

    async def broadcast(self, event_type: str, data: dict):
        message = json.dumps({"type": event_type, "data": data})
        stale = set()
        for ws in self._connections:
            try:
                await ws.send_text(message)
            except Exception:
                stale.add(ws)
        self._connections -= stale

    @property
    def count(self) -> int:
        return len(self._connections)


manager = ConnectionManager()
