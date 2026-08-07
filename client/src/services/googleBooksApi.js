import { API_BASE_URL } from "./apiConfig";
import {
  buildOpenLibraryCoverUrl,
  normalizeBookCoverUrl,
  normalizeOpenLibraryCoverId,
} from "../utils/bookCovers";

const BASE_URL = `${API_BASE_URL}/media/books`;

const bookRequest = async (url) => {
  try {
    return await fetch(url, { credentials: "include" });
  } catch (error) {
    throw new Error(
      "Unable to reach MediaVault. Check your connection and try again.",
      { cause: error }
    );
  }
};

/**
 * Normalizes book data so image links use HTTPS and fallbacks exist
 */
const formatBookItem = (item) => {
  if (!item.volumeInfo) {
    const coverId = [item.cover_i, item.cover_id, ...(item.covers || [])]
      .map(normalizeOpenLibraryCoverId)
      .find(Boolean);
    const description =
      typeof item.description === "object"
        ? item.description.value
        : item.description;

    return {
      id: String(item.lending_edition_s || item.key || "").replace("/works/", ""),
      title: item.title || "Untitled",
      authors: item.author_name || ["Unknown Author"],
      description: description || "No description available.",
      categories: item.subject || item.subjects || [],
      averageRating: null,
      ratingsCount: 0,
      thumbnail: buildOpenLibraryCoverUrl(coverId),
    };
  }

  const volumeInfo = item.volumeInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};

  const thumbnail = normalizeBookCoverUrl(imageLinks.thumbnail
    ? imageLinks.thumbnail.replace("http://", "https://")
    : imageLinks.smallThumbnail
    ? imageLinks.smallThumbnail.replace("http://", "https://")
    : null);

  return {
    id: item.id,
    title: volumeInfo.title || "Untitled",
    authors: volumeInfo.authors || ["Unknown Author"],
    description: volumeInfo.description || "No description available.",
    categories: volumeInfo.categories || [],
    averageRating: volumeInfo.averageRating || null,
    ratingsCount: volumeInfo.ratingsCount || 0,
    thumbnail,
  };
};

/**
 * Popular books for initial load on search page
 */
const parseBooksResponse = async (response, maxResults, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || fallbackMessage);
  const items = data.docs || data.items || data.works || [];

  return {
    results: items.map(formatBookItem),
    totalItems: data.numFound || data.totalItems || items.length,
    totalPages: Math.max(
      1,
      Math.ceil((data.numFound || data.totalItems || items.length) / maxResults)
    ),
  };
};

export const getPopularBooks = async (page = 1, maxResults = 20, subject = "") => {
  const subjectParam = subject ? `&subject=${encodeURIComponent(subject)}` : "";
  const response = await bookRequest(
    `${BASE_URL}/popular?page=${page}&limit=${maxResults}${subjectParam}`
  );
  return parseBooksResponse(
    response,
    maxResults,
    "Unable to load books. Please try again."
  );
};

/**
 * Search books by query
 */
export const searchBooks = async (query, page = 1, maxResults = 20, subject = "") => {
  if (!query.trim()) return getPopularBooks(page, maxResults, subject);
  const subjectParam = subject ? `&subject=${encodeURIComponent(subject)}` : "";
  const response = await bookRequest(
    `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&limit=${maxResults}${subjectParam}`
  );
  return parseBooksResponse(
    response,
    maxResults,
    "Unable to search books. Please try again."
  );
};

/**
 * Fetch info for a single book 
 */
export const getBookDetails = async (bookId) => {
  try {
    const response = await bookRequest(`${BASE_URL}/${bookId}`);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Unable to load book details. Please try again.");
    }

    const item = await response.json();

    // Fetch author names
    const authorRefs =
      item.authors?.map((author) => author.key || author.author?.key) ||
      item.author_key?.map((key) => `/authors/${key}`) ||
      [];

    if (authorRefs.length > 0) {
      const authorNames = await Promise.all(
        authorRefs.map(async (authorPath) => {
          try {
            const response = await bookRequest(`${BASE_URL}${authorPath}`);

            if (!response.ok) return null;

            const author = await response.json();
            return author.name;
          } catch {
            return null;
          }
        })
      );

      item.author_name = authorNames.filter(Boolean);
    }

    // Fetch work description
    if (item.works?.length) {
      const workPath = item.works[0].key.replace("/works", "");

      const response2 = await bookRequest(`${BASE_URL}${workPath}`);

      if (response2.ok) {
        const work = await response2.json();
        item.description = work.description;
      }
    }

    return formatBookItem(item);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to reach MediaVault. Check your connection and try again.",
        { cause: error }
      );
    }
    throw error;
  }
};
