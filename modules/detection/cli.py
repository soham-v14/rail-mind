import argparse
import sys
from .pipeline import DetectionPipeline


def main():
    parser = argparse.ArgumentParser(description="RailMind — Detection Module")
    parser.add_argument("source", nargs="?", default="0",
                        help="Video source (path, camera index, or image). Default: camera 0")
    parser.add_argument("--model", default="yolov8n.pt",
                        help="YOLO model path")
    parser.add_argument("--conf", type=float, default=0.5,
                        help="Confidence threshold")
    parser.add_argument("--output", default=None,
                        help="Output video path")
    parser.add_argument("--no-display", action="store_true",
                        help="Disable display window")
    parser.add_argument("--track", action="store_true",
                        help="Enable ByteTrack tracking")

    args = parser.parse_args()

    pipeline = DetectionPipeline(model_path=args.model, conf_threshold=args.conf)
    pipeline.tracking = args.track

    source = args.source
    if source.startswith("cam:"):
        source = int(source.replace("cam:", ""))

    is_image = source.endswith((".jpg", ".jpeg", ".png", ".bmp", ".tiff"))

    if is_image:
        frame, alerts = pipeline.process_image(source)
        if not args.no_display:
            cv2.imshow("RailMind - Detection", frame)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
        print(f"Alerts: {len(alerts)}")
        for a in alerts:
            print(f"  [{a.risk.upper()}] {a.category}: {a.label} "
                  f"(conf={a.confidence:.2f}, id={a.track_id})")
    else:
        import cv2
        alerts = pipeline.process_video(source, args.output, not args.no_display)
        print(f"Total alerts triggered: {len(alerts)}")


if __name__ == "__main__":
    main()
