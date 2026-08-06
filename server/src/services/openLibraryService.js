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


openLibraryService.getAuthor = (authorId) =>
  apiClient(
    `${BASE}/authors/${authorId}.json`
  );

/* *****************************
 * Popular Books
 * ***************************** */
openLibraryService.getPopularBooks = (page = 1, limit = 20) => {
  const offset = (page - 1) * limit; 
  return apiClient(
    `${BASE}/search.json?q=bestseller&limit=${limit}&offset=${offset}`
  );
};


/* *****************************
 * Recommendations
 * ***************************** */
openLibraryService.getRecommendations = () =>
  apiClient(
    `${BASE}/subjects/fiction.json?limit=20`
  );

export default openLibraryService;