import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies, getPopularMovies, TMDB_IMAGE_BASE_URL } from "../services/tmdbApi";
import "./Media.css";

const MOVIE_GENRES = [
  ["", "All Genres"],
  ["28", "Action"],
  ["12", "Adventure"],
  ["16", "Animation"],
  ["35", "Comedy"],
  ["80", "Crime"],
  ["99", "Documentary"],
  ["18", "Drama"],
  ["10751", "Family"],
  ["14", "Fantasy"],
  ["36", "History"],
  ["27", "Horror"],
  ["9648", "Mystery"],
  ["10749", "Romance"],
  ["878", "Science Fiction"],
  ["53", "Thriller"],
  ["10752", "War"],
  ["37", "Western"],
];

const MovieCatalogue = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    const fetchMoviesData = async () => {
      try {
        setLoading(true);
        setError("");
        const data = activeQuery.trim()
          ? await searchMovies(activeQuery, currentPage, selectedGenre)
          : await getPopularMovies(currentPage, selectedGenre);

        if (!ignore) {
          setMovies(data.results);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        if (!ignore) {
          setMovies([]);
          setTotalPages(1);
          setError(err.message || "Unable to load movies. Please try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchMoviesData();
    return () => {
      ignore = true;
    };
  }, [currentPage, activeQuery, selectedGenre]);

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

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveQuery("");
    setSelectedGenre("");
    setCurrentPage(1);
  };

  return (
    <div className="catalogue-page">
      <form className="catalogue-controls" onSubmit={handleSearch}>
        <div className="catalogue-field search-field">
          <label htmlFor="movie-search">Search movies</label>
          <input
            id="movie-search"
            type="search"
            className="wireframe-search"
            placeholder="Title or keyword"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch(event);
            }}
          />
        </div>
        <div className="catalogue-field filter-field">
          <label htmlFor="movie-genre">Genre</label>
          <select
            id="movie-genre"
            className="catalogue-select"
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            {MOVIE_GENRES.map(([value, label]) => (
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
          disabled={!searchQuery && !activeQuery && !selectedGenre}
        >
          Clear
        </button>
      </form>

      {loading ? (
        <div className="loading-state" role="status">Loading movies...</div>
      ) : error ? (
        <div className="catalogue-message catalogue-error" role="alert">
          <h2>We couldn’t load movies.</h2>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {movies.length === 0 && (
            <div className="catalogue-message" role="status">
              <h2>No matching movies found.</h2>
              <p>Try another title, genre, or clear the filters.</p>
            </div>
          )}
          <div className="catalogue-grid">
            {movies.map((movie, index) => {
              const posterUrl = movie.poster_path
                ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                : "https://via.placeholder.com/200x300?text=No+Poster";

              return (
                <div
                  key={movie.id}
                  className="wireframe-media-card clickable-card"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/movies/${movie.id}`);
                    }
                  }}
                  role="link"
                  tabIndex={0}
                >
                  <div className="poster-wrapper">
                    <img
                      src={posterUrl}
                      alt={`${movie.title} poster`}
                      className="media-poster"
                      width="500"
                      height="750"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                  </div>
                  <h3>{movie.title}</h3>
                  <p className="card-sub">{movie.release_date?.split("-")[0] || "N/A"}</p>
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

export default MovieCatalogue;
