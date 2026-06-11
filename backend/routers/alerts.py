from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db.models import Alert, Incident
from backend.ws.manager import manager

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


@router.get("")
def list_alerts(resolved: bool = False, db: Session = Depends(get_db)):
    alerts = (
        db.query(Alert)
        .filter(Alert.resolved == resolved)
        .order_by(Alert.created_at.desc())
        .all()
    )
    return [
        {
            "id": a.id,
            "incident_type": a.incident_type,
            "location": a.location,
            "severity": a.severity,
            "description": a.description,
            "detected_objects": a.detected_objects,
            "risk_score": a.risk_score,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in alerts
    ]


@router.get("/{alert_id}")
def get_alert(alert_id: str, db: Session = Depends(get_db)):
    a = db.query(Alert).filter(Alert.id == alert_id).first()
    if not a:
        return {"error": "Alert not found"}
    incidents = [
        {
            "id": i.id,
            "category": i.category,
            "escalation_level": i.escalation_level,
            "summary": i.summary,
            "actions": i.actions,
            "stakeholders": i.stakeholders,
        }
        for i in a.incidents
    ]
    return {
        "id": a.id,
        "incident_type": a.incident_type,
        "location": a.location,
        "severity": a.severity,
        "description": a.description,
        "detected_objects": a.detected_objects,
        "risk_score": a.risk_score,
        "created_at": a.created_at.isoformat() if a.created_at else None,
        "incidents": incidents,
    }
