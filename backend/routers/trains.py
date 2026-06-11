from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db.models import Train
from backend.ws.manager import manager

router = APIRouter(prefix="/api/trains", tags=["trains"])


@router.get("")
def list_trains(db: Session = Depends(get_db)):
    trains = db.query(Train).order_by(Train.id).all()
    return [
        {
            "id": t.id,
            "name": t.name,
            "lat": t.lat,
            "lng": t.lng,
            "speed": t.speed,
            "status": t.status,
            "delay_minutes": t.delay_minutes,
            "updated_at": t.updated_at.isoformat() if t.updated_at else None,
        }
        for t in trains
    ]


@router.get("/{train_id}")
def get_train(train_id: str, db: Session = Depends(get_db)):
    t = db.query(Train).filter(Train.id == train_id).first()
    if not t:
        return {"error": "Train not found"}
    return {
        "id": t.id,
        "name": t.name,
        "lat": t.lat,
        "lng": t.lng,
        "speed": t.speed,
        "status": t.status,
        "delay_minutes": t.delay_minutes,
        "updated_at": t.updated_at.isoformat() if t.updated_at else None,
    }
