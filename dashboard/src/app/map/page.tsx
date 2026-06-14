"use client";

import { useEffect, useState } from "react";
import MapView from "@/components/MapView";
import { fetchDashboardMap, fetchTrains } from "@/lib/api";
import {
  trains as mockTrains,
  stations as mockStations,
  riskZones as mockRiskZones,
} from "@/lib/mockData";
import type { Train, Station, RiskZone } from "@/lib/types";

function toRiskCategory(score: number): RiskZone["risk_category"] {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "elevated";
  if (score >= 20) return "moderate";
  return "low";
}

function toCrowdDensity(val?: string): Station["crowd_density"] {
  if (val === "critical" || val === "high" || val === "medium" || val === "low") return val;
  return "medium";
}

export default function MapPage() {
  const [trains, setTrains] = useState<Train[]>(mockTrains);
  const [stations, setStations] = useState<Station[]>(mockStations);
  const [riskZones, setRiskZones] = useState<RiskZone[]>(mockRiskZones);

  useEffect(() => {
    Promise.all([fetchDashboardMap(), fetchTrains()])
      .then(([mapData, trainData]) => {
        if (mapData?.trains?.length) {
          setTrains(mapData.trains.map((t: any) => ({
            ...t,
            status: t.status === "on_time" || t.status === "delayed" || t.status === "critical" ? t.status : "on_time",
          })));
        }
        if (mapData?.stations?.length) {
          setStations(
            mapData.stations.map((s: any) => ({
              ...s,
              crowd_density: toCrowdDensity(s.crowd_density),
            }))
          );
        }
        if (mapData?.risk_zones?.length) {
          setRiskZones(
            mapData.risk_zones.map((z: any) => ({
              ...z,
              risk_category: toRiskCategory(z.risk_score ?? 0),
              risk_score: z.risk_score ?? 0,
              top_factors: z.top_factors ?? ["Monitor routinely"],
            }))
          );
        }
        if (trainData?.length) {
          setTrains(trainData.map((t: any) => ({
            ...t,
            status: t.status === "on_time" || t.status === "delayed" || t.status === "critical" ? t.status : "on_time",
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 p-2 md:p-4">
        <MapView trains={trains} stations={stations} riskZones={riskZones} />
      </main>
    </div>
  );
}
