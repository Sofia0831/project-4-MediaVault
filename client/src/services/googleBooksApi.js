import { API_BASE_URL } from "./apiConfig";

const BASE_URL = `${API_BASE_URL}/media/books`;

/**
 * Normalizes book data so image links use HTTPS and fallbacks exist
 */
const formatBookItem = (item) => {
  if (!item.volumeInfo) {
    const coverId = item.cover_i || item.covers?.[0];
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
      thumbnail: coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : "https://via.placeholder.com/128x192?text=No+Cover",
    };
  }

  const volumeInfo = item.volumeInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};

  const thumbnail = imageLinks.thumbnail
    ? imageLinks.thumbnail.replace("http://", "https://")
    : imageLinks.smallThumbnail
    ? imageLinks.smallThumbnail.replace("http://", "https://")
    : "https://via.placeholder.com/128x192?text=No+Cover";

  return {
    id: item.lending_edition_s,
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
export const getPopularBooks = async (page = 1, maxResults = 20) => {
  try {
    const response = await fetch(
      `${BASE_URL}/popular?page=${page}&limit=${maxResults}`,
      { credentials: "include" }
    );
    if (!response.ok) throw new Error("Failed to fetch books");

    const data = await response.json();
    const items = data.docs || data.items || data.works || [];

    return {
      results: items.map(formatBookItem),
      totalItems: data.numFound || data.totalItems || items.length,
      totalPages: Math.max(
        1,
        Math.ceil((data.numFound || data.totalItems || items.length) / maxResults)
      ),
    };
  } catch (error) {
    console.error("Books Fetch Error:", error);
    return { results: [], totalItems: 0, totalPages: 1 };
  }
};

/**
 * Search books by query
 */
export const searchBooks = async (query, page = 1, maxResults = 20) => {
  if (!query.trim()) return getPopularBooks(page, maxResults);

  try {
    const response = await fetch(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&limit=${maxResults}`,
      { credentials: "include" }
    );
    if (!response.ok) throw new Error("Failed to search books");

    const data = await response.json();
    const items = data.docs || data.items || data.works || [];

    return {
      results: items.map(formatBookItem),
      totalItems: data.numFound || data.totalItems || items.length,
      totalPages: Math.max(
        1,
        Math.ceil((data.numFound || data.totalItems || items.length) / maxResults)
      ),
    };
  } catch (error) {
    console.error("Books Search Error:", error);
    return { results: [], totalItems: 0, totalPages: 1 };
  }
};

/**
 * Fetch info for a single book 
 */
export const getBookDetails = async (bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/${bookId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch book details");
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
            const response = await fetch(`${BASE_URL}${authorPath}`, {
              credentials: "include",
            });

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

      const response2 = await fetch(`${BASE_URL}${workPath}`, {
        credentials: "include",
      });

      if (response2.ok) {
        const work = await response2.json();
        item.description = work.description;
      }
    }

    return formatBookItem(item);
  } catch (error) {
    console.error("Books Fetch Details Error:", error);
    return null;
  }
};