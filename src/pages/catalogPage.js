import { fetchBooks, fetchTrendingBooks } from "../api.js";
import { debounce } from "../utils/debounce.js";
import { toggleFavorite } from "../utils/storage.js";
import { getCatalogStateFromURL } from "../utils/router.js";
import { renderBookCatalog } from "../components/catalog.js";

let currentUpdateGridFn = null;

/**
 * Render catalog page
 * @param {HTMLElement} container - #outlet
 */
export function renderCatalogPage(container) {
  container.innerHTML = `
    <section class="catalog-section">
        <h1>Каталог книг</h1>
        <form id="search-form" class="search-form">
          <input 
            type="text" 
            id="search-input" 
            class="search-input" 
            placeholder="Поиск книги..." 
            autocomplete="off"
          />
          <input 
            type="text" 
            id="search-input-author" 
            class="search-input" 
            placeholder="Поиск автора..." 
            autocomplete="off"
          />
        </form>

        <div id="books-container" class="books-grid"></div>
    </section>
  `;

  const searchInput = container.querySelector("#search-input");
  const searchInputAuthor = container.querySelector("#search-input-author");
  const booksContainer = container.querySelector("#books-container");

  currentUpdateGridFn = async function updateGrid() {
    const { title, author, page } = getCatalogStateFromURL();

    if (document.activeElement !== searchInput) {
      searchInput.value = title;
    }
    if (document.activeElement !== searchInputAuthor) {
      searchInputAuthor.value = author;
    }

    if (!title && !author) {
      renderBookCatalog(booksContainer, { isLoading: true });
      try {
        const books = await fetchTrendingBooks("bestsellers");
        renderBookCatalog(booksContainer, {
          books,
          totalBooks: 0,
          currentPage: 1,
        });
      } catch (err) {
        renderBookCatalog(booksContainer, {
          error: "Не удалось загрузить подборку.",
          onRetry: updateGrid,
        });
      }
      return;
    }

    renderBookCatalog(booksContainer, { isLoading: true });

    try {
      const data = await fetchBooks({ title, author }, page);
      renderBookCatalog(booksContainer, {
        books: data.books,
        totalBooks: data.totalBooks,
        currentPage: page,
      });
    } catch (err) {
      renderBookCatalog(booksContainer, {
        error: "Не удалось загрузить результаты поиска.",
        onRetry: updateGrid,
      });
    }
  };

  const handleInput = debounce(() => {
    const titleVal = searchInput.value.trim();
    const authorVal = searchInputAuthor.value.trim();

    const params = new URLSearchParams();
    if (titleVal) params.set("title", titleVal);
    if (authorVal) params.set("author", authorVal);

    let newHash = "#catalog";
    if (titleVal || authorVal) {
      params.set("page", "1");
      newHash = `#catalog?${params.toString()}`;
    }

    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
  }, 300);

  searchInput.addEventListener("input", handleInput);
  searchInputAuthor.addEventListener("input", handleInput);

  booksContainer.addEventListener("click", (e) => {
    const favButton = e.target.closest("[data-key]");
    if (!favButton) return;

    const cardElement = favButton.closest(".book-card");
    if (!cardElement) return;

    const bookData = JSON.parse(cardElement.dataset.bookData);
    const isNowFavorite = toggleFavorite(bookData);

    favButton.classList.toggle("active", isNowFavorite);
  });

  currentUpdateGridFn();
}

export function updateCatalogPage() {
  if (typeof currentUpdateGridFn === "function") currentUpdateGridFn();
}
