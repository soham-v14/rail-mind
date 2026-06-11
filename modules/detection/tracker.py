from ultralytics import YOLO
from .config import DEFAULT_MODEL, DEFAULT_CONFIDENCE, DEFAULT_TRACKER


class Tracker:
    def __init__(self, model_path=DEFAULT_MODEL, conf_threshold=DEFAULT_CONFIDENCE):
        self.model = YOLO(model_path)
        self.conf_threshold = conf_threshold

    def track(self, frame):
        results = self.model.track(
            frame,
            conf=self.conf_threshold,
            persist=True,
            tracker=DEFAULT_TRACKER,
            verbose=False,
        )
        return results[0] if results else None
