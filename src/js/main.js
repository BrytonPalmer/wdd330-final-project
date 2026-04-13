document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});