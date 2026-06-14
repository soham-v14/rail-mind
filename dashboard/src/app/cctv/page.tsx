"use client";

import CctvFeed from "@/components/CctvFeed";

const CCTV_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAa7WxaCGu2PZhONsuwVXuGOl5ZTXyP5OU_tVZXhLcBkrluslEtJc4b4QblXuoHH4JlEX6lI1xViypAAL-aXsSAsMOn9rdBFo3wnT-1p1B52Yx-4CSpPR10Z2fke9BMNS_Eh692meMon_fxVttlPamUsveDVwgeJJ4rZR2Xh3mVwbxV1nbBzQSUPsm-kLF84rBuz5oeND-s6Fj0IM-WL1GWT_ZfWKr8gDlPpVg3TrwKkc6uYcDyRY-KaFsRLzi8jVM4WfZnq77McpeY";

export default function CctvPage() {
  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 overflow-y-auto p-2 md:p-4">
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
      </main>
    </div>
  );
}
