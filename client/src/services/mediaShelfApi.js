import { API_BASE_URL } from "./apiConfig";

const MEDIA_API_URL = `${API_BASE_URL}/media`;

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Media shelf request failed.");
  }

  return data;
};

export const getShelf = async () => {
  const response = await fetch(`${MEDIA_API_URL}/shelf`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
};

export const getShelfItem = async (id) => {
  const response = await fetch(`${MEDIA_API_URL}/shelf/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
};

export const addShelfItem = async (media) => {
  const response = await fetch(`${MEDIA_API_URL}/shelf`, {
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
  const response = await fetch(`${MEDIA_API_URL}/shelf/${id}`, {
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
  const response = await fetch(`${MEDIA_API_URL}/shelf/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return parseResponse(response);
};
