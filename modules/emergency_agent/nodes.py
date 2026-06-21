import json
from datetime import datetime, timezone
from typing import TypedDict, Optional

from .config import (
    INCIDENT_CATEGORIES, FALLBACK_ACTIONS, FALLBACK_STAKEHOLDERS,
    OPENAI_API_KEY, OPENAI_MODEL, SYSTEM_PROMPT,
    GEMINI_API_KEY, GEMINI_MODEL,
)
from .schemas import ActionItem, Stakeholder


class AgentState(TypedDict):
    incident_id: str
    incident_type: str
    location: str
    severity: str
    timestamp: str
    description: str
    detected_objects: list[dict]
    risk_score: Optional[float]

    category: str
    escalation_level: str
    summary: str
    actions: list[dict]
    stakeholders: list[dict]
    use_llm: bool


def classify_node(state: AgentState) -> dict:
    incident_type = state["incident_type"]
    cat_info = INCIDENT_CATEGORIES.get(incident_type, {
        "label": "Unknown Incident",
        "escalation": "medium",
    })

    escalation = cat_info["escalation"]
    severity = state.get("severity", "medium")
    if severity == "critical":
        escalation = "critical"
    elif severity == "low" and escalation != "critical":
        escalation = "medium"

    return {
        "category": cat_info["label"],
        "escalation_level": escalation,
    }


def recommend_node(state: AgentState) -> dict:
    incident_type = state["incident_type"]
    escalation = state["escalation_level"]
    location = state["location"]

    if not state.get("use_llm"):
        return _fallback_recommend(incident_type, escalation, location)

    if GEMINI_API_KEY:
        return _gemini_recommend(state)
    if OPENAI_API_KEY:
        return _llm_recommend(state)
    return _fallback_recommend(incident_type, escalation, location)


def _format_node(state: AgentState) -> dict:
    now = state.get("timestamp") or datetime.now(timezone.utc).isoformat()
    summary = (
        f"{state['category']} detected at {state['location']}. "
        f"Severity: {state['severity'].upper()}. "
        f"Escalation: {state['escalation_level'].upper()}."
    )
    if state.get("description"):
        summary = f"{summary} {state['description']}"

    return {"summary": summary}


def _fallback_recommend(incident_type: str, escalation: str, location: str) -> dict:
    actions_raw = FALLBACK_ACTIONS.get(incident_type, FALLBACK_ACTIONS.get("human_intrusion", []))
    stakeholders_raw = FALLBACK_STAKEHOLDERS.get(incident_type, FALLBACK_STAKEHOLDERS.get("human_intrusion", []))

    actions = []
    for i, action_text in enumerate(actions_raw, 1):
        priority = "immediate" if i <= 2 else "short_term" if i <= 4 else "ongoing"
        actions.append({
            "step": i,
            "action": action_text,
            "priority": priority,
            "assigned_to": stakeholders_raw[i % len(stakeholders_raw)]["name"] if stakeholders_raw else None,
        })

    return {
        "actions": actions,
        "stakeholders": stakeholders_raw,
    }


def _llm_recommend(state: AgentState) -> dict:
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import SystemMessage, HumanMessage

    llm = ChatOpenAI(model=OPENAI_MODEL, temperature=0.1)

    incident_context = json.dumps({
        "incident_type": state["incident_type"],
        "location": state["location"],
        "severity": state["severity"],
        "risk_score": state.get("risk_score"),
        "detected_objects": state.get("detected_objects", []),
        "description": state.get("description", ""),
        "category": state.get("category"),
        "escalation_level": state.get("escalation_level"),
    }, indent=2)

    user_message = f"""Incident report:

{incident_context}

Output a JSON object with these keys:
- category (string)
- escalation_level (string: critical/high/medium/low)
- summary (string)
- actions (array of objects with: step, action, priority, assigned_to)
- stakeholders (array of objects with: name, role, contact)"""

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_message),
    ]

    try:
        response = llm.invoke(messages)
        parsed = json.loads(response.content.strip().removeprefix("```json").removesuffix("```").strip())
    except Exception:
        return _fallback_recommend(state["incident_type"], state["escalation_level"], state["location"])

    return {
        "actions": parsed.get("actions", []),
        "stakeholders": parsed.get("stakeholders", []),
        "summary": parsed.get("summary", ""),
        "category": parsed.get("category", state.get("category")),
        "escalation_level": parsed.get("escalation_level", state.get("escalation_level")),
    }


def _gemini_recommend(state: AgentState) -> dict:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.messages import SystemMessage, HumanMessage

    llm = ChatGoogleGenerativeAI(model=GEMINI_MODEL, temperature=0.1)

    incident_context = json.dumps({
        "incident_type": state["incident_type"],
        "location": state["location"],
        "severity": state["severity"],
        "risk_score": state.get("risk_score"),
        "detected_objects": state.get("detected_objects", []),
        "description": state.get("description", ""),
        "category": state.get("category"),
        "escalation_level": state.get("escalation_level"),
    }, indent=2)

    user_message = f"""Incident report:

{incident_context}

Output a JSON object with these keys:
- category (string)
- escalation_level (string: critical/high/medium/low)
- summary (string)
- actions (array of objects with: step, action, priority, assigned_to)
- stakeholders (array of objects with: name, role, contact)"""

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_message),
    ]

    try:
        response = llm.invoke(messages)
        parsed = json.loads(response.content.strip().removeprefix("```json").removesuffix("```").strip())
    except Exception:
        return _fallback_recommend(state["incident_type"], state["escalation_level"], state["location"])

    return {
        "actions": parsed.get("actions", []),
        "stakeholders": parsed.get("stakeholders", []),
        "summary": parsed.get("summary", ""),
        "category": parsed.get("category", state.get("category")),
        "escalation_level": parsed.get("escalation_level", state.get("escalation_level")),
    }
