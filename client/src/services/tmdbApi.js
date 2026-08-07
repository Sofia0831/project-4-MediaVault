import { API_BASE_URL } from "./apiConfig";

const BASE_URL = `${API_BASE_URL}/media/movies`;
const TMDB_IMAGE_ORIGIN = "https://image.tmdb.org";
const TMDB_IMAGE_PATH = `${TMDB_IMAGE_ORIGIN}/t/p`;
export const TMDB_IMAGE_BASE_URL = `${TMDB_IMAGE_PATH}/w500`;

export const getResponsiveTmdbPoster = (url) => {
  if (typeof url !== "string") return null;

  const match = url.trim().match(
    /^https:\/\/image\.tmdb\.org\/t\/p\/(?:original|w\d+)(\/[^?#]+)(?:[?#].*)?$/i
  );

  if (!match) return null;

  const posterPath = match[1];
  return {
    src: `${TMDB_IMAGE_PATH}/w185${posterPath}`,
    srcSet: [
      `${TMDB_IMAGE_PATH}/w185${posterPath} 185w`,
      `${TMDB_IMAGE_PATH}/w342${posterPath} 342w`,
      `${TMDB_IMAGE_PATH}/w500${posterPath} 500w`,
    ].join(", "),
    sizes: "(max-width: 700px) 160px, 214px",
  };
};

const movieRequest = async (url) => {
  try {
    return await fetch(url, { credentials: "include" });
  } catch (error) {
    throw new Error(
      "Unable to reach MediaVault. Check your connection and try again.",
      { cause: error }
    );
  }
};

const parseMovieResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || fallbackMessage);
  return {
    results: data.results || [],
    totalPages: Math.min(data.total_pages || 1, 500),
  };
};

export const getPopularMovies = async (page = 1, genre = "") => {
  const genreParam = genre ? `&genre=${encodeURIComponent(genre)}` : "";
  const response = await movieRequest(`${BASE_URL}/popular?page=${page}${genreParam}`);
  return parseMovieResponse(response, "Unable to load movies. Please try again.");
};

export const searchMovies = async (query, page = 1, genre = "") => {
  if (!query.trim()) return getPopularMovies(page, genre);
  const genreParam = genre ? `&genre=${encodeURIComponent(genre)}` : "";
  const response = await movieRequest(
    `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}${genreParam}`
  );
  return parseMovieResponse(response, "Unable to search movies. Please try again.");
};

export const getMovieDetails = async (movieId) => {
  const response = await movieRequest(`${BASE_URL}/${movieId}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Unable to load movie details. Please try again.");
  }
  return data;
};
