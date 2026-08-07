export const VALID_MEDIA_STATUSES = new Set([
  "plan",
  "in_progress",
  "completed",
]);

export const validateStatus = (status) => {
  if (status === undefined) return null;
  if (!VALID_MEDIA_STATUSES.has(status)) {
    return "Status must be one of: plan, in_progress, or completed.";
  }
  return null;
};

export const validateRating = (rating) => {
  if (rating === undefined || rating === null) return null;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "Rating must be a whole number between 1 and 5.";
  }
  return null;
};
