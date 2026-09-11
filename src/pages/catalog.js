import { fetchBooks, fetchTrendingBooks } from "../api.js";
import { createBookCard } from "../components/bookCard.js";
import { debounce } from "../utils/debounce.js";
import { toggleFavorite } from "../utils/storage.js";
import { createError } from "../components/error.js";
import { createPagination } from "../components/pagination.js";
import { getCatalogStateFromURL } from "../utils/router.js";

/**
 * Render catalog page
 * @param {HTMLElement} container - #outlet
 */
export function renderCatalogPage(container) {
  container.innerHTML = `
    <section class="catalog-section">
        <h1>Каталог книг</h1>
        <form id="search-form" onsubmit="return false;">
          <input 
            type="search" 
            id="search-input" 
            class="search-input" 
            placeholder="Поиск книги или автора..." 
            autocomplete="off"
          />
        </form>

        <div id="books-list" class="books-grid"></div>
    </section>
  `;

  const searchInput = container.querySelector("#search-input");
  const booksList = container.querySelector("#books-list");

  function renderBookCatalog(books) {
    booksList.innerHTML = "";
    if (!books || books.length === 0) {
      createError(booksList, "Книги по вашему запросу не найдены.");
      return;
    }

    const fragment = document.createDocumentFragment();
    books.forEach((book) => {
      fragment.appendChild(createBookCard(book));
    });
    booksList.appendChild(fragment);
  }

  async function loadInitialData() {
    booksList.innerHTML =
      '<p class="state-message">Загрузка популярного...</p>';
    createPagination(booksList, 0, 1);

    try {
      const books = await fetchTrendingBooks("bestsellers");
      renderBookCatalog(books);
    } catch (error) {
      console.error(error);
      createError(booksList, "Не удалось загрузить подборку.", loadInitialData);
    }
  }

  async function syncViewWithURL() {
    const { query, page } = getCatalogStateFromURL();

    if (searchInput.value !== query) {
      searchInput.value = query;
    }

    if (!query) {
      await loadInitialData();
      return;
    }

    booksList.innerHTML = '<p class="state-message">Поиск книг...</p>';

    try {
      const data = await fetchBooks(query, page);

      renderBookCatalog(data.books);
      createPagination(booksList, data.totalBooks, page);
    } catch (error) {
      console.error(error);
      createError(
        booksList,
        "Не удалось загрузить результаты поиска.",
        syncViewWithURL,
      );
    }
  }

  const handleInput = debounce(() => {
    const query = searchInput.value.trim();

    if (query) {
      window.location.hash = `#catalog?q=${encodeURIComponent(query)}&page=1`;
    } else {
      window.location.hash = "#catalog";
    }
  }, 300);

  searchInput.addEventListener("input", handleInput);

  booksList.addEventListener("click", (e) => {
    const favButton = e.target.closest("[data-key]");
    if (!favButton) return;

    const cardElement = favButton.closest(".book-card");
    if (!cardElement) return;

    const bookData = JSON.parse(cardElement.dataset.bookData);
    const isNowFavorite = toggleFavorite(bookData);

    favButton.classList.toggle("active", isNowFavorite);
  });

  syncViewWithURL();
}
