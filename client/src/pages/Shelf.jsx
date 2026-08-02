import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import {
  deleteShelfItem,
  getShelf,
  updateShelfItem,
} from "../services/mediaShelfApi";
import "./Shelf.css";

const ITEMS_PER_PAGE = 5;

const columns = [
  {
    mediaType: "movie",
    catalogueLabel: "Movie Catalogue",
    cataloguePath: "/movies",
    statuses: [
      { value: "plan", label: "My Watchlist", empty: "List of all movies tagged to watch" },
      { value: "in_progress", label: "Currently Watching", empty: "Movies currently in progress" },
      { value: "completed", label: "Have Watched", empty: "All movies tagged have watched" },
    ],
  },
  {
    mediaType: "book",
    catalogueLabel: "Book Shelf",
    cataloguePath: "/books",
    statuses: [
      { value: "plan", label: "My Reading List", empty: "All books tagged to read" },
      { value: "in_progress", label: "Currently Reading", empty: "Books currently in progress" },
      { value: "completed", label: "Have Read", empty: "All books tagged have read" },
    ],
  },
];

const Shelf = () => {
  const navigate = useNavigate();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPageMap, setCurrentPageMap] = useState({});
  const [collapsedMap, setCollapsedMap] = useState({});

  useEffect(() => {
    const loadShelf = async () => {
      try {
        setError("");
        const shelf = await getShelf();
        setMediaItems(shelf);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadShelf();
  }, []);

  const getItems = (type, status) =>
    mediaItems.filter((item) => item.media_type === type && item.status === status);

  const toggleCollapse = (key) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePageChange = (key, delta) => {
    setCurrentPageMap((prevMap) => {
      const current = prevMap[key] || 1;
      return { ...prevMap, [key]: current + delta };
    });
  };

  // Directs user to /shelf/movies/:id or /shelf/books/:id
  const handleCardClick = (item) => {
    const externalId = item.external_id || item.api_id || item.id;
    if (!externalId) {
      console.warn("Item missing external ID:", item);
      return;
    }

    const targetPath = item.media_type === "movie" 
      ? `/shelf/movies/${externalId}` 
      : `/shelf/books/${externalId}`;
      
    navigate(targetPath);
  };

  const updateItem = async (id, updates) => {
    const previousItems = mediaItems;
    setMediaItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    try {
      const updated = await updateShelfItem(id, updates);
      setMediaItems((items) =>
        items.map((item) => (item.id === id ? updated : item))
      );
    } catch (err) {
      setMediaItems(previousItems);
      setError(err.message);
    }
  };

  const removeItem = async (id) => {
    const previousItems = mediaItems;
    setMediaItems((items) => items.filter((item) => item.id !== id));

    try {
      await deleteShelfItem(id);
    } catch (err) {
      setMediaItems(previousItems);
      setError(err.message);
    }
  };

  const openShelfItem = (id) => {
    navigate(`/shelf/${id}`);
  };

  const handleCardKeyDown = (event, id) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openShelfItem(id);
    }
  };

  if (loading) {
    return <div className="shelf-dashboard loading-state">Loading shelf...</div>;
  }

  return (
    <div className="shelf-dashboard">
      {error && <div className="shelf-error">{error}</div>}

      <div className="shelf-columns-container">
        {columns.map((column) => (
          <div key={column.mediaType} className="shelf-column">
            <button
              className="category-banner-btn"
              onClick={() => navigate(column.cataloguePath)}
            >
              {column.catalogueLabel}
            </button>

            {column.statuses.map((statusGroup) => {
              const allItems = getItems(column.mediaType, statusGroup.value);
              const sectionKey = `${column.mediaType}-${statusGroup.value}`;
              const isCollapsed = collapsedMap[sectionKey] || false;

              const currentPage = currentPageMap[sectionKey] || 1;
              const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

              const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
              const paginatedItems = allItems.slice(
                startIndex,
                startIndex + ITEMS_PER_PAGE
              );

              return (
                <div key={statusGroup.value} className="status-box">
                  {/* Clickable Header Dropdown Toggle */}
                  <div
                    className="status-header"
                    onClick={() => toggleCollapse(sectionKey)}
                    role="button"
                    tabIndex={0}
                  >
                    <span>
                      {statusGroup.label} ({allItems.length})
                    </span>
                    <span className={`accordion-arrow ${isCollapsed ? "collapsed" : ""}`}>
                      ▲
                    </span>
                  </div>

                  {/* Collapsible Content */}
                  {!isCollapsed && (
                    <>
                      <div className="status-content">
                        {paginatedItems.length > 0 ? (
                          paginatedItems.map((item) => (
                            <div
                              key={item.id}
                              className="mini-item-card"
                              role="link"
                              tabIndex={0}
                              aria-label={`View saved details for ${item.title}`}
                              onClick={() => openShelfItem(item.id)}
                              onKeyDown={(event) => handleCardKeyDown(event, item.id)}
                            >
                              <div className="mini-item-main">
                                {item.cover_url && (
                                  <img
                                    src={item.cover_url}
                                    alt={item.title}
                                    className="mini-item-cover"
                                  />
                                )}
                                <div className="mini-item-copy">
                                  <strong>{item.title}</strong>
                                  {item.creator && <span>{item.creator}</span>}
                                  {item.release_year && <span>{item.release_year}</span>}
                                </div>

                                <div
                                  className="mini-item-controls"
                                  onClick={(event) => event.stopPropagation()}
                                  onKeyDown={(event) => event.stopPropagation()}
                                >
                                  <StarRating
                                    rating={item.rating || 0}
                                    label={`Rating for ${item.title}`}
                                    onChange={(rating) =>
                                      updateItem(item.id, { rating })
                                    }
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="mini-delete-btn"
                                  aria-label={`Remove ${item.title} from shelf`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    removeItem(item.id);
                                  }}
                                  onKeyDown={(event) => event.stopPropagation()}
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="placeholder-text">{statusGroup.empty}</p>
                        )}
                      </div>

                      {/* Pagination Footer */}
                      {totalPages > 1 && (
                        <div className="status-pagination">
                          <button
                            type="button"
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(sectionKey, -1)}
                          >
                            &lt;
                          </button>
                          <span className="page-info">
                            {currentPage} / {totalPages}
                          </span>
                          <button
                            type="button"
                            className="page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(sectionKey, 1)}
                          >
                            &gt;
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shelf;
