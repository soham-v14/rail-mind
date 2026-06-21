"use client";

import { ArrowUp } from "lucide-react";

export type StatAccent = "primary" | "green" | "orange";

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  accent: StatAccent;
  trend?: {
    direction: "up" | "down";
    value: string;
  };
  subtext?: string;
}

export interface StatCardsProps {
  stats: StatCardData[];
  classNameOverride?: string;
}

const accentBorder: Record<StatAccent, string> = {
  primary: "border-l-rm-primary",
  green: "border-l-green-500",
  orange: "border-l-orange-500",
};

const accentValue: Record<StatAccent, string> = {
  primary: "text-rm-on-surface",
  green: "text-green-500",
  orange: "text-orange-400",
};

export default function StatCards({ stats, classNameOverride }: StatCardsProps) {
  return (
    <div className={classNameOverride || "grid h-24 shrink-0 grid-cols-3 gap-2"}>
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`flex flex-col justify-center rounded border border-rm-border border-l-2 bg-rm-panel/85 px-3 py-2 backdrop-blur-sm transition-colors hover:bg-rm-surface-container-highest ${accentBorder[stat.accent]}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-rm-on-surface-variant">
            {stat.label}
          </span>
          <div className="mt-1 flex items-end gap-2">
            <span className={`font-mono text-2xl font-medium ${accentValue[stat.accent]}`}>{stat.value}</span>
            {stat.trend && (
              <span className="mb-1 flex items-center font-mono text-[10px] text-rm-error">
                {stat.trend.direction === "up" && <ArrowUp className="h-3 w-3" />}
                {stat.trend.value}
              </span>
            )}
            {stat.subtext && (
              <span className="mb-1 font-mono text-[10px] text-rm-on-surface-variant">{stat.subtext}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
