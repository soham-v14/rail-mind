import cv2
import numpy as np
from .detector import Detector
from .tracker import Tracker
from .alert import AlertEngine
from .config import DEFAULT_MODEL, DEFAULT_CONFIDENCE


class DetectionPipeline:
    def __init__(self, model_path=DEFAULT_MODEL, conf_threshold=DEFAULT_CONFIDENCE):
        self.detector = Detector(model_path, conf_threshold)
        self.tracker = Tracker(model_path, conf_threshold)
        self.alert_engine = AlertEngine()
        self._tracking = False

    @property
    def tracking(self):
        return self._tracking

    @tracking.setter
    def tracking(self, value: bool):
        self._tracking = value

    def process_frame(self, frame: np.ndarray):
        if self._tracking:
            result = self.tracker.track(frame)
        else:
            result = self.detector.detect(frame)

        if result is None:
            return frame, []

        detections = self._parse_result(result)
        alerts = self.alert_engine.evaluate(detections, result.names, frame)
        frame = self.alert_engine.draw_alerts(frame, alerts)
        return frame, alerts

    def _parse_result(self, result):
        detections = []
        if result.boxes is None:
            return detections

        for box in result.boxes:
            det = {
                "bbox": box.xyxy[0].tolist(),
                "confidence": float(box.conf[0]),
                "class_id": int(box.cls[0]),
                "class_name": result.names[int(box.cls[0])],
            }
            if box.id is not None:
                det["track_id"] = int(box.id[0])
            detections.append(det)
        return detections

    def process_video(self, source, output_path=None, display=True):
        if isinstance(source, str) and source.isdigit():
            source = int(source)
        cap = cv2.VideoCapture(source)
        if not cap.isOpened():
            raise ValueError(f"Cannot open video source: {source}")

        fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        writer = None
        if output_path:
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            writer = cv2.VideoWriter(output_path, fourcc, fps, (w, h))

        alert_log = []
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame, alerts = self.process_frame(frame)

            if writer:
                writer.write(frame)

            alert_log.extend(alerts)

            if display:
                cv2.imshow("RailMind - Detection Pipeline", frame)
                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break

        cap.release()
        if writer:
            writer.release()
        if display:
            cv2.destroyAllWindows()

        return alert_log

    def process_image(self, image_path: str):
        frame = cv2.imread(image_path)
        if frame is None:
            raise ValueError(f"Cannot read image: {image_path}")
        frame, alerts = self.process_frame(frame)
        return frame, alerts
