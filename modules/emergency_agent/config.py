import os
from datetime import datetime, timezone

INCIDENT_CATEGORIES = {
    "human_intrusion": {
        "label": "Human Intrusion",
        "escalation": "critical",
    },
    "unattended_object": {
        "label": "Unattended Object",
        "escalation": "high",
    },
    "track_obstacle": {
        "label": "Track Obstacle",
        "escalation": "critical",
    },
    "animal": {
        "label": "Animal on Tracks",
        "escalation": "high",
    },
    "fire_hazard": {
        "label": "Fire Hazard",
        "escalation": "critical",
    },
    "fall_detected": {
        "label": "Fall Detected",
        "escalation": "critical",
    },
    "smoke_fire": {
        "label": "Smoke / Fire",
        "escalation": "critical",
    },
}

FALLBACK_ACTIONS = {
    "human_intrusion": [
        "Stop all trains approaching the affected section",
        "Notify nearest station master",
        "Activate platform announcement system",
        "Alert Railway Protection Force (RPF)",
        "Dispatch emergency response unit to location",
        "Initiate trespasser removal protocol",
    ],
    "unattended_object": [
        "Secure the area around the object",
        "Notify station security control room",
        "Dispatch bomb disposal / sniffer dog unit",
        "Evacuate nearby passengers",
        "Hold trains at platform until clearance",
        "Review CCTV footage for owner identification",
    ],
    "track_obstacle": [
        "Stop all trains on the affected track",
        "Divert trains to adjacent track if available",
        "Notify track maintenance team",
        "Dispatch inspection crew to location",
        "Issue alert to all approaching train drivers",
        "Initiate track clearance protocol",
    ],
    "animal": [
        "Reduce speed of trains in the area",
        "Activate animal deterrent system (if available)",
        "Notify forest / wildlife department",
        "Alert train drivers to proceed with caution",
        "Dispatch track patrol for verification",
    ],
    "fire_hazard": [
        "Stop all trains in the affected zone",
        "Activate fire suppression system",
        "Notify fire department immediately",
        "Evacuate nearby structures and platforms",
        "Cut off power supply to the section",
        "Dispatch emergency response team",
    ],
    "fall_detected": [
        "Stop trains approaching the platform / track",
        "Notify station medical team",
        "Activate emergency medical services (EMS)",
        "Dispatch first responders to location",
        "Secure the area for medical access",
        "Alert hospital trauma unit",
    ],
    "smoke_fire": [
        "Stop all trains in the affected zone",
        "Activate fire suppression system",
        "Notify fire department immediately",
        "Evacuate nearby structures and platforms",
        "Cut off power supply to the section",
        "Dispatch emergency response team",
    ],
}

FALLBACK_STAKEHOLDERS = {
    "human_intrusion": [
        {"name": "Station Master", "role": "On-site coordination", "contact": "Control Room"},
        {"name": "RPF", "role": "Security & law enforcement", "contact": "RPF Control"},
        {"name": "Train Controller", "role": "Traffic management", "contact": "OCC"},
        {"name": "Emergency Response Team", "role": "On-ground response", "contact": "Dispatch"},
    ],
    "unattended_object": [
        {"name": "Station Security", "role": "Area security", "contact": "Security Room"},
        {"name": "RPF", "role": "Investigation", "contact": "RPF Control"},
        {"name": "Bomb Disposal Squad", "role": "Object inspection", "contact": "Emergency"},
        {"name": "Station Master", "role": "Passenger management", "contact": "Control Room"},
    ],
    "track_obstacle": [
        {"name": "Train Controller", "role": "Traffic diversion", "contact": "OCC"},
        {"name": "Track Maintenance", "role": "Inspection & clearance", "contact": "Workshop"},
        {"name": "Locomotive Pilot", "role": "Alert all drivers", "contact": "Radio"},
        {"name": "Station Master", "role": "Passenger announcements", "contact": "Control Room"},
    ],
    "animal": [
        {"name": "Train Controller", "role": "Speed regulation", "contact": "OCC"},
        {"name": "Forest / Wildlife Dept", "role": "Animal removal", "contact": "Forest Office"},
        {"name": "Track Patrol", "role": "Ground verification", "contact": "Patrol Base"},
    ],
    "fire_hazard": [
        {"name": "Fire Department", "role": "Fire suppression", "contact": "Emergency 101"},
        {"name": "Train Controller", "role": "Stop traffic", "contact": "OCC"},
        {"name": "Station Master", "role": "Evacuation", "contact": "Control Room"},
        {"name": "Power Control", "role": "Cut power supply", "contact": "Power House"},
        {"name": "Emergency Medical Services", "role": "Medical standby", "contact": "EMS"},
    ],
    "fall_detected": [
        {"name": "Station Medical Team", "role": "First aid", "contact": "Medical Room"},
        {"name": "EMS", "role": "Ambulance dispatch", "contact": "Emergency 108"},
        {"name": "Station Master", "role": "Coordination", "contact": "Control Room"},
        {"name": "Train Controller", "role": "Stop approaching trains", "contact": "OCC"},
    ],
    "smoke_fire": [
        {"name": "Fire Department", "role": "Fire suppression", "contact": "Emergency 101"},
        {"name": "Train Controller", "role": "Stop traffic", "contact": "OCC"},
        {"name": "Station Master", "role": "Evacuation", "contact": "Control Room"},
        {"name": "Power Control", "role": "Cut power supply", "contact": "Power House"},
        {"name": "Emergency Medical Services", "role": "Medical standby", "contact": "EMS"},
    ],
}

OPENAI_MODEL = os.environ.get("RAILMIND_LLM_MODEL", "gpt-4o-mini")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

GEMINI_MODEL = os.environ.get("RAILMIND_GEMINI_MODEL", "gemini-2.0-flash")
GEMINI_API_KEY = os.environ.get("GOOGLE_API_KEY", "")

SYSTEM_PROMPT = """You are RailMind's Emergency Response Coordinator — an AI assistant for railway incident management.

Given an incident report, output a structured JSON response with:
1. **category**: One word classification (HumanIntrusion, UnattendedObject, TrackObstacle, Animal, FireHazard, FallDetected, SmokeFire)
2. **escalation_level**: (critical, high, medium, low)
3. **summary**: One sentence description of the situation
4. **actions**: Array of ordered action items, each with step number, action text, priority (immediate/short_term/ongoing), and assigned_to
5. **stakeholders**: Array of people/teams to notify, each with name, role, contact

Be concise, specific to railways, and prioritize safety. Use Indian railway terminology where appropriate."""
