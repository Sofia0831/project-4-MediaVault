import { API_BASE_URL } from "./apiConfig";

const BASE_URL = `${API_BASE_URL}/media/movies`;
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/popular?page=${page}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch popular movies");
    const data = await response.json();
    return {
      results: data.results || [],
      totalPages: Math.min(data.total_pages || 1, 500)
    };
  } catch (error) {
    console.error("TMDB Fetch Popular Error:", error);
    return { results: [], totalPages: 1 };
  }
};

export const searchMovies = async (query, page = 1) => {
  if (!query.trim()) return getPopularMovies(page);
  try {
    const response = await fetch(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to search movies");
    const data = await response.json();
    return {
      results: data.results || [],
      totalPages: Math.min(data.total_pages || 1, 500)
    };
  } catch (error) {
    console.error("TMDB Search Error:", error);
    return { results: [], totalPages: 1 };
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/${movieId}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch movie details");
    return await response.json();
  } catch (error) {
    console.error("TMDB Fetch Movie Details Error:", error);
    return null;
  }
};
