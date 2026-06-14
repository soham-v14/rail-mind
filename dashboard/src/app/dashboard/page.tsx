"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import CctvFeed from "@/components/CctvFeed";
import StatCards from "@/components/StatCards";
import RailwayDigitalTwin from "@/components/RailwayDigitalTwin";
import RiskAlertPanel from "@/components/RiskAlertPanel";
import AgentReasoningPanel from "@/components/AgentReasoningPanel";
import { fetchDashboardSummary, fetchDashboardMap, fetchAlerts } from "@/lib/api";
import type { StatCardData } from "@/components/StatCards";

const CCTV_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAa7WxaCGu2PZhONsuwVXuGOl5ZTXyP5OU_tVZXhLcBkrluslEtJc4b4QblXuoHH4JlEX6lI1xViypAAL-aXsSAsMOn9rdBFo3wnT-1p1B52Yx-4CSpPR10Z2fke9BMNS_Eh692meMon_fxVttlPamUsveDVwgeJJ4rZR2Xh3mVwbxV1nbBzQSUPsm-kLF84rBuz5oeND-s6Fj0IM-WL1GWT_ZfWKr8gDlPpVg3TrwKkc6uYcDyRY-KaFsRLzi8jVM4WfZnq77McpeY";

const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB6_WtLj587D05SodQV80XMUqT-J96XxraIbHjMm4RnrMKMBf5CxBUFPcnAx9d-rzaQ7ARhA6Z3aKE_IYJrFfEDWhPidAZ9t26GiXW2eo_W6h-AA6GjErc61ITtmLZGtPYup9lwdRxXJKhAzC9U7sPcFuW5Vn7YNaDw9XO1AooLC7AHK4N90galKZ7alwewbMlaDtaenR7lP1Y-9yNf-HB2S1Qq8udy3F1lhq5IYDX1slbBUQH2wxBU2OKI-ajxQVsxhMKNVNgKmccD";

const OPERATOR_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCTb99MuGg8VlTemZS2wYkmbOS429m98p22LH4p2iZsJKy3d6yhkRBA8cMOz1ziy0aZa1t_uDDj_-jUjm_kBHhvRqWankoQ4Oq-VOVQGSdjvrMtp495bI6ZeI_eRBgHvbihcqxRv0WxGtb88xxDmkR-Af_T3mSa2dy1PS9pP_MsgugGyHpoKizDpOQeraQOF9Y_DKPw5GfMcsO9ZX9viOCisMUKwcjN_XYWqfkpevFAPtBJQUUGONVnTh60G1Rs_TMpNjUuefUieXDI";

