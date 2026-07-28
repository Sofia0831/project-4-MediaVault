const BASE_URL = "http://localhost:5050/api/media/books";

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
      id: String(item.key || item.id || "").replace("/works/", ""),
      title: item.title || "Untitled",
      authors: item.author_name || ["Unknown Author"],
      publisher: item.publisher?.[0] || "Unknown Publisher",
      publishedDate: item.first_publish_year || item.first_publish_date || "N/A",
      description: description || "No description available.",
      pageCount: item.number_of_pages_median || item.number_of_pages || 0,
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
    const response = await fetch(`${BASE_URL}/popular`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch books");
    
    const data = await response.json();
    const items = data.docs || data.items || [];

    return {
      results: items.map(formatBookItem),
      totalItems: data.numFound || data.totalItems || items.length,
      totalPages: Math.max(
        1,
        Math.ceil((data.numFound || data.totalItems || items.length) / maxResults)
      ),
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
    const response = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to search books");

    const data = await response.json();
    const items = data.docs || data.items || [];

    return {
      results: items.map(formatBookItem),
      totalItems: data.numFound || data.totalItems || items.length,
      totalPages: Math.max(
        1,
        Math.ceil((data.numFound || data.totalItems || items.length) / maxResults)
      ),
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
    const response = await fetch(`${BASE_URL}/${bookId}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch book details");

    const item = await response.json();
    return formatBookItem(item);
  } catch (error) {
    console.error("Google Books Fetch Details Error:", error);
    return null;
  }
};
