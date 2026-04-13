import { downloadImage } from "./utils.js";

const API_KEY = "7uLHHdvit0KavMYJnXO4jPcKbpIRCpoB5xX52H9O";

const apodContainer = document.getElementById("apod-container");
const dateInput = document.getElementById("apod-date");
const loadBtn = document.getElementById("apod-load-btn");

// -------------------------------
// INITIAL LOAD — TODAY'S APOD
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    if (dateInput) dateInput.value = today;
    fetchAPOD(today);
});

// -------------------------------
// LOAD BUTTON HANDLER
// -------------------------------
if (loadBtn) {
    loadBtn.addEventListener("click", () => {
        if (!dateInput.value) return;
        fetchAPOD(dateInput.value);
    });
}

// -------------------------------
// FETCH APOD
// -------------------------------
async function fetchAPOD(date) {
    showLoading();

    try {
        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch APOD");
        }

        const data = await response.json();
        renderAPOD(data);

    } catch (error) {
        console.error(error);
        showError("Unable to load APOD right now. Try another date.");
    }
}

// -------------------------------
// RENDER APOD INTO TWO-COLUMN UI
// -------------------------------
function renderAPOD(data) {
    const isVideo = data.media_type === "video";

    apodContainer.innerHTML = `
        <div class="apod-media">
            ${
                isVideo
                    ? `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`
                    : `<img src="${data.url}" alt="${data.title}">`
            }
        </div>

        <div class="apod-info">
            <h2 class="apod-title">${data.title}</h2>
            <p class="apod-date">${data.date}</p>

            <p class="apod-description">${data.explanation}</p>

            <p class="apod-meta">
                ${data.copyright ? `© ${data.copyright}` : "Public Domain"}
            </p>

            <button class="apod-save-btn"
                data-url="${data.url}"
                data-title="${data.title}"
                data-date="${data.date}">
                Save to Favorites
            </button>

            ${
                !isVideo
                    ? `<button class="btn secondary" id="download-btn">Download Image</button>`
                    : ""
            }
        </div>
    `;
    if (!isVideo) {
        const img = document.querySelector(".apod-media img");
        img.addEventListener("click", () => {
            openModal(data.url, data.title);
        });
    }

    // Attach Save button
    document.querySelector(".apod-save-btn")
        .addEventListener("click", saveFavorite);

    // Attach Download button (if image)
    if (!isVideo) {
        document.getElementById("download-btn")
            .addEventListener("click", () => downloadImage(data.url, data.title));
    }
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
        type: "APOD"
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
// LOADING SHIMMER
// -------------------------------
function showLoading() {
    apodContainer.innerHTML = `
        <div class="apod-loading"></div>
        <div class="apod-loading"></div>
    `;
}

// -------------------------------
// ERROR STATE
// -------------------------------
function showError(message) {
    apodContainer.innerHTML = `
        <div class="apod-info">
            <h2 class="apod-title">Error</h2>
            <p class="apod-description">${message}</p>
        </div>
    `;
}