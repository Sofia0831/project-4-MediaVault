import apiClient from "../utils/apiClient.js";

const BASE = "https://api.mangadex.org";

const mangaDexService = {};

/* ---------- Search ---------- */

mangaDexService.searchManga = (query) =>
  apiClient(
    `${BASE}/manga?title=${encodeURIComponent(query)}&limit=20&includes[]=cover_art`
  );

/* ---------- Details ---------- */

mangaDexService.getManga = (id) =>
  apiClient(
    `${BASE}/manga/${id}?includes[]=cover_art`
  );

/* ---------- Popular ---------- */

mangaDexService.getTopManga = () =>
  apiClient(
    `${BASE}/manga?order[followedCount]=desc&limit=20&includes[]=cover_art`
  );

/* ---------- Latest ---------- */

mangaDexService.getLatestManga = () =>
  apiClient(
    `${BASE}/manga?order[latestUploadedChapter]=desc&limit=20&includes[]=cover_art`
  );

export default mangaDexService;