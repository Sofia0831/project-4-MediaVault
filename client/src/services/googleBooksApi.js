const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || "";

/**
 * Normalizes book data so image links use HTTPS and fallbacks exist
 */
const formatBookItem = (item) => {
  const volumeInfo = item.volumeInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};

  const thumbnail = imageLinks.thumbnail
    ? imageLinks.thumbnail.replace("http://", "https://")
    : imageLinks.smallThumbnail
    ? imageLinks.smallThumbnail.replace("http://", "https://")
    : "https://via.placeholder.com/128x192?text=No+Cover";

  return {
    id: item.id,
    title: volumeInfo.title || "Untitled",
    authors: volumeInfo.authors || ["Unknown Author"],
    publisher: volumeInfo.publisher || "Unknown Publisher",
    publishedDate: volumeInfo.publishedDate || "N/A",
    description: volumeInfo.description || "No description available.",
    pageCount: volumeInfo.pageCount || 0,
    categories: volumeInfo.categories || [],
    averageRating: volumeInfo.averageRating || null,
    ratingsCount: volumeInfo.ratingsCount || 0,
    thumbnail,
  };
};

/**
 * Popular books for initial load on search page
 */
export const getPopularBooks = async (page = 1, maxResults = 12) => {
  try {
    const startIndex = (page - 1) * maxResults;
    const url = `${BASE_URL}?q=subject:fiction&orderBy=relevance&startIndex=${startIndex}&maxResults=${maxResults}${
      GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch books");
    
    const data = await response.json();
    const items = data.items || [];

    return {
      results: items.map(formatBookItem),
      totalItems: data.totalItems || 0,
      totalPages: Math.ceil((data.totalItems || 0) / maxResults),
    };
  } catch (error) {
    console.error("Google Books Fetch Error:", error);
    return { results: [], totalItems: 0, totalPages: 1 };
  }
};

/**
 * Search books by query
 */
export const searchBooks = async (query, page = 1, maxResults = 12) => {
  if (!query.trim()) return getPopularBooks(page, maxResults);

  try {
    const startIndex = (page - 1) * maxResults;
    const url = `${BASE_URL}?q=${encodeURIComponent(
      query
    )}&startIndex=${startIndex}&maxResults=${maxResults}${
      GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to search books");

    const data = await response.json();
    const items = data.items || [];

    return {
      results: items.map(formatBookItem),
      totalItems: data.totalItems || 0,
      totalPages: Math.ceil((data.totalItems || 0) / maxResults),
    };
  } catch (error) {
    console.error("Google Books Search Error:", error);
    return { results: [], totalItems: 0, totalPages: 1 };
  }
};

/**
 * Fetch info for a single book 
 */
export const getBookDetails = async (bookId) => {
  try {
    const url = `${BASE_URL}/${bookId}${
      GOOGLE_BOOKS_API_KEY ? `?key=${GOOGLE_BOOKS_API_KEY}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch book details");

    const item = await response.json();
    return formatBookItem(item);
  } catch (error) {
    console.error("Google Books Fetch Details Error:", error);
    return null;
  }
};