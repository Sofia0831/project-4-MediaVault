import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBookDetails } from "../services/googleBooksApi";
import StatusModal from "../components/StatusModal";
import "./MovieDetails.css";
import BookStatusModal from "../components/BooksStatusModal";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
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
      const data = await getBookDetails(id);
      setBook(data);
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

  // Utility function to strip raw HTML tags from Google Books description
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

          {/* Category Chips */}
          {book.categories && book.categories.length > 0 && (
            <div className="genre-container">
              {book.categories.map((category, idx) => (
                <span key={idx} className="genre-chip">
                  {category}
                </span>
              ))}
            </div>
          )}

          <p className="movie-overview">{cleanDescription(book.description)}</p>

          {status && <span className="status-badge">Status: {status}</span>}

          {!isAddedToShelf && (
            <div className="shelf-btn-wrapper">
              <button className="primary-gold-btn" onClick={handleAddToShelf}>
                Add Book to Shelf
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
            placeholder="Share your thoughts about this book..."
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
      <BookStatusModal
        isOpen={showStatusModal}
        currentStatus={status}
        onClose={() => setShowStatusModal(false)}
        onSelectStatus={handleSelectStatus}
      />
    </div>
  );
};

export default BookDetails;