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
            imageUrl: `/cctv/${id}.svg`,
          }))}
          activeCameraId="cam1"
          detectionCount={8}
          resolution="1080p 60fps"
          boundingBoxes={[
            { id: "b1", positionClass: "top-[40%] left-[30%] w-16 h-24", variant: "error" },
            { id: "b2", positionClass: "top-[45%] left-[60%] w-12 h-20", variant: "primary" },
            { id: "b3", positionClass: "top-[60%] left-[20%] w-20 h-10", variant: "error", label: "DEFECT: Crack (98%)" },
          ]}
        />
      </main>
    </div>
  );
}
