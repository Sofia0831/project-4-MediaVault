import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import StatusDropdown from "../components/StatusDropdown";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import {
  deleteShelfItem,
  getShelfItem,
  updateShelfItem,
} from "../services/mediaShelfApi";
import "./MovieDetails.css";
import "./SavedMediaDetails.css";

const SavedMediaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumbTitle } = useBreadcrumb(); 
  
  const [item, setItem] = useState(null);
  const [review, setReview] = useState("");
  const [editingReview, setEditingReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItem = async () => {
      try {
        setError("");
        const savedItem = await getShelfItem(id);
        setItem(savedItem);
        setReview(savedItem.review || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  useEffect(() => {
    if (item?.title) {
      setBreadcrumbTitle(item.title);
    }

    return () => setBreadcrumbTitle("");
  }, [item?.title, setBreadcrumbTitle]);

  const updateItem = async (updates) => {
    if (!item) return;

    const previousItem = item;
    setItem({ ...item, ...updates });
    setSaving(true);
    setError("");

    try {
      const updated = await updateShelfItem(item.id, updates);
      setItem(updated);
    } catch (err) {
      setItem(previousItem);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveReview = async (event) => {
    event.preventDefault();
    await updateItem({ review: review.trim() || null });
    setEditingReview(false);
  };

  const deleteReview = async () => {
    const confirmed = window.confirm(
      "Delete this review? Your saved media, rating, and status will not be changed."
    );

    if (!confirmed) return;

    const previousItem = item;
    setItem({ ...item, review: null });
    setReview("");
    setEditingReview(false);
    setSaving(true);
    setError("");

    try {
      const updated = await updateShelfItem(item.id, { review: null });
      setItem(updated);
      setReview(updated.review || "");
    } catch (err) {
      setItem(previousItem);
      setReview(previousItem.review || "");
      setError(`Unable to delete review. ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async () => {
    setSaving(true);
    setError("");

    try {
      await deleteShelfItem(item.id);
      navigate("/shelf", { replace: true });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="movie-details-container loading-state">Loading saved media...</main>;
  }

  if (!item) {
    return (
      <main className="movie-details-container">
        <div className="details-error">{error || "Saved media not found."}</div>
        <button className="cancel-btn" type="button" onClick={() => navigate("/shelf")}>
          Back to Shelf
        </button>
      </main>
    );
  }

  const genreList = Array.isArray(item.genres) 
    ? item.genres 
    : item.genres ? item.genres.split(",").map(g => g.trim()) : [];

  return (
    <main className="movie-details-container">
      {error && <div className="details-error" role="alert">{error}</div>}

      <div className="details-header-card">
        {item.cover_url && (
          <div className="poster-container">
            <img src={item.cover_url} alt={`${item.title} cover`} className="details-poster" />
          </div>
        )}

        <div className="details-info">
          <p className="eyebrow">Saved {item.media_type}</p>
          <h2>{item.title}</h2>
          {item.creator && <p className="movie-meta">{item.creator}</p>}
          {item.release_year && <p className="movie-meta">{item.release_year}</p>}
          
          {genreList.length > 0 && (
            <div className="genre-container">
              {genreList.map((genre, idx) => (
                <span key={idx} className="genre-chip">{genre}</span>
              ))}
            </div>
          )}

          <div className="shelf-controls-panel">
            <StatusDropdown
              status={item.status}
              disabled={saving}
              onChange={(status) => updateItem({ status })}
            />
            <StarRating
              rating={item.rating || 0}
              disabled={saving}
              label={`Rating for ${item.title}`}
              onChange={(rating) => updateItem({ rating })}
            />
            <button className="danger-btn" type="button" disabled={saving} onClick={removeItem}>
              Remove From Shelf
            </button>
          </div>
        </div>
      </div>

      <section className="review-section" aria-labelledby="saved-review-title">
        <h3 id="saved-review-title">Your Review</h3>
        {editingReview ? (
          <form className="review-form" onSubmit={saveReview}>
            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              disabled={saving}
              aria-label={`Review for ${item.title}`}
            />
            <div className="review-form-actions">
              <button className="action-btn" type="submit" disabled={saving}>Save Review</button>
              <button
                className="cancel-btn"
                type="button"
                disabled={saving}
                onClick={() => {
                  setReview(item.review || "");
                  setEditingReview(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="review-content">{item.review || "No review yet."}</p>
            <div className="review-actions">
              <button
                className="cancel-btn"
                type="button"
                disabled={saving}
                onClick={() => setEditingReview(true)}
              >
                {item.review ? "Edit Review" : "Write a Review"}
              </button>
              {item.review && (
                <button
                  className="review-delete-btn"
                  type="button"
                  disabled={saving}
                  onClick={deleteReview}
                >
                  Delete Review
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default SavedMediaDetails;