export default function Dashboard() {
  const [stats, setStats] = useState<StatCardData[]>([
    { id: "detections", label: "TOTAL DETECTIONS", value: "124", accent: "primary" as const, trend: { direction: "up" as const, value: "12%" } },
    { id: "risk", label: "RISK SCORE", value: "LOW", accent: "green" as const },
    { id: "delay", label: "DELAY PROPAGATION", value: "+12m", accent: "orange" as const, subtext: "at Sector 7" },
  ]);

  const [mapTrains, setMapTrains] = useState([
    { id: "t1", label: "T-402", positionClass: "top-[30%] left-[40%]", status: "normal" as const },
    { id: "t2", label: "T-119", positionClass: "top-[60%] left-[35%]", status: "normal" as const },
    { id: "t3", label: "T-882 (Delayed)", positionClass: "top-[45%] left-[55%]", status: "delayed" as const },
    { id: "t4", label: "T-991 (CRITICAL)", positionClass: "top-[70%] left-[65%]", status: "critical" as const, size: "lg" as const },
  ]);

  const [alerts, setAlerts] = useState([
    { id: "a1", severity: "critical" as const, title: "CRITICAL: Obstruction Detected", timestamp: "14:05:12", description: "Unidentified object on Track 4, Sector B. Train T-991 approaching.", actions: [{ id: "halt", label: "HALT T-991", variant: "primary" as const }, { id: "cam", label: "VIEW CAM", variant: "secondary" as const }] },
    { id: "a2", severity: "high" as const, title: "HIGH: Signal Degradation", timestamp: "13:58:44", description: "Telemetry packet loss > 15% on Node 42." },
    { id: "a3", severity: "medium" as const, title: "MED: Passenger Flow Congestion", timestamp: "13:45:01", description: "Platform 2 exceeding capacity threshold." },
  ]);

  const [agentSteps] = useState([
    { id: "s1", title: "Analyzing traffic pattern", timestamp: "14:02", description: "Ingesting multi-modal sensor data from Sector B." },
    { id: "s2", title: "Identifying potential delay", timestamp: "14:03", description: "Correlated obstruction alert with T-991 trajectory." },
    { id: "s3", title: "Retrieving historical context", timestamp: "14:04", description: "RAG RETRIEVAL: Found 3 similar incidents (2021, 2022).", variant: "rag" as const },
    { id: "s4", title: "Proposing reroute", timestamp: "14:05", description: "", variant: "proposal" as const, proposal: { text: "Recommendation: Divert T-991 to Track 5 via Switch 12A.", actionLabel: "EXECUTE REROUTE" } },
  ]);

  useEffect(() => {
    fetchDashboardSummary()
      .then((data) => {
        if (data) {
          setStats([
            { id: "detections", label: "TOTAL TRAINS", value: String(data.total_trains ?? "—"), accent: "primary" as const },
            { id: "risk", label: "AVG RISK SCORE", value: String(data.average_risk_score ?? "—"), accent: "green" as const, subtext: data.active_alerts ? `${data.active_alerts} alerts` : undefined },
            { id: "delay", label: "DELAYED TRAINS", value: String(data.delayed_trains ?? "—"), accent: "orange" as const, subtext: data.critical_alerts ? `${data.critical_alerts} critical` : undefined },
          ]);
        }
      })
      .catch(() => {});

    fetchDashboardMap().then((data) => {
      if (data?.trains?.length) {
        setMapTrains(data.trains.slice(0, 6).map((t: any, i: number) => ({
          id: t.id,
          label: `${t.name}${t.status !== "on_time" ? ` (${t.status.toUpperCase()})` : ""}`,
          positionClass: `top-[${20 + i * 12}%] left-[${30 + i * 8}%]`,
          status: t.status === "critical" ? "critical" as const : t.status === "delayed" ? "delayed" as const : "normal" as const,
          ...(t.status === "critical" ? { size: "lg" as const } : {}),
        })));
      }
      if (data?.alert_summary) {
      }
    }).catch(() => {});

    fetchAlerts().then((data) => {
      if (data?.length) {
        setAlerts(data.slice(0, 6).map((a: any) => ({
          id: a.id,
          severity: (a.severity === "critical" || a.severity === "high" || a.severity === "medium" || a.severity === "low" ? a.severity : "medium") as "critical" | "high" | "medium" | "low",
          title: `${a.severity?.toUpperCase() || "ALERT"}: ${a.incident_type?.replace(/_/g, " ") || "Incident"}`,
          timestamp: a.created_at ? new Date(a.created_at).toLocaleTimeString() : "—",
          description: a.description || `${a.incident_type} at ${a.location}`,
          ...(a.severity === "critical" ? { actions: [{ id: "view", label: "VIEW", variant: "primary" as const }, { id: "dismiss", label: "DISMISS", variant: "secondary" as const }] } : {}),
        })));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="relative flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden bg-[#0A0F1E]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A0F1E]/80 to-[#0A0F1E]/95" />

      <DashboardHeader
        title="RailMind Control Center"
        phaseLabel="PHASE 3 LIVE"
        phaseLive
        notificationCount={14}
        operatorAvatarUrl={OPERATOR_AVATAR}
        operatorName="Operator"
      />

      <div className="relative z-10 flex min-h-0 w-full max-w-full flex-1 flex-col gap-3 overflow-y-auto p-3 xl:grid xl:grid-cols-[minmax(0,7fr)_minmax(0,8fr)_minmax(0,5fr)]">
        {/* LEFT: CCTV + Stats */}
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <CctvFeed
            cameras={[
              { id: "cam1", label: "CAM 1", name: "CAM 1 - Mumbai Central", imageUrl: CCTV_IMAGE },
              { id: "cam2", label: "CAM 2", name: "CAM 2 - Dadar", imageUrl: CCTV_IMAGE },
              { id: "cam3", label: "CAM 3", name: "CAM 3 - Thane", imageUrl: CCTV_IMAGE },
              { id: "cam4", label: "CAM 4", name: "CAM 4 - Kalyan", imageUrl: CCTV_IMAGE },
            ]}
            activeCameraId="cam1"
            detectionCount={8}
            resolution="1080p 60fps"
            boundingBoxes={[
              { id: "b1", positionClass: "top-[40%] left-[30%] w-16 h-24", variant: "error" },
              { id: "b2", positionClass: "top-[45%] left-[60%] w-12 h-20", variant: "primary" },
              { id: "b3", positionClass: "top-[60%] left-[20%] w-20 h-10", variant: "error", label: "DEFECT: Crack (98%)" },
            ]}
          />

          <StatCards stats={stats} classNameOverride="h-auto" />
        </div>

        {/* CENTER: Map + Alerts */}
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <RailwayDigitalTwin
            mapImageUrl={MAP_IMAGE}
            activeLayer="risk"
            trains={mapTrains}
          />

          <RiskAlertPanel alerts={alerts} />
        </div>

        {/* RIGHT: Agent Reasoning */}
        <div className="min-h-0 min-w-0">
          <AgentReasoningPanel
            status="idle"
            steps={agentSteps}
            recommendedActions={[
              { id: "lockdown", label: "Station Lockdown", icon: "lock", hoverAccent: "error" },
              { id: "power", label: "Power Reset (Sec B)", icon: "power", hoverAccent: "orange" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
