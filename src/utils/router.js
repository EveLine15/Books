import { renderCatalogPage } from "../pages/catalog.js";
import { renderFavoritesPage } from "../pages/favorites.js";
import { LIMIT_PER_PAGE } from "./constants.js";

const outlet = document.querySelector("#outlet");
const navLinks = document.querySelectorAll(".nav-link");

export function getCatalogStateFromURL() {
  const hash = window.location.hash;
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);

  return {
    query: params.get("q") || "",
    page: parseInt(params.get("page"), 10) || 1,
  };
}

export function goToPage(newPage) {
  const { query } = getCatalogStateFromURL();
  const queryParam = query ? `q=${encodeURIComponent(query)}&` : "";
  window.location.hash = `#catalog?${queryParam}page=${newPage}&limit=${LIMIT_PER_PAGE}`;
}

const routes = {
  "#catalog": renderCatalogPage,
  "#favorites": renderFavoritesPage,
};

function handleRoute() {
  const hash = window.location.hash || "#catalog";
  const renderPage = routes[hash] || renderCatalogPage;

  if (outlet) {
    outlet.innerHTML = "";
    renderPage(outlet);
  }

  navLinks.forEach((link) => {
    const isCurrentRoute = link.getAttribute("href") === hash;
    link.classList.toggle("active", isCurrentRoute);
  });
}

export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  window.addEventListener("DOMContentLoaded", handleRoute);
}
