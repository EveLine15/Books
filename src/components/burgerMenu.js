export function initBurgerMenu() {
  const burgerBtn = document.querySelector("#burger-btn");
  const navLinks = document.querySelector("#nav-links");

  if (!burgerBtn || !navLinks) return;

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle("open");
    burgerBtn.classList.toggle("active", isOpen);
    burgerBtn.setAttribute("aria-expanded", isOpen);
  }

  function closeMenu() {
    navLinks.classList.remove("open");
    burgerBtn.classList.remove("active");
    burgerBtn.setAttribute("aria-expanded", "false");
  }

  burgerBtn.addEventListener("click", toggleMenu);

  navLinks.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".app-header")) {
      closeMenu();
    }
  });
}
