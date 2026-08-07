import apiClient from "../utils/apiClient.js";

const API_KEY = process.env.TMBD_KEY;
const BASE = "https://api.themoviedb.org/3";

const normalizeGenreId = (genre) => {
    if (!genre) return null;
    if (String(genre).toLowerCase() === "acting") return "28";
    return String(genre);
};

const tmdbService = {};

tmdbService.getPopularMovies = (page = 1, genre) => {
    const genreId = normalizeGenreId(genre);
    const path = genreId ? "/discover/movie" : "/movie/popular";
    const genreParam = genreId ? `&with_genres=${encodeURIComponent(genreId)}` : "";
    return apiClient(`${BASE}${path}?api_key=${API_KEY}&page=${page}${genreParam}`);
};

tmdbService.getPopularTV = (page = 1) =>
    apiClient(`${BASE}/tv/popular?api_key=${API_KEY}&page=${page}`);

tmdbService.searchMovies = async (query, page = 1, genre) => {
    const result = await apiClient(
        `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const genreId = normalizeGenreId(genre);

    if (genreId && Array.isArray(result.results)) {
        result.results = result.results.filter((movie) =>
            movie.genre_ids?.includes(Number(genreId))
        );
    }

    return result;
};

tmdbService.searchTV = (query, page = 1) =>
    apiClient(`${BASE}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);

tmdbService.getMovie = (id) =>
    apiClient(`${BASE}/movie/${id}?api_key=${API_KEY}`);

tmdbService.getTV = (id) =>
    apiClient(`${BASE}/tv/${id}?api_key=${API_KEY}`);

tmdbService.getTrendingMovies = (page = 1) =>
    apiClient(`${BASE}/trending/movie/week?api_key=${API_KEY}&page=${page}`);

tmdbService.getTrendingTV = (page = 1) =>
    apiClient(`${BASE}/trending/tv/week?api_key=${API_KEY}&page=${page}`);

tmdbService.getMovieRecommendations = (id) =>
    apiClient(`${BASE}/movie/${id}/recommendations?api_key=${API_KEY}`);

tmdbService.getTVRecommendations = (id) =>
    apiClient(`${BASE}/tv/${id}/recommendations?api_key=${API_KEY}`);

export default tmdbService;
