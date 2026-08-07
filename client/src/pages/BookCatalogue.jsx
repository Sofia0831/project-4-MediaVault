import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookCover from "../components/BookCover";
import { searchBooks, getPopularBooks } from "../services/googleBooksApi";
import "./Media.css";

const BOOK_SUBJECTS = [
  ["", "All Subjects"],
  ["fiction", "Fiction"],
  ["nonfiction", "Nonfiction"],
  ["mystery", "Mystery"],
  ["romance", "Romance"],
  ["fantasy", "Fantasy"],
  ["science fiction", "Science Fiction"],
  ["horror", "Horror"],
  ["biography", "Biography"],
  ["history", "History"],
  ["religion", "Religion"],
  ["young adult", "Young Adult"],
];

const BookCatalogue = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const fetchBooksData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = activeQuery.trim()
          ? await searchBooks(activeQuery, currentPage, 20, selectedSubject)
          : await getPopularBooks(currentPage, 20, selectedSubject);

        if (!ignore) {
          setBooks(data.results);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        if (!ignore) {
          setBooks([]);
          setTotalPages(1);
          setError(err.message || "Unable to load books. Please try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBooksData();
    return () => {
      ignore = true;
    };
  }, [currentPage, activeQuery, selectedSubject]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset back to page 1 on a new search
    setActiveQuery(searchQuery);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveQuery("");
    setSelectedSubject("");
    setCurrentPage(1);
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
        <div className="catalogue-field search-field">
          <label htmlFor="book-search">Search books</label>
          <input
            id="book-search"
            type="search"
            className="wireframe-search"
            placeholder="Title, author, or keyword"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch(event);
            }}
          />
        </div>
        <div className="catalogue-field filter-field">
          <label htmlFor="book-subject">Subject</label>
          <select
            id="book-subject"
            className="catalogue-select"
            value={selectedSubject}
            onChange={handleSubjectChange}
          >
            {BOOK_SUBJECTS.map(([value, label]) => (
              <option key={label} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="add-catalogue-btn">
          Search
        </button>
        <button
          type="button"
          className="clear-catalogue-btn"
          onClick={clearFilters}
          disabled={!searchQuery && !activeQuery && !selectedSubject}
        >
          Clear
        </button>
      </form>

      {loading ? (
        <div className="loading-state" role="status">Loading books...</div>
      ) : error ? (
        <div className="catalogue-message catalogue-error" role="alert">
          <h2>We couldn’t load books.</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {books.length === 0 && (
            <div className="catalogue-message" role="status">
              <h2>No matching books found.</h2>
              <p>Try another title, author, subject, or clear the filters.</p>
            </div>
          )}
          <div className="catalogue-grid">
            {books.map((book, index) => {
              const authorsText = book.authors?.length
                ? book.authors.join(", ")
                : "Unknown Author";

              return (
                <div
                  key={book.id}
                  className="wireframe-media-card clickable-card book-catalogue-card"
                  onClick={() => navigate(`/books/${book.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/books/${book.id}`);
                    }
                  }}
                  role="link"
                  tabIndex={0}
                >
                  <div className="poster-wrapper">
                    <BookCover
                      src={book.thumbnail}
                      alt={`${book.title} cover`}
                      className="media-poster"
                      width="500"
                      height="750"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                  </div>
                  <h3>{book.title}</h3>
                  <p className="card-sub">{authorsText}</p>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && <div className="pagination-controls">
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
          </div>}
        </>
      )}
    </div>
  );
};

export default BookCatalogue;
