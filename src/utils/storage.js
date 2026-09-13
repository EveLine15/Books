const FAVORITES_KEY = "favorite_books";

/**
 * Receive the list of all favorites books
 * @returns {Array} The array of books
 */
export function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Ошибка чтения из localStorage:", error);
    return [];
  }
}

/**
 * Check if the book is from favorites
 * @param {string} bookKey - Book's id
 * @returns {boolean}
 */
export function isFavorite(bookKey) {
  const favorites = getFavorites();
  return favorites.some((book) => book.key === bookKey);
}

/**
 * Add the book into favorites
 * @param {Object} book - A book's object
 */
export function addFavorite(book) {
  try {
    const favorites = getFavorites();

    if (!isFavorite(book.key)) {
      favorites.push(book);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error("Ошибка сохранения в localStorage:", error);
  }
}

/**
 * Remove the book from favorites
 * @param {string} bookKey - Book's id
 */
export function removeFavorite(bookKey) {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter((book) => book.key !== bookKey);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error("Ошибка удаления из localStorage:", error);
  }
}

/**
 * Toggle book's status in favorites list
 * @param {Object} book - Book's object
 * @returns {boolean} New state
 */
export function toggleFavorite(book) {
  if (isFavorite(book.key)) {
    removeFavorite(book.key);
    return false;
  } else {
    addFavorite(book);
    return true;
  }
}
