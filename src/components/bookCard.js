import { isFavorite } from "../utils/storage";
import { heart, cross } from "../assets/icons";

/**
 * Render book's card component
 * @param {Object} book - Book's data
 * @returns {HTMLElement} Book's card html
 */
export function createBookCard(book, isFavoritePage) {
  const card = document.createElement("article");
  card.className = "book-card";

  card.dataset.bookData = JSON.stringify(book);

  const title = book.title || "Без названия";

  let authors = "Автор не указан";
  if (book.author_name) {
    authors = book.author_name.join(", ");
  } else if (book.authors && book.authors.length > 0) {
    authors = book.authors.map((a) => a.name).join(", ");
  }

  const year =
    book.first_publish_year ||
    (book.publish_date ? book.publish_date[0] : null);

  const coverId = book.cover_i || book.cover_id;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

  const activeClass = isFavorite(book.key) ? "active" : "";

  const coverHTML = coverUrl
    ? `<img src="${coverUrl}" alt="${title}" class="book-cover" loading="lazy" />`
    : `<div class="book-cover-placeholder">
        <span class="placeholder-icon">📖</span>
        <span class="placeholder-text">Обложка отсутствует</span>
       </div>`;

  card.innerHTML = `
    <div class="book-cover-wrapper">
      ${coverHTML}
    </div>
    <div class="book-content">
      <h3 class="book-title" title="${title}">${title}</h3>
      <p class="book-author" title="${authors}">${authors}</p>
      
      <div class="book-footer">
        <span class="book-year">${year ? `${year} г.` : "Год н/д"}</span>
        
        <button 
          class="btn-favorite ${activeClass}"
          aria-label="Добавить в избранное" 
          data-key="${book.key}"
        >
        ${isFavoritePage ? cross() : heart()}
        
        </button>
      </div>
    </div>
  `;

  return card;
}
