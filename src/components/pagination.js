import { goToPage } from "../utils/router";
import { LIMIT_PER_PAGE } from "../utils/constants";

/**
 * Calculates the array of page numbers and ellipsis indicators for pagination controls.
 *
 * Generates a windowed range around the current page, always preserving the first
 * and last page numbers, and inserting `"..."` strings for gaps larger than one page.
 *
 * @param {number} totalPages - The total number of available pages.
 * @param {number} currentPage - The current active page number (1-indexed).
 * @returns {Array<number|string>} An array containing page numbers and `"..."` placeholders.
 */
function getPaginationRange(totalPages, currentPage) {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  let l;
  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

/**
 * Render pagination component
 * @param {HTMLElement} container - Container, where the component should be followed
 * @param {number} totalBooks - Total amount of books
 * @param {number} currentPage - Current chosen page
 */
export function createPagination(container, totalBooks = 0, currentPage = 1) {
  const existingPagination = document.querySelector(".pagination");
  if (existingPagination) {
    existingPagination.remove();
  }

  const totalPages = Math.ceil(totalBooks / LIMIT_PER_PAGE);

  if (totalPages <= 1) return;

  const pageRange = getPaginationRange(totalPages, currentPage);

  const pagination = document.createElement("nav");
  pagination.className = "pagination";
  pagination.setAttribute("aria-label", "Пагинация результатов");

  const pagesHTML = pageRange
    .map((page) => {
      if (page === "...") {
        return `<span class="pagination-ellipsis">&hellip;</span>`;
      }
      const isActive = page === currentPage;
      return `
        <button 
          class="pagination-page ${isActive ? "active" : ""}" 
          data-page="${page}"
          ${isActive ? 'aria-current="page"' : ""}
        >
          ${page}
        </button>
      `;
    })
    .join("");

  pagination.innerHTML = `
    <button 
      class="pagination-btn pagination-prev" 
      data-page="${currentPage - 1}"
      ${currentPage <= 1 ? "disabled" : ""} 
      aria-label="Предыдущая страница"
    >
      <svg class="pagination-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <span>Назад</span>
    </button>

    <div class="pagination-pages">
      ${pagesHTML}
    </div>

    <button 
      class="pagination-btn pagination-next" 
      data-page="${currentPage + 1}"
      ${currentPage >= totalPages ? "disabled" : ""} 
      aria-label="Следующая страница"
    >
      <span>Вперед</span>
      <svg class="pagination-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;

  pagination.addEventListener("click", (e) => {
    const targetButton = e.target.closest("[data-page]");
    if (!targetButton || targetButton.hasAttribute("disabled")) return;

    const targetPage = parseInt(targetButton.dataset.page, 10);
    if (targetPage && targetPage !== currentPage) {
      goToPage(targetPage);
    }
  });

  container.after(pagination);
}
