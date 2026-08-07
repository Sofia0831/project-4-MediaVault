import apiClient from "../utils/apiClient.js";
import { normalizeOpenLibraryCoverId } from "../utils/bookCovers.js";

const BASE = "https://openlibrary.org";

const openLibraryService = {};

const sanitizeBookCoverIds = (book) => {
  if (!book || typeof book !== "object") return book;

  const sanitized = { ...book };
  if (Object.prototype.hasOwnProperty.call(book, "cover_i")) {
    sanitized.cover_i = normalizeOpenLibraryCoverId(book.cover_i);
  }
  if (Object.prototype.hasOwnProperty.call(book, "cover_id")) {
    sanitized.cover_id = normalizeOpenLibraryCoverId(book.cover_id);
  }
  if (Array.isArray(book.covers)) {
    sanitized.covers = book.covers
      .map(normalizeOpenLibraryCoverId)
      .filter(Boolean);
  }
  return sanitized;
};

const sanitizeBookCollection = (data) => {
  if (!data || typeof data !== "object") return data;
  const sanitized = { ...data };
  for (const key of ["docs", "works", "items"]) {
    if (Array.isArray(data[key])) {
      sanitized[key] = data[key].map(sanitizeBookCoverIds);
    }
  }
  return sanitized;
};

/* *****************************
 * Search Books
 * ***************************** */
openLibraryService.searchBooks = async (query, page = 1, limit = 20, subject) => {
  const offset = (page - 1) * limit;
  const subjectParam = subject
    ? `&subject=${encodeURIComponent(subject)}`
    : "";
  const data = await apiClient(
    `${BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}${subjectParam}`
  );
  return sanitizeBookCollection(data);
};

/* *****************************
 * Book Details
 * ***************************** */
openLibraryService.getBook = async (workId) =>
  sanitizeBookCoverIds(await apiClient(
    `${BASE}/works/${workId}.json`
  ));


openLibraryService.getAuthor = (authorId) =>
  apiClient(
    `${BASE}/authors/${authorId}.json`
  );

/* *****************************
 * Popular Books
 * ***************************** */
openLibraryService.getPopularBooks = async (page = 1, limit = 20, subject) => {
  const offset = (page - 1) * limit; 
  const subjectParam = subject
    ? `&subject=${encodeURIComponent(subject)}`
    : "";
  const data = await apiClient(
    `${BASE}/search.json?q=bestseller&limit=${limit}&offset=${offset}${subjectParam}`
  );
  return sanitizeBookCollection(data);
};


/* *****************************
 * Recommendations
 * ***************************** */
openLibraryService.getRecommendations = async () =>
  sanitizeBookCollection(await apiClient(
    `${BASE}/subjects/fiction.json?limit=20`
  ));

export default openLibraryService;
