"use client";

import { useEffect, useMemo, useState } from "react";
import AlertCard from "@/components/AlertCard";
import IntelligenceLogPanel from "@/components/IntelligenceLog";
import { formatIstDateTime } from "@/lib/formatIst";
import { fetchAlerts } from "@/lib/api";
import { mockIncidents, intelligenceLogs, suggestedAction, streamIntelligenceLogs } from "@/lib/mockData";
import type { Alert, AlertFilter } from "@/lib/types";

const filters: { id: AlertFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
];

function toAlertSeverity(s: string): Alert["severity"] {
  if (s === "critical" || s === "high" || s === "medium" || s === "low") return s;
  return "medium";
}

function toAlertStatus(s: string): Alert["status"] {
  if (s === "active" || s === "investigating" || s === "resolved") return s;
  return "active";
}

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState<AlertFilter>("all");
  const [incidents, setIncidents] = useState<Alert[]>(mockIncidents);
  const [liveClock, setLiveClock] = useState(formatIstDateTime());
  const [showIntelligence, setShowIntelligence] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLiveClock(formatIstDateTime());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    fetchAlerts()
      .then((data) => {
        if (data?.length) {
          setIncidents(
            data.map((a: any) => ({
              id: a.id,
              severity: toAlertSeverity(a.severity),
              title: `${a.incident_type?.replace(/_/g, " ") || "Incident"}${a.location ? ` at ${a.location}` : ""}`,
              location: a.location || "Unknown",
              timestamp: a.created_at ? new Date(a.created_at).toLocaleTimeString() : "—",
              timeAgo: "—",
              status: toAlertStatus(a.resolved ? "resolved" : "active"),
              detectionSource: "AI Detection",
              ...(a.risk_score ? { impactLevel: `Risk: ${a.risk_score}/100` } : {}),
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const filteredAlerts = useMemo(() => {
    if (activeFilter === "all") return incidents;
    return incidents.filter((alert) => alert.severity === activeFilter);
  }, [activeFilter, incidents]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Alert feed */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-outline-variant/30 px-4 py-4 md:px-6 md:py-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-display-lg text-display-lg text-white">Incident Management</h1>
                <p className="mt-1 text-body-sm text-on-surface-variant">
                  Real-time orchestration of network anomalies
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="hidden font-data-mono text-data-mono text-on-surface-variant sm:block">{liveClock}</p>
                <button
                  type="button"
                  onClick={() => setShowIntelligence(!showIntelligence)}
                  className="rounded border border-outline-variant/30 px-3 py-1 text-xs text-on-surface-variant lg:hidden"
                >
                  {showIntelligence ? "Hide Log" : "Show Log"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded px-4 py-2 font-label-caps text-label-caps transition-colors ${
                    activeFilter === filter.id
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 pb-14 md:p-6">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* Intelligence panel - collapsible on mobile */}
        <aside className={`${showIntelligence ? "flex" : "hidden"} w-full flex-col border-t border-outline-variant/30 lg:flex lg:w-96 lg:border-l lg:border-t-0`}>
          <IntelligenceLogPanel logs={intelligenceLogs} suggestedAction={suggestedAction} streamLogs={streamIntelligenceLogs} />
        </aside>
      </div>

      {/* Command bar footer */}
      <footer className="flex h-10 shrink-0 items-center gap-4 border-t border-outline-variant/30 bg-surface-container-lowest px-4">
        <span className="material-symbols-outlined text-on-surface-variant">terminal</span>
        <input
          type="text"
          placeholder="Enter command or incident ID..."
          className="min-w-0 flex-1 border-none bg-transparent font-data-mono text-data-mono text-on-background placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-0"
        />
        <div className="hidden shrink-0 items-center gap-4 font-data-mono text-[10px] text-on-surface-variant sm:flex">
          <span className="flex items-center gap-2">
            <span className="led-dot led-pulse bg-green-500" />
            Live Sync
          </span>
          <span>API Latency: 12ms</span>
        </div>
      </footer>
    </div>
  );
}
