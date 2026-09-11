import { LIMIT_PER_PAGE } from "./utils/constants";

const BASE_URL = "https://openlibrary.org";

export async function fetchBooks(query, page = 1) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${LIMIT_PER_PAGE}`,
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
