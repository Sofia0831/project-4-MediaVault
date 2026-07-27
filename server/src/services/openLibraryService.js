import apiClient from "../utils/apiClient.js";

const BASE = "https://openlibrary.org";

const openLibraryService = {};

/* *****************************
 * Search Books
 * ***************************** */
openLibraryService.searchBooks = (query) =>
  apiClient(
    `${BASE}/search.json?q=${encodeURIComponent(query)}`
  );

/* *****************************
 * Book Details
 * ***************************** */
openLibraryService.getBook = (workId) =>
  apiClient(
    `${BASE}/works/${workId}.json`
  );

/* *****************************
 * Popular Books
 * ***************************** */
openLibraryService.getPopularBooks = () =>
  apiClient(
    `${BASE}/search.json?q=bestseller&limit=20`
  );

/* *****************************
 * Recommendations
 * ***************************** */
openLibraryService.getRecommendations = () =>
  apiClient(
    `${BASE}/subjects/fiction.json?limit=20`
  );

export default openLibraryService;