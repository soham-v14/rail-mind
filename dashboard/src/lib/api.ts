const API_BASE_RISK = process.env.NEXT_PUBLIC_RISK_API || "http://localhost:8001";
const API_BASE_EMERGENCY = process.env.NEXT_PUBLIC_EMERGENCY_API || "http://localhost:8002";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function predictRisk(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_RISK}/risk/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Risk prediction failed");
  return res.json();
}

export async function assessEmergency(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_EMERGENCY}/emergency/assess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Emergency assessment failed");
  return res.json();
}

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE}/api/dashboard/summary`);
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}

export async function fetchDashboardMap() {
  const res = await fetch(`${API_BASE}/api/dashboard/map`);
  if (!res.ok) throw new Error("Failed to fetch dashboard map");
  return res.json();
}

export async function fetchTrains() {
  const res = await fetch(`${API_BASE}/api/trains`);
  if (!res.ok) throw new Error("Failed to fetch trains");
  return res.json();
}

export async function fetchAlerts(resolved = false) {
  const res = await fetch(`${API_BASE}/api/alerts?resolved=${resolved}`);
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

export async function fetchAlert(id: string) {
  const res = await fetch(`${API_BASE}/api/alerts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch alert");
  return res.json();
}
