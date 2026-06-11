from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.db.database import get_db
from backend.db.models import Train, Alert, RiskLog, Station, Section

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_trains = db.query(func.count(Train.id)).scalar() or 0
    delayed = db.query(func.count(Train.id)).filter(Train.status != "on_time").scalar() or 0
    active_alerts = db.query(func.count(Alert.id)).filter(Alert.resolved == False).scalar() or 0
    critical_alerts = (
        db.query(func.count(Alert.id))
        .filter(Alert.resolved == False, Alert.severity == "critical")
        .scalar()
    ) or 0
    avg_risk = (
        db.query(func.avg(RiskLog.risk_score))
        .order_by(RiskLog.created_at.desc())
        .limit(100)
        .scalar()
    ) or 0

    return {
        "total_trains": total_trains,
        "delayed_trains": delayed,
        "active_alerts": active_alerts,
        "critical_alerts": critical_alerts,
        "average_risk_score": round(float(avg_risk), 1),
    }


@router.get("/map")
def map_data(db: Session = Depends(get_db)):
    trains = db.query(Train).all()
    stations = db.query(Station).all()
    sections = db.query(Section).all()

    return {
        "trains": [
            {"id": t.id, "name": t.name, "lat": t.lat, "lng": t.lng,
             "speed": t.speed, "status": t.status, "delay_minutes": t.delay_minutes}
            for t in trains
        ],
        "stations": [
            {"id": s.id, "name": s.name, "lat": s.lat, "lng": s.lng}
            for s in stations
        ],
        "risk_zones": [
            {"id": s.id, "section": s.name, "lat": s.lat, "lng": s.lng, "radius": s.radius}
            for s in sections
        ],
    }
