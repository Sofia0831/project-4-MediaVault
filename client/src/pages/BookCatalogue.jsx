import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchBooks, getPopularBooks } from "../services/googleBooksApi";
import "./Media.css";

const BookCatalogue = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooksData = async () => {
      setLoading(true);
      let data;
      if (!activeQuery.trim()) {
        data = await getPopularBooks(currentPage);
      } else {
        data = await searchBooks(activeQuery, currentPage);
      }
      setBooks(data.results);
      setTotalPages(data.totalPages);
      setLoading(false);
    };

    fetchBooksData();
  }, [currentPage, activeQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset back to page 1 on a new search
    setActiveQuery(searchQuery);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() === "") {
      setCurrentPage(1);
      setActiveQuery("");
    }
  };

  return (
    <div className="catalogue-page">
      <form className="catalogue-controls" onSubmit={handleSearch}>
        <input
          type="text"
          className="wireframe-search"
          placeholder="Search books..."
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button type="submit" className="add-catalogue-btn">
          Search
        </button>
      </form>

      {loading ? (
        <div className="loading-state">Loading books...</div>
      ) : (
        <>
          <div className="catalogue-grid">
            {books.map((book) => {
              const authorsText = book.authors?.length
                ? book.authors.join(", ")
                : "Unknown Author";

              return (
                <div
                  key={book.id}
                  className="wireframe-media-card clickable-card"
                  onClick={() => navigate(`/books/${book.id}`)}
                >
                  <div className="poster-wrapper">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="media-poster"
                    />
                  </div>
                  <h3>{book.title}</h3>
                  <p className="card-sub">{authorsText}</p>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="pagination-btn"
            >
              &laquo; Previous
            </button>

            <span className="page-indicator">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="pagination-btn"
            >
              Next &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookCatalogue;