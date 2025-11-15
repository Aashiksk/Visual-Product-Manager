📦 Visual Product Matcher

A full-stack web application that allows users to upload an image or enter keywords to find visually or contextually similar products.
Built using Flask + HTML/CSS/JS with a lightweight JSON-based product database.

🚀 Features

Upload an image (preview shown client-side)

Keyword-based product matching

Category filtering

Displays 50 product results with real image URLs

Beautiful, centered, modern UI

Fully responsive (mobile friendly)

No database or ML model required

Only Flask is needed to run the backend

🗂 Project Structure
visual-product-matcher/
├─ app.py # Flask backend
├─ products.json # Contains 50 products with image URLs
├─ templates/
│ └─ index.html # Frontend UI
├─ static/
│ ├─ styles.css # Modern UI styling
│ └─ main.js # Frontend logic
└─ README.md

🧰 Technologies Used

Frontend

HTML

CSS (custom modern styling)

JavaScript

Backend

Python

Flask (only external dependency)

Data Storage

products.json (50 pre-loaded products)

📦 Installation
1️⃣ Clone the project
git clone https://github.com/your-username/visual-product-matcher.git
cd visual-product-matcher

2️⃣ Create a virtual environment (optional)
python -m venv venv

Activate it:

Windows

venv\Scripts\activate

macOS/Linux

source venv/bin/activate

3️⃣ Install required package

This project requires only Flask:

pip install flask

▶️ Running the Application

Start the development server:

python app.py

Then open your browser and go to:

👉 http://127.0.0.1:5000/

📝 How It Works
Backend (Flask)

Loads list of products from products.json

/api/search filters products based on:

Keyword match

Category match

Sends results + similarity value back to frontend

Frontend

Uploads image (for preview only)

Sends query + category to backend

Displays results in a modern grid layout

Fully responsive design

📁 Product Data (products.json)

Each product contains:

id

name

category

image_url (Unsplash)

This approach:

Removes need for a database

Avoids file storage complexity

Makes deployment very easy

📌 Future Enhancements (Optional)

AI-based similarity search (CLIP model)

Drag & drop upload animation

Pagination for results

Admin panel to add/update products

Real-time search suggestions

Dark mode UI

🧑‍💻 Author

Visual Product Matcher – 2025
Created as a full-stack assignment project.
