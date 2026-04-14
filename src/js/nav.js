export function initNav() {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navList = document.getElementById("nav-list");

  if (!hamburgerBtn || !navList) return;

  hamburgerBtn.addEventListener("click", () => {
    navList.classList.toggle("open");

    const expanded =
      hamburgerBtn.getAttribute("aria-expanded") === "true" || false;
    hamburgerBtn.setAttribute("aria-expanded", !expanded);
  });
}