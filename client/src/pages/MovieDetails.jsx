import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import StatusDropdown from "../components/StatusDropdown";
import { getMovieDetails, TMDB_IMAGE_BASE_URL } from "../services/tmdbApi";
import {
  addShelfItem,
  deleteShelfItem,
  getShelf,
  updateShelfItem,
} from "../services/mediaShelfApi";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import "./MovieDetails.css";

const getReleaseYear = (releaseDate) => {
  if (!releaseDate) return null;
  const year = Number(releaseDate.split("-")[0]);
  return Number.isNaN(year) ? null : year;
};

const MovieDetails = () => {
  const { id } = useParams();
  const { setBreadcrumbTitle } = useBreadcrumb();
  const [movie, setMovie] = useState(null);
  const [shelfItem, setShelfItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewInput, setReviewInput] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const [movieData, shelf] = await Promise.all([
          getMovieDetails(id),
          getShelf(),
        ]);

        setMovie(movieData);
        // Set breadcrumb title dynamically for global layout
        setBreadcrumbTitle(movieData.title);

        const existingItem = shelf.find(
          (item) =>
            item.media_type === "movie" &&
            item.external_source === "tmdb" &&
            String(item.external_id) === String(id)
        );

        setShelfItem(existingItem || null);
        setReviewInput(existingItem?.review || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();

    // Reset breadcrumb title when navigating away
    return () => setBreadcrumbTitle("");
  }, [id, setBreadcrumbTitle]);

  const buildMoviePayload = () => {
    const posterUrl = movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : null;

    return {
      media_type: "movie",
      external_source: "tmdb",
      external_id: String(movie.id),
      title: movie.title,
      creator: movie.production_companies?.[0]?.name || null,
      cover_url: posterUrl,
      release_year: getReleaseYear(movie.release_date),
      genres: movie.genres?.map((genre) => genre.name) || [],
      status: "plan",
    };
  };

  const handleAddToShelf = async () => {
    try {
      setSaving(true);
      setError("");
      const added = await addShelfItem(buildMoviePayload());
      setShelfItem(added);
      setReviewInput(added.review || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateCurrentShelfItem = async (updates) => {
    if (!shelfItem) return;

    const previousItem = shelfItem;
    setShelfItem({ ...shelfItem, ...updates });

    try {
      setSaving(true);
      setError("");
      const updated = await updateShelfItem(shelfItem.id, updates);
      setShelfItem(updated);
      setReviewInput(updated.review || "");
    } catch (err) {
      setShelfItem(previousItem);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReview = async (event) => {
    event.preventDefault();
    await updateCurrentShelfItem({ review: reviewInput.trim() || null });
    setIsEditingReview(false);
  };

  const handleDeleteReview = async () => {
    await updateCurrentShelfItem({ review: null });
    setReviewInput("");
    setIsEditingReview(false);
  };

  const handleRemoveFromShelf = async () => {
    if (!shelfItem) return;

    const previousItem = shelfItem;
    setShelfItem(null);
    setReviewInput("");
    setIsEditingReview(false);

    try {
      setSaving(true);
      setError("");
      await deleteShelfItem(previousItem.id);
    } catch (err) {
      setShelfItem(previousItem);
      setReviewInput(previousItem.review || "");
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state">Loading details...</div>;
  if (!movie) return <div className="loading-state">Movie not found.</div>;

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Poster";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const formatRuntime = (mins) => {
    if (!mins) return "N/A";
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  return (
    <div className="movie-details-container">
      {error && <div className="details-error">{error}</div>}

      {backdropUrl && (
        <div
          className="details-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}

      <div className="details-header-card">
        <div className="poster-container">
          <img src={posterUrl} alt={movie.title} className="details-poster" />
        </div>

        <div className="details-info">
          <h2>{movie.title}</h2>
          {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}

          <p className="movie-meta">
            <strong>Release Date:</strong> {movie.release_date || "N/A"} |{" "}
            <strong>Runtime:</strong> {formatRuntime(movie.runtime)} |{" "}
            <strong>Rating:</strong>{" "}
            {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : "N/A"}
          </p>

          {movie.genres && movie.genres.length > 0 && (
            <div className="genre-container">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-chip">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className="movie-overview">
            {movie.overview || "No description available."}
          </p>

          <div className="extra-info-grid">
            <div>
              <strong>Original Language:</strong>{" "}
              {movie.original_language?.toUpperCase() || "N/A"}
            </div>
            <div>
              <strong>Production Status:</strong> {movie.status || "N/A"}
            </div>
          </div>

          {shelfItem ? (
            <div className="shelf-controls-panel">
              <StatusDropdown
                status={shelfItem.status}
                onChange={(status) => updateCurrentShelfItem({ status })}
                disabled={saving}
              />
              <div>
                <span className="control-label">Your Rating</span>
                <StarRating
                  rating={shelfItem.rating || 0}
                  onChange={(rating) => updateCurrentShelfItem({ rating })}
                  disabled={saving}
                />
              </div>
              <button
                type="button"
                className="danger-btn"
                onClick={handleRemoveFromShelf}
                disabled={saving}
              >
                Remove From Shelf
              </button>
            </div>
          ) : (
            <div className="shelf-btn-wrapper">
              <button
                className="primary-gold-btn"
                onClick={handleAddToShelf}
                disabled={saving}
              >
                {saving ? "Adding..." : "Add Movie to Shelf"}
              </button>
            </div>
          )}
        </div>
      </div>

      {shelfItem && (
        <>
          {!shelfItem.review && !isEditingReview && (
            <div className="action-buttons-row">
              <button
                className="primary-gold-btn wide-btn"
                onClick={() => setIsEditingReview(true)}
                disabled={saving}
              >
                Write A Review
              </button>
            </div>
          )}

          {isEditingReview && (
            <form className="review-editor-box" onSubmit={handleSaveReview}>
              <h3>{shelfItem.review ? "Edit Your Review" : "Write Your Review"}</h3>
              <textarea
                className="review-textarea"
                rows="4"
                placeholder="Share your thoughts about this movie..."
                value={reviewInput}
                onChange={(event) => setReviewInput(event.target.value)}
              />
              <div className="review-editor-actions">
                <button type="submit" className="primary-gold-btn" disabled={saving}>
                  Save Review
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setReviewInput(shelfItem.review || "");
                    setIsEditingReview(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {shelfItem.review && !isEditingReview && (
            <div className="review-display-card">
              <h3>Review</h3>
              <p className="review-content">{shelfItem.review}</p>
              <div className="review-card-actions">
                <button
                  className="primary-gold-btn"
                  onClick={() => {
                    setReviewInput(shelfItem.review || "");
                    setIsEditingReview(true);
                  }}
                  disabled={saving}
                >
                  Edit Review
                </button>
                <button
                  className="danger-btn"
                  onClick={handleDeleteReview}
                  disabled={saving}
                >
                  Delete Review
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieDetails;