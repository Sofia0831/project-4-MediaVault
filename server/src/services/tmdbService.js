import apiClient from "../utils/apiClient.js";

const API_KEY = process.env.TMBD_KEY;

const BASE = "https://api.themoviedb.org/3";

const tmdbService = {};

tmdbService.searchMovies = (query) =>
    apiClient(`${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);

tmdbService.searchTV = (query) =>
    apiClient(`${BASE}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);

tmdbService.getMovie = (id) =>
    apiClient(`${BASE}/movie/${id}?api_key=${API_KEY}`);

tmdbService.getTV = (id) =>
    apiClient(`${BASE}/tv/${id}?api_key=${API_KEY}`);

tmdbService.getTrendingMovies = () =>
    apiClient(`${BASE}/trending/movie/week?api_key=${API_KEY}`);

tmdbService.getTrendingTV = () =>
    apiClient(`${BASE}/trending/tv/week?api_key=${API_KEY}`);

tmdbService.getPopularMovies = () =>
    apiClient(`${BASE}/movie/popular?api_key=${API_KEY}`);

tmdbService.getPopularTV = () =>
    apiClient(`${BASE}/tv/popular?api_key=${API_KEY}`);

tmdbService.getMovieRecommendations = (id) =>
    apiClient(`${BASE}/movie/${id}/recommendations?api_key=${API_KEY}`);

tmdbService.getTVRecommendations = (id) =>
    apiClient(`${BASE}/tv/${id}/recommendations?api_key=${API_KEY}`);

export default tmdbService;