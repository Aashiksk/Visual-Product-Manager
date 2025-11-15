# seed_db.py
import csv
import os
from PIL import Image
from sqlalchemy.orm import Session
from models import init_db, Product, engine
from utils import compute_phash_from_pil

BASE_DIR = os.path.dirname(__file__)
PRODUCTS_DIR = os.path.join(BASE_DIR, "product_images")
CSV_FILE = os.path.join(BASE_DIR, "products.csv")

def seed():
    init_db()
    if not os.path.exists(PRODUCTS_DIR):
        print("No product_images/ directory found. Create it and add product images.")
        return
    rows = []
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, newline='', encoding='utf-8') as f:
            text = f.read()
            f.seek(0)
            try:
                has_header = csv.Sniffer().has_header(text)
            except Exception:
                has_header = False
            if has_header:
                reader = csv.DictReader(f)
                for r in reader:
                    rows.append(r)
            else:
                reader = csv.reader(f)
                for r in reader:
                    if len(r) >= 3:
                        rows.append({"filename": r[0], "name": r[1], "category": r[2]})
    else:
        for fn in os.listdir(PRODUCTS_DIR):
            rows.append({"filename": fn, "name": os.path.splitext(fn)[0], "category": "uncategorized"})

    inserted = 0
    with Session(engine) as session:
        for r in rows:
            fn = r.get("filename")
            name = r.get("name", fn)
            category = r.get("category", "uncategorized")
            path = os.path.join(PRODUCTS_DIR, fn)
            if not os.path.exists(path):
                print(f"Skipping missing file: {path}")
                continue
            try:
                pil = Image.open(path).convert("RGB")
                phash_int = compute_phash_from_pil(pil)
                phash_hex = format(phash_int, "016x")
                prod = Product(name=name, category=category, image_filename=fn, phash_hex=phash_hex)
                session.add(prod)
                inserted += 1
            except Exception as e:
                print("Error processing", path, e)
        session.commit()
    print(f"Seeding completed. Inserted {inserted} products.")

if __name__ == "__main__":
    seed()
