import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import BookCover from "../components/BookCover";
import {
  deleteShelfItem,
  getShelf,
  updateShelfItem,
} from "../services/mediaShelfApi";
import "./Shelf.css";

const ITEMS_PER_PAGE = 5;
const VALID_STATUSES = new Set(["plan", "in_progress", "completed"]);
const MOBILE_STATUS_LABELS = {
  plan: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

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
  const [draggedItem, setDraggedItem] = useState(null);
  const [activeDropTarget, setActiveDropTarget] = useState("");
  const [movingItemIds, setMovingItemIds] = useState(() => new Set());
  const [mobileMediaType, setMobileMediaType] = useState("movie");
  const [mobileStatus, setMobileStatus] = useState("plan");
  const [dragDisabled, setDragDisabled] = useState(() =>
    window.matchMedia("(max-width: 768px), (pointer: coarse)").matches
  );
  const suppressCardClick = useRef(false);

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

  useEffect(() => {
    const dragMediaQuery = window.matchMedia(
      "(max-width: 768px), (pointer: coarse)"
    );
    const handleDragMediaChange = (event) => setDragDisabled(event.matches);

    dragMediaQuery.addEventListener("change", handleDragMediaChange);
    return () =>
      dragMediaQuery.removeEventListener("change", handleDragMediaChange);
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

  const updateItem = async (id, updates) => {
    const previousItem = mediaItems.find((item) => item.id === id);
    setError("");
    setMediaItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    try {
      const updated = await updateShelfItem(id, updates);
      setMediaItems((items) =>
        items.map((item) => (item.id === id ? updated : item))
      );
    } catch (err) {
      if (previousItem) {
        const previousValues = Object.fromEntries(
          Object.keys(updates).map((key) => [key, previousItem[key]])
        );
        setMediaItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, ...previousValues } : item
          )
        );
      }
      setError(err.message);
    }
  };

  const moveItem = async (item, targetMediaType, targetStatus) => {
    if (
      item.media_type !== targetMediaType ||
      item.status === targetStatus ||
      !VALID_STATUSES.has(targetStatus)
    ) {
      return false;
    }

    const originalStatus = item.status;
    const sourceKey = `${item.media_type}-${originalStatus}`;
    const targetKey = `${targetMediaType}-${targetStatus}`;

    setError("");
    setMovingItemIds((ids) => new Set(ids).add(item.id));
    setCurrentPageMap((pages) => ({
      ...pages,
      [sourceKey]: 1,
      [targetKey]: 1,
    }));
    setMediaItems((items) => {
      const currentItem = items.find((candidate) => candidate.id === item.id);
      if (!currentItem || currentItem.media_type !== targetMediaType) {
        return items;
      }

      return [
        { ...currentItem, status: targetStatus },
        ...items.filter((candidate) => candidate.id !== item.id),
      ];
    });

    try {
      const updated = await updateShelfItem(item.id, { status: targetStatus });
      setMediaItems((items) => [
        updated,
        ...items.filter((candidate) => candidate.id !== item.id),
      ]);
      return true;
    } catch (err) {
      setMediaItems((items) => {
        const currentItem = items.find((candidate) => candidate.id === item.id);
        if (!currentItem) {
          return items;
        }

        return [
          { ...currentItem, status: originalStatus },
          ...items.filter((candidate) => candidate.id !== item.id),
        ];
      });
      setError(`Could not move “${item.title}”. ${err.message}`);
      return false;
    } finally {
      setMovingItemIds((ids) => {
        const nextIds = new Set(ids);
        nextIds.delete(item.id);
        return nextIds;
      });
    }
  };

  const handleStatusChange = async (item, mediaType, targetStatus) => {
    const originalStatus = item.status;
    setMobileStatus(targetStatus);

    const moved = await moveItem(item, mediaType, targetStatus);
    if (!moved) {
      setMobileStatus(originalStatus);
    }
  };

  const isValidDropTarget = (mediaType, status) =>
    draggedItem?.media_type === mediaType && draggedItem.status !== status;

  const handleDragStart = (event, item) => {
    if (event.target.closest("button, select")) {
      event.preventDefault();
      return;
    }

    suppressCardClick.current = true;
    setError("");
    setDraggedItem(item);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "application/x-mediavault-shelf-item",
      JSON.stringify({ id: item.id, mediaType: item.media_type })
    );
  };

  const handleDragOver = (event, mediaType, status) => {
    if (!isValidDropTarget(mediaType, status)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setActiveDropTarget(`${mediaType}-${status}`);
  };

  const handleDragLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveDropTarget("");
    }
  };

  const releaseCardClickGuard = () => {
    window.setTimeout(() => {
      suppressCardClick.current = false;
    }, 100);
  };

  const handleDrop = (event, mediaType, status) => {
    event.preventDefault();
    setActiveDropTarget("");

    if (draggedItem && isValidDropTarget(mediaType, status)) {
      moveItem(draggedItem, mediaType, status);
    }

    setDraggedItem(null);
    releaseCardClickGuard();
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setActiveDropTarget("");
    releaseCardClickGuard();
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
      {error && (
        <div className="shelf-error" role="alert">
          {error}
        </div>
      )}

      <div className="mobile-shelf-navigation">
        <div className="mobile-media-tabs" role="tablist" aria-label="Media type">
          {columns.map((column) => (
            <button
              key={column.mediaType}
              type="button"
              role="tab"
              aria-selected={mobileMediaType === column.mediaType}
              className={mobileMediaType === column.mediaType ? "active" : ""}
              onClick={() => setMobileMediaType(column.mediaType)}
            >
              {column.mediaType === "movie" ? "Movies" : "Books"}
            </button>
          ))}
        </div>

        <div className="mobile-status-tabs" role="tablist" aria-label="Shelf status">
          {columns[0].statuses.map((status) => {
            const itemCount = getItems(mobileMediaType, status.value).length;

            return (
              <button
                key={status.value}
                type="button"
                role="tab"
                aria-selected={mobileStatus === status.value}
                className={mobileStatus === status.value ? "active" : ""}
                onClick={() => setMobileStatus(status.value)}
              >
                <span>{MOBILE_STATUS_LABELS[status.value]}</span>
                <span className="mobile-tab-count">{itemCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="shelf-columns-container">
        {columns.map((column) => (
          <div
            key={column.mediaType}
            className={`shelf-column${
              mobileMediaType === column.mediaType ? " mobile-selected" : ""
            }`}
          >
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

              const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
              const requestedPage = currentPageMap[sectionKey] || 1;
              const currentPage = Math.min(requestedPage, Math.max(totalPages, 1));

              const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
              const paginatedItems = allItems.slice(
                startIndex,
                startIndex + ITEMS_PER_PAGE
              );

              return (
                <div
                  key={statusGroup.value}
                  className={`status-box${
                    isValidDropTarget(column.mediaType, statusGroup.value)
                      ? " valid-drop-target"
                      : ""
                  }${
                    activeDropTarget === sectionKey ? " active-drop-target" : ""
                  }${
                    mobileStatus === statusGroup.value ? " mobile-selected" : ""
                  }`}
                  onDragOver={(event) =>
                    handleDragOver(event, column.mediaType, statusGroup.value)
                  }
                  onDragLeave={handleDragLeave}
                  onDrop={(event) =>
                    handleDrop(event, column.mediaType, statusGroup.value)
                  }
                >
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
                              className={`mini-item-card${
                                draggedItem?.id === item.id ? " is-dragging" : ""
                              }`}
                              role="link"
                              tabIndex={0}
                              draggable={
                                !dragDisabled && !movingItemIds.has(item.id)
                              }
                              aria-label={`View saved details for ${item.title}`}
                              onClick={(event) => {
                                if (suppressCardClick.current) {
                                  event.preventDefault();
                                  return;
                                }
                                openShelfItem(item.id);
                              }}
                              onKeyDown={(event) => handleCardKeyDown(event, item.id)}
                              onDragStart={(event) => handleDragStart(event, item)}
                              onDragEnd={handleDragEnd}
                            >
                              <div className="mini-item-main">
                                {item.media_type === "book" && (
                                  <BookCover
                                    src={item.cover_url}
                                    alt={`${item.title} cover`}
                                    className="mini-item-cover"
                                    width="80"
                                    height="120"
                                    loading="lazy"
                                  />
                                )}
                                {item.media_type !== "book" && item.cover_url && (
                                  <img
                                    src={item.cover_url}
                                    alt={item.title}
                                    className="mini-item-cover"
                                    width="80"
                                    height="120"
                                    loading="lazy"
                                  />
                                )}
                                {item.media_type !== "book" && !item.cover_url && (
                                  <div
                                    className="mini-item-cover mini-item-cover-placeholder"
                                    aria-hidden="true"
                                  >
                                    No cover available
                                  </div>
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
                                  <select
                                    className="mini-status-select"
                                    value={item.status}
                                    disabled={movingItemIds.has(item.id)}
                                    aria-label={`Move ${item.title} to another status`}
                                    onChange={(event) =>
                                      handleStatusChange(
                                        item,
                                        column.mediaType,
                                        event.target.value
                                      )
                                    }
                                  >
                                    {column.statuses.map((status) => (
                                      <option key={status.value} value={status.value}>
                                        {status.label}
                                      </option>
                                    ))}
                                  </select>
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
