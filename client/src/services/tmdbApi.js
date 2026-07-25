const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`);
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
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
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
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch movie details");
    return await response.json();
  } catch (error) {
    console.error("TMDB Fetch Movie Details Error:", error);
    return null;
  }
};