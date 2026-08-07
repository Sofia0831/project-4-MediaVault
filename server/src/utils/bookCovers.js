const OPEN_LIBRARY_COVER_PATH = /covers\.openlibrary\.org\/b\/id\/([^/]+)-[SML]\.jpg(?:\?.*)?$/i;

export const normalizeOpenLibraryCoverId = (value) => {
  const coverId = Number(value);
  return Number.isFinite(coverId) && coverId > 0 ? coverId : null;
};

export const normalizeBookCoverUrl = (value) => {
  if (typeof value !== "string") return null;

  const coverUrl = value.trim();
  if (!coverUrl || ["undefined", "null", "nan"].includes(coverUrl.toLowerCase())) {
    return null;
  }

  if (/covers\.openlibrary\.org\/b\/id\//i.test(coverUrl)) {
    const match = coverUrl.match(OPEN_LIBRARY_COVER_PATH);
    if (!match || !normalizeOpenLibraryCoverId(match[1])) return null;
  }

  return coverUrl.replace(/^http:\/\//i, "https://");
};

export const normalizeMediaBookCover = (media) => {
  if (!media || media.media_type !== "book") return media;
  return { ...media, cover_url: normalizeBookCoverUrl(media.cover_url) };
};
