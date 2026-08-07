const OPEN_LIBRARY_COVER_PATH = /covers\.openlibrary\.org\/b\/id\/([^/]+)-[SML]\.jpg(?:\?.*)?$/i;

export const normalizeOpenLibraryCoverId = (value) => {
  const coverId = Number(value);
  return Number.isFinite(coverId) && coverId > 0 ? coverId : null;
};

export const buildOpenLibraryCoverUrl = (coverId, size = "M") => {
  const validCoverId = normalizeOpenLibraryCoverId(coverId);
  if (!validCoverId) return null;
  return `https://covers.openlibrary.org/b/id/${validCoverId}-${size}.jpg`;
};

export const normalizeBookCoverUrl = (value) => {
  if (typeof value !== "string") return null;

  const coverUrl = value.trim().replace(/^http:\/\//i, "https://");
  if (!coverUrl || ["undefined", "null", "nan"].includes(coverUrl.toLowerCase())) {
    return null;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(coverUrl);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) return null;

  if (/covers\.openlibrary\.org\/b\/id\//i.test(coverUrl)) {
    const match = coverUrl.match(OPEN_LIBRARY_COVER_PATH);
    if (!match || !normalizeOpenLibraryCoverId(match[1])) return null;
  }

  return coverUrl;
};
