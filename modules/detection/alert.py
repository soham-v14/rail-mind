import time
import cv2
import numpy as np
from dataclasses import dataclass, field
from typing import Optional
from .config import (
    DETECTION_CATEGORIES,
    ALERT_COOLDOWN_SECONDS,
    TRACK_HISTORY_FRAMES,
    IOU_THRESHOLD,
)


@dataclass
class Alert:
    alert_type: str
    category: str
    label: str
    risk: str
    bbox: list
    track_id: Optional[int]
    confidence: float
    timestamp: float
    frame: Optional[np.ndarray] = None


def compute_iou(box1, box2):
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])
    inter = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union = area1 + area2 - inter
    return inter / union if union > 0 else 0


class AlertEngine:
    def __init__(self, cooldown=ALERT_COOLDOWN_SECONDS):
        self.cooldown = cooldown
        self._active_alerts: dict[str, float] = {}
        self._history: dict[int, list] = {}

    def _category_for_class(self, class_id: int) -> Optional[tuple]:
        for cat_name, cat_info in DETECTION_CATEGORIES.items():
            if class_id in cat_info["class_ids"]:
                return cat_name, cat_info
        return None

    def _alert_key(self, category, track_id, bbox):
        if track_id is not None:
            return f"{category}:{track_id}"
        return f"{category}:{hash(tuple(bbox))}"

    def _should_suppress(self, category, track_id, bbox):
        if track_id is not None:
            stored_key = f"{category}:{track_id}"
            if stored_key in self._active_alerts:
                if time.time() - self._active_alerts[stored_key] < self.cooldown:
                    return True
        key = self._alert_key(category, None, bbox)
        for existing_key, last_alert_time in self._active_alerts.items():
            if existing_key.startswith(f"{category}:") and time.time() - last_alert_time < self.cooldown:
                try:
                    existing_bbox = eval(existing_key.split(":", 1)[1])
                    if len(bbox) == 4 and compute_iou(bbox, existing_bbox) > IOU_THRESHOLD:
                        return True
                except Exception:
                    pass
        return False

    def evaluate(self, detections, class_names, frame=None) -> list[Alert]:
        alerts = []
        now = time.time()

        for det in detections:
            class_id = det.get("class_id", det.get("cls"))
            if class_id is None:
                continue
            bbox = det.get("bbox", det.get("xyxy"))
            confidence = det.get("confidence", det.get("conf", 0))
            track_id = det.get("track_id", det.get("id"))

            category_info = self._category_for_class(int(class_id))
            if not category_info:
                continue

            cat_name, cat_info = category_info

            if self._should_suppress(cat_name, track_id, bbox):
                continue

            key = self._alert_key(cat_name, track_id, bbox)
            self._active_alerts[key] = now

            alert = Alert(
                alert_type=cat_name,
                category=cat_info["label"],
                label=class_names.get(int(class_id), str(class_id)),
                risk=cat_info["risk"],
                bbox=bbox,
                track_id=track_id,
                confidence=confidence,
                timestamp=now,
                frame=frame.copy() if frame is not None else None,
            )
            alerts.append(alert)

        self._cleanup_stale()
        return alerts

    def _cleanup_stale(self, max_age=ALERT_COOLDOWN_SECONDS * 3):
        now = time.time()
        stale = [k for k, v in self._active_alerts.items() if now - v > max_age]
        for k in stale:
            del self._active_alerts[k]

    def draw_alerts(self, frame, alerts: list[Alert]):
        for alert in alerts:
            cat_info = DETECTION_CATEGORIES.get(alert.alert_type, {})
            color = cat_info.get("color", (0, 255, 0))
            bbox = alert.bbox
            if len(bbox) >= 4:
                x1, y1, x2, y2 = map(int, bbox[:4])
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                label_parts = [alert.category]
                if alert.track_id is not None:
                    label_parts.append(f"ID:{alert.track_id}")
                label_parts.append(f"{alert.confidence:.2f}")
                label = " | ".join(label_parts)
                (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                cv2.rectangle(frame, (x1, y1 - th - 8), (x1 + tw + 6, y1), color, -1)
                cv2.putText(frame, label, (x1 + 3, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        return frame
