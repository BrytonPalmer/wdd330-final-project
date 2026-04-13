const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");
const modalClose = document.getElementById("modal-close");

// Open modal
export function openModal(url, caption = "") {
    modalImg.src = url;
    modalCaption.textContent = caption;

    modal.classList.add("show");
}

// Close modal
export function closeModal() {
    modal.classList.remove("show");

    // Clear image after fade-out
    setTimeout(() => {
        modalImg.src = "";
        modalCaption.textContent = "";
    }, 250);
}

// Close on X click
modalClose.addEventListener("click", closeModal);

// Close on background click
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// Close on ESC key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});