import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import StatusDropdown from "../components/StatusDropdown";
import {
  deleteShelfItem,
  getShelf,
  updateShelfItem,
} from "../services/mediaShelfApi";
import "./Shelf.css";

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
              const items = getItems(column.mediaType, statusGroup.value);

              return (
                <div key={statusGroup.value} className="status-box">
                  <div className="status-header">{statusGroup.label}</div>
                  <div className="status-content">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <div key={item.id} className="mini-item-card">
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
                          </div>

                          <div className="mini-item-controls">
                            <StatusDropdown
                              status={item.status}
                              label="Status"
                              onChange={(status) => updateItem(item.id, { status })}
                            />
                            <StarRating
                              rating={item.rating || 0}
                              label={`Rating for ${item.title}`}
                              onChange={(rating) => updateItem(item.id, { rating })}
                            />
                            <button
                              type="button"
                              className="mini-delete-btn"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="placeholder-text">{statusGroup.empty}</p>
                    )}
                  </div>
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
