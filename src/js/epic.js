const API_KEY = "7uLHHdvit0KavMYJnXO4jPcKbpIRCpoB5xX52H9O";

const epicContainer = document.getElementById("epic-container");
const dateInput = document.getElementById("epic-date");
const loadBtn = document.getElementById("epic-load-btn");

// -------------------------------
// INITIAL LOAD — MOST RECENT EPIC DAY
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
    showLoadingGrid();

    try {
        const res = await fetch(`https://api.nasa.gov/EPIC/api/natural?api_key=${API_KEY}`);
        const data = await res.json();

        if (!data.length) {
            showError("No EPIC images available.");
            return;
        }

        // Most recent date in the dataset
        const latestDate = data[0].date.split(" ")[0];
        dateInput.value = latestDate;

        fetchEPICByDate(latestDate);

    } catch (err) {
        console.error(err);
        showError("Unable to load EPIC images.");
    }
});

// -------------------------------
// LOAD BUTTON HANDLER
// -------------------------------
if (loadBtn) {
    loadBtn.addEventListener("click", () => {
        if (!dateInput.value) return;
        fetchEPICByDate(dateInput.value);
    });
}

// -------------------------------
// FETCH EPIC IMAGES FOR A DATE
// -------------------------------
async function fetchEPICByDate(date) {
    showLoadingGrid();

    try {
        const res = await fetch(
            `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${API_KEY}`
        );

        if (!res.ok) throw new Error("Failed to fetch EPIC data");

        const data = await res.json();

        if (!data.length) {
            showError("No EPIC images for this date.");
            return;
        }

        renderEPICGallery(data);

    } catch (err) {
        console.error(err);
        showError("Unable to load EPIC images for this date.");
    }
}

// -------------------------------
// RENDER EPIC GALLERY GRID
// -------------------------------
function renderEPICGallery(items) {
    epicContainer.innerHTML = "";

    items.forEach(item => {
        const [year, month, day] = item.date.split(" ")[0].split("-");

        const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${item.image}.png`;

        const card = document.createElement("div");
        card.classList.add("epic-card");

        card.innerHTML = `
            <img src="${imageUrl}" alt="EPIC Earth Image" class="epic-image">

            <p class="epic-timestamp">${item.date}</p>

            <button class="epic-save-btn"
                data-url="${imageUrl}"
                data-title="EPIC Earth Image"
                data-date="${item.date}">
                Save to Favorites
            </button>

            <button class="btn secondary epic-download-btn"
                data-url="${imageUrl}"
                data-title="${item.image}">
                Download
            </button>
        `;

        epicContainer.appendChild(card);

        card.querySelector(".epic-image").addEventListener("click", () => {
            openModal(imageUrl, item.caption);
        });
    });

    // Attach listeners
    document.querySelectorAll(".epic-save-btn").forEach(btn => {
        btn.addEventListener("click", saveFavorite);
    });

    document.querySelectorAll(".epic-download-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            downloadImage(btn.dataset.url, btn.dataset.title);
        });
    });
}

// -------------------------------
// SAVE TO FAVORITES
// -------------------------------
function saveFavorite(e) {
    const btn = e.target;

    const favorite = {
        url: btn.dataset.url,
        title: btn.dataset.title,
        date: btn.dataset.date,
        type: "EPIC"
    };

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Avoid duplicates
    if (!favorites.some(f => f.url === favorite.url)) {
        favorites.push(favorite);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    btn.textContent = "Saved!";
    btn.style.background = "var(--baby-blue)";
}

// -------------------------------
// DOWNLOAD IMAGE
// -------------------------------
function downloadImage(url, title) {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.png`;
    link.click();
}

// -------------------------------
// LOADING SHIMMER GRID
// -------------------------------
function showLoadingGrid() {
    epicContainer.innerHTML = `
        <div class="epic-loading"></div>
        <div class="epic-loading"></div>
        <div class="epic-loading"></div>
        <div class="epic-loading"></div>
    `;
}

// -------------------------------
// ERROR STATE
// -------------------------------
function showError(message) {
    epicContainer.innerHTML = `
        <div class="epic-card">
            <p class="body-text">${message}</p>
        </div>
    `;
}