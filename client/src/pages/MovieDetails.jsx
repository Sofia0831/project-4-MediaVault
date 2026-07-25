import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, TMDB_IMAGE_BASE_URL } from "../services/tmdbApi";
import StatusModal from "../components/StatusModal";
import "./MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // User Interactive State
  const [isAddedToShelf, setIsAddedToShelf] = useState(false);
  const [status, setStatus] = useState("");
  
  // Review State
  const [review, setReview] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewInput, setReviewInput] = useState("");

  // Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getMovieDetails(id);
      setMovie(data);
      setLoading(false);
    };

    fetchDetails();
  }, [id]);

  const handleAddToShelf = () => {
    setIsAddedToShelf(true);
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (reviewInput.trim()) {
      setReview(reviewInput);
      setIsEditingReview(false);
    }
  };

  const handleDeleteReview = () => {
    setReview("");
    setReviewInput("");
    setIsEditingReview(false);
  };

  const handleSelectStatus = (selectedStatus) => {
    setStatus(selectedStatus);
    setShowStatusModal(false);
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
      {/* Optional Backdrop Banner */}
      {backdropUrl && (
        <div 
          className="details-backdrop" 
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}

      {/* Top Header Card */}
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
            <strong>Rating:</strong> {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : "N/A"}
          </p>

          {/* Genre Badges */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="genre-container">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-chip">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className="movie-overview">{movie.overview || "No description available."}</p>

          {/* Extra Movie Attributes */}
          <div className="extra-info-grid">
            <div>
              <strong>Original Language:</strong> {movie.original_language?.toUpperCase() || "N/A"}
            </div>
            <div>
              <strong>Production Status:</strong> {movie.status || "N/A"}
            </div>
          </div>

          {status && <span className="status-badge">Status: {status}</span>}

          {!isAddedToShelf && (
            <div className="shelf-btn-wrapper">
              <button className="primary-gold-btn" onClick={handleAddToShelf}>
                Add Movie to Shelf
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons-row">
        {!review && !isEditingReview ? (
          <div className="action-col">
            <button
              className="primary-gold-btn wide-btn"
              onClick={() => setIsEditingReview(true)}
            >
              Write A Review
            </button>          
            </div>
        ) : (
          <div className="action-col" />
        )}

        <div className="action-col">
          <button
            className="primary-gold-btn wide-btn"
            onClick={() => setShowStatusModal(true)}
          >
            {status ? "Change Status" : "Add Status"}
          </button>
        </div>
      </div>

      {/* Review Editor Input */}
      {isEditingReview && (
        <form className="review-editor-box" onSubmit={handleSaveReview}>
          <h3>{review ? "Edit Your Review" : "Write Your Review"}</h3>
          <textarea
            className="review-textarea"
            rows="4"
            placeholder="Share your thoughts about this movie..."
            value={reviewInput}
            onChange={(e) => setReviewInput(e.target.value)}
          />
          <div className="review-editor-actions">
            <button type="submit" className="primary-gold-btn">
              Save Review
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsEditingReview(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Review Display Section */}
      {review && !isEditingReview && (
        <div className="review-display-card">
          <h3>Review</h3>
          <p className="review-content">{review}</p>
          <div className="review-card-actions">
            <button
              className="primary-gold-btn"
              onClick={() => {
                setReviewInput(review);
                setIsEditingReview(true);
              }}
            >
              Edit Review
            </button>
            <button className="danger-btn" onClick={handleDeleteReview}>
              Delete Review
            </button>
          </div>
        </div>
      )}

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        currentStatus={status}
        onClose={() => setShowStatusModal(false)}
        onSelectStatus={handleSelectStatus}
      />
    </div>
  );
};

export default MovieDetails;