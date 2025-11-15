# app.py
import os
import uuid
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sqlalchemy.orm import Session
from models import init_db, Product, engine
from utils import compute_phash_from_pil, phash_to_hex, hamming_distance
from PIL import Image

BASE_DIR = os.path.dirname(__file__)
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

app = Flask(__name__, static_folder="static", template_folder="templates")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
CORS(app)

# Initialize DB (create tables)
init_db()

@app.route("/")
def index():
    return render_template("index.html")

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# 1) Upload file endpoint
@app.route("/api/upload", methods=["POST"])
def api_upload():
    if "file" not in request.files:
        return jsonify({"error": "no file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "no selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        path = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)
        file.save(path)
        # compute pHash
        pil = Image.open(path).convert("RGB")
        phash_int = compute_phash_from_pil(pil)
        phash_hex = phash_to_hex(phash_int)
        image_id = unique_name
        return jsonify({
            "image_id": image_id,
            "image_url": f"/uploads/{image_id}",
            "phash": phash_hex
        })
    else:
        return jsonify({"error": "unsupported file type"}), 400

# 2) Upload by URL (stub: client should fetch and POST)
@app.route("/api/upload-url", methods=["POST"])
def api_upload_url():
    data = request.json or {}
    url = data.get("url", "").strip()
    if not url:
        return jsonify({"error": "no url provided"}), 400
    return jsonify({
        "error": "server is not configured to fetch remote URLs. Please download the image and upload via /api/upload."
    }), 400

# 3) Search endpoint
@app.route("/api/search", methods=["GET"])
def api_search():
    image_id = request.args.get("image_id")
    phash_hex = request.args.get("phash")
    min_score = float(request.args.get("score", 0))  # 0..100
    category = request.args.get("category")
    limit = int(request.args.get("limit", 20))

    if not (image_id or phash_hex):
        return jsonify({"error": "provide image_id or phash"}), 400

    # compute phash either from uploads or from provided hex
    if phash_hex:
        try:
            phash = int(phash_hex, 16)
        except ValueError:
            return jsonify({"error": "invalid phash hex"}), 400
    else:
        upload_path = os.path.join(app.config["UPLOAD_FOLDER"], image_id)
        if not os.path.exists(upload_path):
            return jsonify({"error": "uploaded image not found"}), 404
        pil = Image.open(upload_path).convert("RGB")
        phash = compute_phash_from_pil(pil)

    results = []
    with Session(engine) as session:
        q = session.query(Product)
        if category:
            q = q.filter(Product.category == category)
        products = q.all()
        for p in products:
            try:
                p_phash = int(p.phash_hex, 16)
            except Exception:
                continue
            dist = hamming_distance(phash, p_phash)
            max_bits = 64
            similarity = max(0.0, (1 - dist / max_bits)) * 100
            if similarity >= min_score:
                results.append({
                    "id": p.id,
                    "name": p.name,
                    "category": p.category,
                    "image_url": f"/product_images/{p.image_filename}",
                    "similarity": round(similarity, 2),
                    "distance": dist
                })
    results = sorted(results, key=lambda x: x["similarity"], reverse=True)[:limit]
    return jsonify({"results": results})

# Serve uploaded files
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Serve product_images
@app.route("/product_images/<path:filename>")
def product_images(filename):
    return send_from_directory(os.path.join(BASE_DIR, "product_images"), filename)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
