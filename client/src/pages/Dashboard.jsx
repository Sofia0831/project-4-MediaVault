import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getShelf } from "../services/mediaShelfApi";
import "./Dashboard.css";

const statusLabels = {
  plan: "Planned",
  in_progress: "In progress",
  completed: "Completed",
};

const AUTO_ADVANCE_MS = 2000;

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  useEffect(() => {
    const loadSavedMedia = async () => {
      try {
        setError("");
        const shelf = await getShelf();
        setItems(Array.isArray(shelf) ? shelf : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSavedMedia();
  }, []);

  useEffect(() => {
    if (items.length <= 1 || isHovered || isFocusWithin) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setActiveIndex((index) => (index + 1) % items.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timerId);
  }, [activeIndex, isFocusWithin, isHovered, items.length]);

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + items.length) % items.length);
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % items.length);
  };

  const activeItem = items[activeIndex];
  const displayName = user?.username || "there";

  // Helper to filter, sort by highest rating, and slice the top 10
  const getTopMedia = (type) => {
    return items
      .filter(
        (item) =>
          item.media_type?.toLowerCase() === type.toLowerCase() &&
          Number(item.rating) > 0
      )
      .sort((a, b) => Number(b.rating) - Number(a.rating))
      .slice(0, 10);
  };

  const topMovies = getTopMedia("movie");
  const topBooks = getTopMedia("book");

  return (
    <main className="dashboard-page">
      <div className="dashboard-content">
        <section
          className="saved-carousel"
          aria-labelledby="saved-carousel-title"
          aria-live="polite"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsFocusWithin(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsFocusWithin(false);
            }
          }}
        >
          <div className="carousel-heading">
            <div>
              <p className="eyebrow">Your MediaVault</p>
              <h1 id="saved-carousel-title">Welcome, {displayName}</h1>
            </div>
            {items.length > 0 && <span>{activeIndex + 1} / {items.length}</span>}
          </div>

          {loading && <div className="carousel-state">Loading your saved media...</div>}

          {!loading && error && (
            <div className="carousel-state carousel-error" role="alert">
              <h2>We couldn’t load your shelf.</h2>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="carousel-state carousel-empty">
              <h2>Welcome to your new shelf.</h2>
              <p>Add a movie or book to start your MediaVault collection.</p>
              <div className="empty-actions">
                <button className="action-btn" type="button" onClick={() => navigate("/movies")}>Add Movies</button>
                <button className="action-btn" type="button" onClick={() => navigate("/books")}>Add Books</button>
              </div>
            </div>
          )}

          {!loading && !error && activeItem && (
            <div className="carousel-stage">
              <button
                className="carousel-control"
                type="button"
                aria-label="Previous saved item"
                disabled={items.length < 2}
                onClick={showPrevious}
              >
                ‹
              </button>

              <button
                className="carousel-item"
                type="button"
                onClick={() => navigate(`/shelf/${activeItem.id}`, { state: { from: "dashboard" } })}
                aria-label={`View saved details for ${activeItem.title}`}
              >
                <div className="carousel-cover-wrap">
                  {activeItem.cover_url ? (
                    <img src={activeItem.cover_url} alt="" className="carousel-cover" />
                  ) : (
                    <div className="carousel-cover-placeholder" aria-hidden="true">MV</div>
                  )}
                </div>
                <div className="carousel-copy">
                  <span className="carousel-type">{activeItem.media_type}</span>
                  <h2>{activeItem.title}</h2>
                  {activeItem.creator && <p>{activeItem.creator}</p>}
                  <div className="carousel-meta">
                    {activeItem.rating ? <span aria-label={`${activeItem.rating} out of 5 stars`}>★ {activeItem.rating}/5</span> : null}
                    {activeItem.status && <span>{statusLabels[activeItem.status] || activeItem.status}</span>}
                  </div>
                </div>
              </button>

              <button
                className="carousel-control"
                type="button"
                aria-label="Next saved item"
                disabled={items.length < 2}
                onClick={showNext}
              >
                ›
              </button>
            </div>
          )}
        </section>

        <div className="grid-container" aria-label="Media catalogues">
          {/* Top 10 Movies Card */}
          <div className="media-card">
            <div className="card-header">
              <h3>Top 10 Movies</h3>
            </div>
            <div className="card-body">
              {topMovies.length > 0 ? (
                <ul className="top-media-list">
                  {topMovies.map((movie, index) => (
                    <li
                      key={movie.id}
                      className="top-media-item"
                      onClick={() => navigate(`/shelf/${movie.id}`, { state: { from: "dashboard" } })}
                    >
                      <span className="rank-number">{index + 1}</span>
                      <div className="top-media-info">
                        <span className="top-media-title">{movie.title}</span>
                        <span className="top-media-rating">★ {movie.rating}/5</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <p className="no-ratings-text">No rated movies on your shelf yet.</p>
                  <button className="action-btn" type="button" onClick={() => navigate("/movies")}>
                    Add Movies
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Top 10 Books Card */}
          <div className="media-card">
            <div className="card-header">
              <h3>Top 10 Books</h3>
            </div>
            <div className="card-body">
              {topBooks.length > 0 ? (
                <ul className="top-media-list">
                  {topBooks.map((book, index) => (
                    <li
                      key={book.id}
                      className="top-media-item"
                      onClick={() => navigate(`/shelf/${book.id}`, { state: { from: "dashboard" } })}
                    >
                      <span className="rank-number">{index + 1}</span>
                      <div className="top-media-info">
                        <span className="top-media-title">{book.title}</span>
                        <span className="top-media-rating">★ {book.rating}/5</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <p className="no-ratings-text">No rated books on your shelf yet.</p>
                  <button className="action-btn" type="button" onClick={() => navigate("/books")}>
                    Add Books
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;