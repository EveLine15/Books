import { createBookCard } from "../components/bookCard.js";
import { getFavorites, removeFavorite } from "../utils/storage.js";
import { createError } from "../components/error.js";

/**
 * Render favorites page
 * @param {HTMLElement} container - #outlet
 */
export function renderFavoritesPage(container) {
  const favorites = getFavorites();

  if (favorites.length === 0) {
    createError(
      container,
      "Здесь пока ничего нет. Добавляйте книги из каталога!",
    );
    return;
  }

  container.innerHTML = `
    <section class="favorites-section">
        <h1>Избранные книги</h1>
      <div class="books-grid" id="favorites-list"></div>
    </section>
  `;

  const favoritesList = container.querySelector("#favorites-list");

  favorites.forEach((book) => {
    const card = createBookCard(book, true);
    favoritesList.appendChild(card);
  });

  favoritesList.addEventListener("click", (e) => {
    const favButton = e.target.closest("[data-key]");
    if (!favButton) return;

    const bookKey = favButton.dataset.key;
    const cardElement = favButton.closest(".book-card");

    removeFavorite(bookKey);

    if (cardElement) {
      cardElement.remove();
    }

    const currentFavorites = getFavorites();
    const countBadge = container.querySelector(".favorites-count");
    if (countBadge) {
      countBadge.textContent = `Всего: ${currentFavorites.length}`;
    }

    if (currentFavorites.length === 0) {
      createError(
        container,
        "Здесь пока ничего нет. Добавляйте книги из каталога!",
      );
    }
  });
}
