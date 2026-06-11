"""Seed the database with demo data for the RailMind platform."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db.database import engine, SessionLocal, Base
from backend.db.models import Train, Station, Section, Alert, Incident


def seed():
    Base.metadata.create_all(engine)
    db = SessionLocal()

    if db.query(Train).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    trains = [
        Train(id="12045", name="Mumbai-Pune Intercity", lat=19.076, lng=72.877, speed=85, status="delayed", delay_minutes=12),
        Train(id="12123", name="Deccan Queen", lat=18.975, lng=73.072, speed=92, status="on_time", delay_minutes=0),
        Train(id="11027", name="Chennai Express", lat=19.124, lng=72.851, speed=65, status="on_time", delay_minutes=0),
        Train(id="16346", name="Netravati Express", lat=19.210, lng=72.825, speed=45, status="critical", delay_minutes=28),
        Train(id="22105", name="Indrayani Express", lat=18.890, lng=73.115, speed=110, status="on_time", delay_minutes=0),
    ]
    db.add_all(trains)

    stations = [
        Station(id="S1", name="Chhatrapati Shivaji Maharaj Terminus", lat=18.940, lng=72.835),
        Station(id="S2", name="Dadar", lat=19.018, lng=72.844),
        Station(id="S3", name="Kalyan", lat=19.235, lng=73.129),
        Station(id="S4", name="Thane", lat=19.218, lng=72.978),
        Station(id="S5", name="Nashik Road", lat=19.959, lng=73.825),
    ]
    db.add_all(stations)

    sections = [
        Section(id="A12", name="Section A12", lat=19.080, lng=72.880, radius=1200),
        Section(id="B7", name="Section B7", lat=19.150, lng=72.900, radius=800),
        Section(id="C4", name="Section C4", lat=18.960, lng=72.860, radius=1000),
    ]
    db.add_all(sections)

    alert1 = Alert(
        id="A1", incident_type="human_intrusion",
        location="Section A12, km 45", severity="critical",
        description="Person detected walking on tracks",
        risk_score=85,
    )
    alert2 = Alert(
        id="A2", incident_type="fire_hazard",
        location="Platform 3, Dadar", severity="critical",
        description="Sparks detected near electrical panel",
        risk_score=92,
    )
    db.add_all([alert1, alert2])
    db.flush()

    incidents = [
        Incident(
            id="INC-001", alert_id="A1", category="Human Intrusion",
            escalation_level="critical",
            summary="Person detected walking on track at Section A12. Immediate action required.",
            actions=[
                {"step": 1, "action": "Stop all trains approaching the affected section", "priority": "immediate", "assigned_to": "Train Controller"},
                {"step": 2, "action": "Notify nearest station master", "priority": "immediate", "assigned_to": "Station Master"},
                {"step": 3, "action": "Alert Railway Protection Force", "priority": "short_term", "assigned_to": "RPF"},
            ],
            stakeholders=[
                {"name": "Station Master", "role": "Coordination", "contact": "Control Room"},
                {"name": "RPF", "role": "Security", "contact": "RPF Control"},
            ],
        ),
        Incident(
            id="INC-002", alert_id="A2", category="Fire Hazard",
            escalation_level="critical",
            summary="Sparks and smoke detected near electrical panel at Dadar Platform 3.",
            actions=[
                {"step": 1, "action": "Stop all trains in the affected zone", "priority": "immediate", "assigned_to": "Train Controller"},
                {"step": 2, "action": "Notify fire department", "priority": "immediate", "assigned_to": "Fire Dept"},
                {"step": 3, "action": "Evacuate nearby platforms", "priority": "short_term", "assigned_to": "Station Staff"},
            ],
            stakeholders=[
                {"name": "Fire Department", "role": "Fire suppression", "contact": "Emergency 101"},
                {"name": "Station Master", "role": "Evacuation", "contact": "Control Room"},
            ],
        ),
    ]
    db.add_all(incidents)
    db.commit()
    db.close()
    print("Database seeded successfully with demo data.")


if __name__ == "__main__":
    seed()
