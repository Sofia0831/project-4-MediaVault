import apiClient from "../utils/apiClient.js";

const BASE = "https://api.jikan.moe/v4";

const jikanService = {};

/* ---------- Search ---------- */

jikanService.searchAnime = () =>
  apiClient(
    `${BASE}/anime`
  );

/* ---------- Details ---------- */

jikanService.getAnime = (id) =>
  apiClient(`${BASE}/anime/${id}/full`);

/* ---------- Top ---------- */

jikanService.getTopAnime = () =>
  apiClient(`${BASE}/top/anime`);

/* ---------- Seasonal ---------- */

jikanService.getSeasonNow = () =>
  apiClient(`${BASE}/seasons/now`);

jikanService.getSeasonUpcoming = () =>
  apiClient(`${BASE}/seasons/upcoming`);

export default jikanService;