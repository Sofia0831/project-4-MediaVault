import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import StatusDropdown from "../components/StatusDropdown";
import { getBookDetails } from "../services/googleBooksApi";
import {
  addShelfItem,
  deleteShelfItem,
  getShelf,
  updateShelfItem,
} from "../services/mediaShelfApi";
import "./MovieDetails.css";

const getReleaseYear = (publishedDate) => {
  if (!publishedDate) return null;
  const year = Number(String(publishedDate).slice(0, 4));
  return Number.isNaN(year) ? null : year;
};

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
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
        const [bookData, shelf] = await Promise.all([
          getBookDetails(id),
          getShelf(),
        ]);

        setBook(bookData);

        const existingItem = shelf.find(
          (item) =>
            item.media_type === "book" &&
            item.external_source === "google_books" &&
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
  }, [id]);

  const buildBookPayload = () => ({
    media_type: "book",
    external_source: "google_books",
    external_id: String(book.id),
    title: book.title,
    creator: book.authors?.join(", ") || "Unknown Author",
    cover_url: book.thumbnail,
    release_year: getReleaseYear(book.publishedDate),
    genres: book.categories || [],
    status: "plan",
  });

  const handleAddToShelf = async () => {
    try {
      setSaving(true);
      setError("");
      const added = await addShelfItem(buildBookPayload());
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

  const cleanDescription = (html) => {
    if (!html) return "No description available.";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) return <div className="loading-state">Loading details...</div>;
  if (!book) return <div className="loading-state">Book not found.</div>;

  const authorsText = book.authors?.length
    ? book.authors.join(", ")
    : "Unknown Author";

  return (
    <div className="movie-details-container">
      {error && <div className="details-error">{error}</div>}

      <div className="details-header-card">
        <div className="poster-container">
          <img src={book.thumbnail} alt={book.title} className="details-poster" />
        </div>

        <div className="details-info">
          <h2>{book.title}</h2>
          <p className="movie-tagline">By {authorsText}</p>

          <p className="movie-meta">
            <strong>Published:</strong> {book.publishedDate || "N/A"} |{" "}
            <strong>Publisher:</strong> {book.publisher || "N/A"} |{" "}
            <strong>Pages:</strong> {book.pageCount ? `${book.pageCount} pgs` : "N/A"}
          </p>

          {book.categories && book.categories.length > 0 && (
            <div className="genre-container">
              {book.categories.map((category) => (
                <span key={category} className="genre-chip">
                  {category}
                </span>
              ))}
            </div>
          )}

          <p className="movie-overview">{cleanDescription(book.description)}</p>

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
                {saving ? "Adding..." : "Add Book to Shelf"}
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
                placeholder="Share your thoughts about this book..."
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

export default BookDetails;
