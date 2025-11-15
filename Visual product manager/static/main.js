// static/main.js
let uploaded = null;
let lastUpload = null; // {image_id, image_url, phash}

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file-input");
  const dropArea = document.getElementById("drop-area");
  const preview = document.getElementById("preview");
  const previewImg = document.getElementById("preview-img");
  const searchBtn = document.getElementById("search-btn");
  const status = document.getElementById("status");
  const loading = document.getElementById("loading");
  const resultsGrid = document.getElementById("results-grid");
  const empty = document.getElementById("empty");

  fileInput.addEventListener("change", async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    previewImg.src = URL.createObjectURL(f);
    preview.classList.remove("hidden");
    uploaded = f;
    status.textContent = `Selected ${f.name}`;
  });

  ;["dragenter","dragover","dragleave","drop"].forEach(evt=>{
    dropArea.addEventListener(evt, (e)=> e.preventDefault());
  });
  dropArea.addEventListener("drop", (e) => {
    const f = e.dataTransfer.files[0];
    if (!f) return;
    fileInput.files = e.dataTransfer.files;
    previewImg.src = URL.createObjectURL(f);
    preview.classList.remove("hidden");
    uploaded = f;
    status.textContent = `Selected ${f.name}`;
  });

  document.getElementById("upload-url-btn").addEventListener("click", async () => {
    const url = document.getElementById("image-url").value.trim();
    if (!url) { alert("Paste an image URL or upload file"); return; }
    try {
      status.textContent = "Fetching image from URL...";
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Failed to fetch image");
      const blob = await resp.blob();
      const file = new File([blob], "from_url.jpg", { type: blob.type });
      uploaded = file;
      previewImg.src = URL.createObjectURL(file);
      preview.classList.remove("hidden");
      status.textContent = "Image fetched from URL (preview ready).";
    } catch (err) {
      status.textContent = "Error fetching image: " + err.message;
    }
  });

  searchBtn.addEventListener("click", async () => {
    if (!uploaded) { alert("Upload an image first"); return; }
    resultsGrid.innerHTML = ""; empty.classList.add("hidden");
    loading.classList.remove("hidden");
    status.textContent = "Uploading image...";
    try {
      const form = new FormData();
      form.append("file", uploaded);
      const r = await fetch("/api/upload", { method: "POST", body: form });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Upload failed");
      lastUpload = data; // {image_id, image_url, phash}
      status.textContent = "Uploaded. Searching for similar products...";
      await runSearch();
    } catch (err) {
      status.textContent = "Error: " + err.message;
    } finally {
      loading.classList.add("hidden");
    }
  });

  async function runSearch() {
    loading.classList.remove("hidden");
    resultsGrid.innerHTML = "";
    const score = document.getElementById("similarity-slider").value;
    const category = document.getElementById("category-filter").value.trim();
    const params = new URLSearchParams();
    params.set("phash", lastUpload.phash);
    params.set("score", score);
    if (category) params.set("category", category);
    const url = "/api/search?" + params.toString();
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Search failed");
      const results = data.results || [];
      if (results.length === 0) {
        empty.classList.remove("hidden");
      } else {
        for (const r of results) {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <img src="${r.image_url}" />
            <div style="padding:8px 0">
              <div style="font-weight:600">${r.name}</div>
              <div style="font-size:13px;color:#666">${r.category}</div>
              <div style="margin-top:6px;font-size:13px">Similarity: <strong>${r.similarity}%</strong></div>
            </div>
          `;
          resultsGrid.appendChild(card);
        }
      }
    } catch (err) {
      status.textContent = "Search error: " + err.message;
    } finally {
      loading.classList.add("hidden");
    }
  }

  document.getElementById("apply-filter").addEventListener("click", runSearch);
  document.getElementById("similarity-slider").addEventListener("input", (e)=>{
    document.getElementById("score-label").textContent = e.target.value;
  });

});
