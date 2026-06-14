"use client";

import CctvFeed from "@/components/CctvFeed";

const CCTV_CAMS = ["cam1", "cam2", "cam3", "cam4"];

export default function CctvPage() {
  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 overflow-y-auto p-2 md:p-4">
        <CctvFeed
          cameras={CCTV_CAMS.map((id) => ({
            id, label: id.toUpperCase(), name: `CAM ${id.slice(-1)} - ${["Mumbai Central", "Dadar", "Thane", "Kalyan"][parseInt(id.slice(-1)) - 1]}`,
            imageUrl: `/cctv/${id}.jpg`,
          }))}
          activeCameraId="cam1"
          detectionCount={0}
          resolution="Live Feed"
          boundingBoxes={[]}
        />
      </main>
    </div>
  );
}
