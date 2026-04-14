// ================= API KEY =================
const API_KEY = "7uLHHdvit0KavMYJnXO4jPcKbpIRCpoB5xX52H9O";

// ================= GET PREVIEW SECTIONS =================
const previewSections = document.querySelectorAll(".preview-section");
const apodGrid = previewSections[0]?.querySelector(".preview-grid");
const epicGrid = previewSections[1]?.querySelector(".preview-grid");

// ================= SAFE JSON PARSER =================
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null; // return null instead of throwing
  }
}

// ================= APOD PREVIEW =================
async function loadApodPreview() {
  if (!apodGrid) return;

  try {
    const today = new Date();
    const dates = [...Array(3)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toISOString().split("T")[0];
    });

    const requests = dates.map(date =>
      fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
        .then(safeJson)
    );

    const results = await Promise.all(requests);

    apodGrid.innerHTML = "";

    let loaded = 0;

    results.forEach(item => {
      if (!item || item.media_type !== "image") return;

      const div = document.createElement("div");
      div.classList.add("preview-thumb");
      div.style.backgroundImage = `url(${item.url})`;
      apodGrid.appendChild(div);

      loaded++;
    });

    // If nothing loaded, show fallback
    if (loaded === 0) {
      apodGrid.innerHTML = `
        <div class="preview-unavailable">
          APOD data unavailable
        </div>
      `;
    }

  } catch (err) {
    console.error("APOD preview failed:", err);
    apodGrid.innerHTML = `
      <div class="preview-unavailable">
        APOD data unavailable
      </div>
    `;
  }
}

// ================= EPIC PREVIEW =================
async function loadEpicPreview() {
  if (!epicGrid) return;

  try {
    const res = await fetch(`https://api.nasa.gov/EPIC/api/natural?api_key=${API_KEY}`);
    const data = await safeJson(res);

    if (!data || !Array.isArray(data)) {
      epicGrid.innerHTML = `
        <div class="preview-unavailable">
          EPIC data unavailable
        </div>
      `;
      return;
    }

    const latest = data.slice(0, 3);

    epicGrid.innerHTML = "";

    latest.forEach(item => {
      const date = item.date.split(" ")[0].replace(/-/g, "/");
      const imgUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date}/jpg/${item.image}.jpg`;

      const div = document.createElement("div");
      div.classList.add("preview-thumb");
      div.style.backgroundImage = `url(${imgUrl})`;
      epicGrid.appendChild(div);
    });

  } catch (err) {
    console.error("EPIC preview failed:", err);
    epicGrid.innerHTML = `
      <div class="preview-unavailable">
        EPIC data unavailable
      </div>
    `;
  }
}

// ================= RUN BOTH =================
loadApodPreview();
loadEpicPreview();