const favoritesContainer = document.getElementById("favorites-container");
const emptyState = document.getElementById("favorites-empty");
const clearBtn = document.getElementById("clear-favorites-btn");

// -------------------------------
// INITIAL LOAD
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();
});

// -------------------------------
// LOAD FAVORITES FROM LOCALSTORAGE
// -------------------------------
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Handle empty state
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");
    favoritesContainer.innerHTML = "";

    favorites.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("favorite-card");

        card.innerHTML = `
            <img src="${item.url}" alt="${item.title}" class="favorite-thumb">

            <h3 class="favorite-title">${item.title}</h3>
            <p class="favorite-date">${item.date}</p>
            <p class="favorite-type">${item.type}</p>

            <button class="favorite-remove-btn" data-index="${index}">
                Remove
            </button>
        `;

        favoritesContainer.appendChild(card);
    });

    // Attach remove listeners
    document.querySelectorAll(".favorite-remove-btn").forEach(btn => {
        btn.addEventListener("click", removeFavorite);
    });
}

// -------------------------------
// REMOVE A SINGLE FAVORITE
// -------------------------------
function removeFavorite(e) {
    const index = e.target.dataset.index;

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavorites();
}

// -------------------------------
// CLEAR ALL FAVORITES
// -------------------------------
if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        localStorage.removeItem("favorites");
        loadFavorites();
    });
}