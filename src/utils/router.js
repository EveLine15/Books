import { renderCatalogPage, updateCatalogPage } from "../pages/catalogPage.js";
import { renderFavoritesPage } from "../pages/favoritesPage.js";

const outlet = document.querySelector("#outlet");
const navLinks = document.querySelectorAll(".nav-link");

let currentRoutePath = null;

export function getCatalogStateFromURL() {
  const hash = window.location.hash;
  const queryString = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryString);

  return {
    title: params.get("title") || "",
    author: params.get("author") || "",
    page: parseInt(params.get("page"), 10) || 1,
  };
}

export function goToPage(newPage) {
  const { title, author } = getCatalogStateFromURL();
  const params = new URLSearchParams();

  if (title) params.set("title", title);
  if (author) params.set("author", author);
  params.set("page", newPage);

  window.location.hash = `#catalog?${params.toString()}`;
}

const routes = {
  "#catalog": renderCatalogPage,
  "#favorites": renderFavoritesPage,
};

function handleRoute() {
  const fullHash = window.location.hash || "#catalog";
  const path = fullHash.split("?")[0];

  if (path === currentRoutePath && path === "#catalog") {
    updateCatalogPage();
    updateActiveNavLinks(path);
    return;
  }

  currentRoutePath = path;
  const renderPage = routes[path] || renderCatalogPage;

  if (outlet) {
    outlet.innerHTML = "";
    renderPage(outlet);
  }

  updateActiveNavLinks(path);
}

function updateActiveNavLinks(activePath) {
  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href").split("?")[0];
    link.classList.toggle("active", linkPath === activePath);
  });
}

export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  window.addEventListener("DOMContentLoaded", handleRoute);
}
