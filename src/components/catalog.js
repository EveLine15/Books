import { createBookCard } from "./bookCard.js";
import { createPagination } from "./pagination.js";
import { createError } from "./error.js";

/**
 * Catalog component
 * @param {HTMLElement} container - Component for render into
 * @param {Object} props - Catalog's data
 * @param {Array} props.books - Book's array
 * @param {number} props.totalBooks - Total amount of books
 * @param {number} props.currentPage - Current page
 * @param {boolean} props.isLoading - Loading flag
 * @param {Function} props.onRetry - A function an page's retry
 */
export function renderBookCatalog(
  container,
  { books, totalBooks, currentPage, isLoading, error, onRetry },
) {
  if (isLoading) {
    container.innerHTML = '<p class="state-message">Загрузка данных...</p>';
    return;
  }

  if (error) {
    createError(container, error, onRetry);
    return;
  }

  if (!books || books.length === 0) {
    createError(container, "Книги по вашему запросу не найдены.");
    return;
  }

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  books.forEach((book) => {
    fragment.appendChild(createBookCard(book));
  });

  container.appendChild(fragment);

  createPagination(container, totalBooks, currentPage);
}
