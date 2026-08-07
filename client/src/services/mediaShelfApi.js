import { API_BASE_URL } from "./apiConfig";

const MEDIA_API_URL = `${API_BASE_URL}/media`;

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session expired or login is required. Please sign in again.");
    }
    if (response.status === 404) {
      throw new Error(data.message || "That saved item was not found.");
    }
    if (response.status >= 500) {
      throw new Error("MediaVault is temporarily unavailable. Please try again.");
    }
    throw new Error(data.message || "We couldn’t complete that shelf action.");
  }

  return data;
};

const shelfRequest = async (url, options) => {
  try {
    return await fetch(url, options);
  } catch {
    throw new Error("Unable to reach MediaVault. Check your connection and try again.");
  }
};

export const getShelf = async () => {
  const response = await shelfRequest(`${MEDIA_API_URL}/shelf`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
};

export const getShelfItem = async (id) => {
  const response = await shelfRequest(`${MEDIA_API_URL}/shelf/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
};

export const addShelfItem = async (media) => {
  const response = await shelfRequest(`${MEDIA_API_URL}/shelf`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(media),
  });

  return parseResponse(response);
};

export const updateShelfItem = async (id, updates) => {
  const response = await shelfRequest(`${MEDIA_API_URL}/shelf/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  return parseResponse(response);
};

export const deleteShelfItem = async (id) => {
  const response = await shelfRequest(`${MEDIA_API_URL}/shelf/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return parseResponse(response);
};
