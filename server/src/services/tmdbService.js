import apiClient from "../utils/apiClient.js";

const API_KEY = process.env.TMBD_KEY;
const BASE = "https://api.themoviedb.org/3";

const tmdbService = {};

tmdbService.getPopularMovies = (page = 1) =>
    apiClient(`${BASE}/movie/popular?api_key=${API_KEY}&page=${page}`);

tmdbService.getPopularTV = (page = 1) =>
    apiClient(`${BASE}/tv/popular?api_key=${API_KEY}&page=${page}`);

tmdbService.searchMovies = (query, page = 1) =>
    apiClient(`${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);

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