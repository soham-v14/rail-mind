"use client";

import { useState } from "react";
import type { EmergencyRecommendation } from "@/lib/types";
import { ChevronDown, ChevronUp, AlertTriangle, Flame, PersonStanding } from "lucide-react";

const incidentIcons: Record<string, React.ReactNode> = {
  human_intrusion: <PersonStanding className="w-5 h-5" />,
  fire_hazard: <Flame className="w-5 h-5" />,
};

function escalationColor(level: string) {
  switch (level) {
    case "critical": return "border-red-500";
    case "high": return "border-orange-500";
    default: return "border-yellow-500";
  }
}

function priorityColor(p: string) {
  switch (p) {
    case "immediate": return "text-red-400";
    case "short_term": return "text-yellow-400";
    default: return "text-slate-400";
  }
}

function RecommendationCard({ rec }: { rec: EmergencyRecommendation }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-l-2 ${escalationColor(rec.escalation_level)} bg-slate-800/50 rounded-r-lg overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-slate-300">{incidentIcons[rec.incident_type] || <AlertTriangle className="w-5 h-5" />}</span>
          <div className="min-w-0">
            <div className="text-white text-sm font-medium">{rec.category}</div>
            <p className="text-xs text-slate-400 truncate">{rec.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white uppercase ${
            rec.escalation_level === "critical" ? "bg-red-600" : "bg-orange-500"
          }`}>
            {rec.escalation_level}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-300 mb-2">{rec.summary}</p>
          <div className="space-y-1">
            {rec.actions.map((a) => (
              <div key={a.step} className="flex items-start gap-2 text-xs">
                <span className="text-slate-500 w-5 flex-shrink-0">#{a.step}</span>
                <span className="text-slate-300">{a.action}</span>
                <span className={`flex-shrink-0 ml-auto ${priorityColor(a.priority)}`}>
                  {a.priority}
                </span>
                <span className="text-slate-500 flex-shrink-0">→ {a.assigned_to}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface EmergencyRecommendationsProps {
  recommendations: EmergencyRecommendation[];
}

export default function EmergencyRecommendations({ recommendations }: EmergencyRecommendationsProps) {
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-white text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Emergency Recommendations
        </h2>
        <span className="text-xs text-slate-400">{recommendations.length} active</span>
      </div>
      <div className="divide-y divide-slate-700/50">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}
