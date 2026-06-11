from ultralytics import YOLO
from .config import DEFAULT_MODEL, DEFAULT_CONFIDENCE


class Detector:
    def __init__(self, model_path=DEFAULT_MODEL, conf_threshold=DEFAULT_CONFIDENCE):
        self.model = YOLO(model_path)
        self.conf_threshold = conf_threshold

    def detect(self, frame):
        results = self.model(frame, conf=self.conf_threshold, verbose=False)
        return results[0] if results else None

    def detect_batch(self, frames, batch_size=8):
        results = self.model(frames, conf=self.conf_threshold, verbose=False, batch=batch_size)
        return results
