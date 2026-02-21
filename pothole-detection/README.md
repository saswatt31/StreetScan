# StreetScan Pothole Detection API

YOLOv8-based pothole detection. The model runs on images **uploaded by the user** (no external image URL).

## Setup

```bash
cd pothole-detection
pip install -r requirements.txt
```

On first run, the app downloads the model from Hugging Face (`peterhdd/pothole-detection-yolov8`) and caches it.

## Run the API

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Keep this running while using the citizen report flow. The Next.js app calls `http://127.0.0.1:8000` by default (override with `POTHOLE_DETECTION_API_URL`).

## Endpoints

- **GET /health** – Health check
- **POST /detect** – Send a multipart form with `file` (image). Returns `{ "detections": [...], "annotated_image_base64": "..." }`.

## Flow

1. User uploads a photo on the **Report Infrastructure Issue** page.
2. Next.js sends the image to this API.
3. The API runs YOLO and returns bounding boxes and an annotated image.
4. The citizen report UI shows the annotated image and list of detections; the user can then submit the report with location and contact details.
