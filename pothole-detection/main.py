"""
Pothole detection API using YOLOv8.
Accepts an image from the user and returns detections + annotated image.
"""
import io
import base64
import tempfile
import os
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="StreetScan Pothole Detection", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_URL = "https://huggingface.co/peterhdd/pothole-detection-yolov8/resolve/main/best.pt"
MODEL_PATH = Path(tempfile.gettempdir()) / "StreetScan_pothole_best.pt"


def get_model():
    from ultralytics import YOLO
    if not MODEL_PATH.exists():
        import requests
        r = requests.get(MODEL_URL, stream=True)
        r.raise_for_status()
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(MODEL_PATH, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    return YOLO(str(MODEL_PATH))


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image (e.g. image/jpeg, image/png)")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(400, "Empty file")

    try:
        model = get_model()
    except Exception as e:
        raise HTTPException(500, f"Model load failed: {str(e)}")

    with tempfile.NamedTemporaryFile(suffix=Path(file.filename or "image").suffix or ".jpg", delete=False) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        results = model(tmp_path)
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

    detections = []
    annotated_bytes = None

    for r in results:
        # YOLO format: boxes.xyxy (x1,y1,x2,y2), boxes.conf, boxes.cls
        if r.boxes is not None:
            for i, box in enumerate(r.boxes):
                xyxy = box.xyxy[0].tolist()
                conf = float(box.conf[0])
                cls_id = int(box.cls[0])
                class_name = r.names.get(cls_id, "pothole")
                detections.append({
                    "class": class_name,
                    "confidence": round(conf * 100, 1),
                    "bbox": [round(x, 2) for x in xyxy],
                })
        # Annotated image (BGR numpy array from r.plot())
        im_array = r.plot()
        if im_array is not None:
            import cv2
            _, buf = cv2.imencode(".jpg", im_array)
            annotated_bytes = buf.tobytes()

    annotated_base64 = base64.b64encode(annotated_bytes).decode("utf-8") if annotated_bytes else None

    return {
        "detections": detections,
        "annotated_image_base64": annotated_base64,
    }
