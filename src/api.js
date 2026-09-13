import { LIMIT_PER_PAGE } from "./utils/constants";

const BASE_URL = "https://openlibrary.org";

/**
 * Fetches books filtered by title and/or author from Open Library API.
 *
 * @param {Object} filters
 * @param {string} [filters.title=""] - Book title search query.
 * @param {string} [filters.author=""] - Author search query.
 * @param {number} [page=1] - Page number.
 */
export async function fetchBooks({ title = "", author = "" }, page = 1) {
  const titleQuery = title.trim()
    ? `title:${encodeURIComponent(title.trim())}`
    : "title:*";
  const authorQuery = author.trim()
    ? `author:${encodeURIComponent(author.trim())}`
    : "author:*";
  const searchQuery = `${titleQuery} ${authorQuery}`;

  const response = await fetch(
    `${BASE_URL}/search.json?q=${searchQuery}&page=${page}&limit=${LIMIT_PER_PAGE}`,
  );

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  const data = await response.json();

  return {
    books: data.docs,
    totalBooks: data.numFound,
    currentPage: page,
  };
}

/**
 * Fetches popular or trending books by subject from the Open Library Subjects API.
 *
 * @async
 * @param {string} [subject="bestsellers"] - The subject/category identifier to fetch.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of work objects.
 * @throws {Error} Throws an error if the network request fails or returns a non-200 status.
 */
export async function fetchTrendingBooks(subject = "bestsellers") {
  try {
    const response = await fetch(`${BASE_URL}/subjects/${subject}.json`);

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    return data.works;
  } catch (error) {
    console.error("Ошибка при загрузке подборки:", error);
    throw error;
  }
}
