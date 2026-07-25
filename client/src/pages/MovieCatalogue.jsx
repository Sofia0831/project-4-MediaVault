import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies, getPopularMovies, TMDB_IMAGE_BASE_URL } from "../services/tmdbApi";
import "./Media.css";

const MovieCatalogue = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState(""); 
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMoviesData = async () => {
      setLoading(true);
      let data;
      if (!activeQuery.trim()) {
        data = await getPopularMovies(currentPage);
      } else {
        data = await searchMovies(activeQuery, currentPage);
      }
      setMovies(data.results);
      setTotalPages(data.totalPages);
      setLoading(false);
    };

    fetchMoviesData();
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
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button type="submit" className="add-catalogue-btn">
          Search
        </button>
      </form>

      {loading ? (
        <div className="loading-state">Loading movies...</div>
      ) : (
        <>
          <div className="catalogue-grid">
            {movies.map((movie) => {
              const posterUrl = movie.poster_path
                ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                : "https://via.placeholder.com/200x300?text=No+Poster";

              return (
                <div
                  key={movie.id}
                  className="wireframe-media-card clickable-card"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                  <div className="poster-wrapper">
                    <img src={posterUrl} alt={movie.title} className="media-poster" />
                  </div>
                  <h3>{movie.title}</h3>
                  <p className="card-sub">{movie.release_date?.split("-")[0] || "N/A"}</p>
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

export default MovieCatalogue;