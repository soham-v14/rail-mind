"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import type { Train as TrainType, Station, RiskZone } from "@/lib/types";

function getRiskColor(category: string) {
  switch (category) {
    case "critical": return "#ef4444";
    case "high": return "#f97316";
    case "elevated": return "#eab308";
    case "moderate": return "#3b82f6";
    default: return "#22c55e";
  }
}

function getCrowdColor(density: string) {
  switch (density) {
    case "critical": return "#ef4444";
    case "high": return "#f97316";
    case "medium": return "#eab308";
    default: return "#22c55e";
  }
}

function getTrainColor(status: string) {
  switch (status) {
    case "critical": return "#ef4444";
    case "delayed": return "#eab308";
    default: return "#22c55e";
  }
}

interface MapViewProps {
  trains: TrainType[];
  stations: Station[];
  riskZones: RiskZone[];
}

export default function MapView({ trains, stations, riskZones }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapRef.current && (mapRef.current as any)._leaflet_id) return;

    const initMap = async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current) return;
      if ((mapRef.current as any)._leaflet_id) return;
      const map = L.map(mapRef.current, { zoomControl: false }).setView([19.05, 72.92], 10);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      stations.forEach((s: Station) => {
        const color = getCrowdColor(s.crowd_density);
        const icon = L.divIcon({
          html: `<div style="width:16px;height:16px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.5)"></div>`,
          className: "",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${s.name}</b><br/>Crowd: ${s.crowd_density}`);
      });

      trains.forEach((t: TrainType) => {
        const color = getTrainColor(t.status);
        const icon = L.divIcon({
          html: `<div style="width:12px;height:12px;background:${color};border:2px solid white;transform:rotate(45deg);box-shadow:0 1px 3px rgba(0,0,0,0.5)"></div>`,
          className: "",
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        L.marker([t.lat, t.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<b>${t.name}</b> (${t.id})<br/>Speed: ${t.speed} km/h<br/>Status: ${t.status}${t.delay_minutes ? `<br/>Delay: ${t.delay_minutes} min` : ""}`
          );
      });

      riskZones.forEach((z: RiskZone) => {
        const color = getRiskColor(z.risk_category);
        L.circle([z.lat, z.lng], {
          radius: z.radius,
          color,
          fillColor: color,
          fillOpacity: 0.1,
          weight: 2,
        })
          .addTo(map)
          .bindPopup(
            `<b>Section ${z.section}</b><br/>Risk: ${z.risk_score}/100 (${z.risk_category})<br/>${z.top_factors.join("<br/>")}`
          );
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapRef.current) {
        delete (mapRef.current as any)._leaflet_id;
      }
    };
  }, [trains, stations, riskZones]);

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-white text-sm font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          Live Network Map
        </h2>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Train (on time)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Train (delayed)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Risk zone</span>
        </div>
      </div>
      <div ref={mapRef} className="h-[300px] md:h-[400px] w-full" />
    </div>
  );
}
