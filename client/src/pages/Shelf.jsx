import React from "react";
import { useNavigate } from "react-router-dom";
import "./Shelf.css";

// mock data
const INITIAL_DATA = [
  { id: "1", title: "Inception", media_type: "movie", status: "plan" },
  { id: "2", title: "Interstellar", media_type: "movie", status: "in_progress" },
  { id: "3", title: "Dune", media_type: "movie", status: "completed" },
  { id: "4", title: "1984", media_type: "book", status: "plan" },
  { id: "5", title: "The Hobbit", media_type: "book", status: "completed" },
];

const Shelf = ({ mediaItems = INITIAL_DATA }) => {
  const navigate = useNavigate();

  // Helper to filter items easily
  const getItems = (type, status) =>
    mediaItems.filter((item) => item.media_type === type && item.status === status);

  return (
    <div className="shelf-dashboard">
      <div className="shelf-columns-container">

        {/* ================= MOVIE COLUMN ================= */}
        <div className="shelf-column">
          <button className="category-banner-btn" onClick={() => navigate("/movies")}>
            Movie Catalogue
          </button>

          {/* My Watchlist */}
          <div className="status-box">
            <div className="status-header">My Watchlist</div>
            <div className="status-content">
              {getItems("movie", "plan").length > 0 ? (
                getItems("movie", "plan").map((item) => (
                  <div key={item.id} className="mini-item-card">{item.title}</div>
                ))
              ) : (
                <p className="placeholder-text">List of all movies tagged to watch</p>
              )}
            </div>
          </div>

          {/* Currently Watching */}
          <div className="status-box">
            <div className="status-header">Currently watching</div>
            <div className="status-content">
              {getItems("movie", "in_progress").map((item) => (
                <div key={item.id} className="mini-item-card">{item.title}</div>
              ))}
            </div>
          </div>

          {/* Have Watched */}
          <div className="status-box">
            <div className="status-header">Have Watched</div>
            <div className="status-content">
              {getItems("movie", "completed").length > 0 ? (
                getItems("movie", "completed").map((item) => (
                  <div key={item.id} className="mini-item-card">{item.title}</div>
                ))
              ) : (
                <p className="placeholder-text">All movies tagged have watched</p>
              )}
            </div>
          </div>
        </div>

        {/* ================= BOOK COLUMN ================= */}
        <div className="shelf-column">
          <button className="category-banner-btn" onClick={() => navigate("/books")}>
            Book Shelf
          </button>

          {/* My Reading List */}
          <div className="status-box">
            <div className="status-header">My Reading List</div>
            <div className="status-content">
              {getItems("book", "plan").length > 0 ? (
                getItems("book", "plan").map((item) => (
                  <div key={item.id} className="mini-item-card">{item.title}</div>
                ))
              ) : (
                <p className="placeholder-text">All books tagged to read</p>
              )}
            </div>
          </div>

          {/* Currently Reading */}
          <div className="status-box">
            <div className="status-header">Currently Reading</div>
            <div className="status-content">
              {getItems("book", "in_progress").map((item) => (
                <div key={item.id} className="mini-item-card">{item.title}</div>
              ))}
            </div>
          </div>

          {/* Have Read */}
          <div className="status-box">
            <div className="status-header">Have Read</div>
            <div className="status-content">
              {getItems("book", "completed").length > 0 ? (
                getItems("book", "completed").map((item) => (
                  <div key={item.id} className="mini-item-card">{item.title}</div>
                ))
              ) : (
                <p className="placeholder-text">All books tagged have read</p>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Shelf;