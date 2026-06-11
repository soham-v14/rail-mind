DEFAULT_MODEL = "yolov8n.pt"
DEFAULT_CONFIDENCE = 0.5
DEFAULT_TRACKER = "bytetrack.yaml"

COCO_CLASSES = {
    0: "person",
    1: "bicycle",
    2: "car",
    3: "motorcycle",
    4: "airplane",
    5: "bus",
    6: "train",
    7: "truck",
    8: "boat",
    9: "traffic light",
    10: "fire hydrant",
    15: "bird",
    16: "cat",
    17: "dog",
    18: "horse",
    19: "sheep",
    20: "cow",
    21: "elephant",
    22: "bear",
    23: "zebra",
    24: "giraffe",
    25: "backpack",
    26: "umbrella",
    27: "handbag",
    28: "tie",
    29: "suitcase",
    43: "clock",
    44: "vase",
    67: "cell phone",
    77: "scissors",
}

DETECTION_CATEGORIES = {
    "human_intrusion": {
        "class_ids": [0],
        "label": "Human Intrusion",
        "risk": "critical",
        "color": (0, 0, 255),
    },
    "unattended_object": {
        "class_ids": [25, 27, 29],
        "label": "Unattended Object",
        "risk": "high",
        "color": (0, 165, 255),
    },
    "track_obstacle": {
        "class_ids": [1, 2, 3, 5, 6, 7],
        "label": "Track Obstacle",
        "risk": "critical",
        "color": (0, 0, 255),
    },
    "animal": {
        "class_ids": [15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        "label": "Animal on Tracks",
        "risk": "high",
        "color": (0, 255, 255),
    },
    "fire_hazard": {
        "class_ids": [10],
        "label": "Fire Hazard",
        "risk": "critical",
        "color": (0, 0, 255),
    },
}

ALERT_COOLDOWN_SECONDS = 10
TRACK_HISTORY_FRAMES = 30
IOU_THRESHOLD = 0.5
