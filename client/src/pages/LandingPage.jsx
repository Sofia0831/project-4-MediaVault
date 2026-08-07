import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularBooks } from "../services/googleBooksApi";
import { getPopularMovies } from "../services/tmdbApi";
import useAuth from "../hooks/useAuth";
import "./LandingPage.css";

const AUTOPLAY_DELAY = 2000;
const TMDB_IMAGE_PATH = "https://image.tmdb.org/t/p";

const FALLBACK_SLIDES = [
  {
    id: "movie-fallback",
    type: "movie",
    label: "Movie spotlight",
    title: "Discover your next favorite movie",
    description: "Explore popular films and keep every title you love in one place.",
    image: null,
  },
  {
    id: "book-fallback",
    type: "book",
    label: "Featured read",
    title: "Build a shelf worth returning to",
    description: "Find memorable books, save them, and make your reading list your own.",
    image: null,
  },
];

const interleaveSlides = (movies, books) => {
  const slides = [];
  const count = Math.max(movies.length, books.length);

  for (let index = 0; index < count; index += 1) {
    if (movies[index]) slides.push(movies[index]);
    if (books[index]) slides.push(books[index]);
  }

  return slides;
};

const createMovieSlides = (movies) =>
  movies.slice(0, 4).map((movie) => ({
    id: `movie-${movie.id}`,
    type: "movie",
    label: "Popular movie",
    title: movie.title || "Untitled movie",
    description:
      movie.overview || "A popular movie waiting to be discovered in MediaVault.",
    detail: movie.release_date?.slice(0, 4) || "Now showing",
    image: movie.backdrop_path
      ? `${TMDB_IMAGE_PATH}/w1280${movie.backdrop_path}`
      : movie.poster_path
        ? `${TMDB_IMAGE_PATH}/w780${movie.poster_path}`
        : null,
  }));

const createBookSlides = (books) =>
  books.slice(0, 4).map((book) => ({
    id: `book-${book.id}`,
    type: "book",
    label: "Featured read",
    title: book.title || "Untitled book",
    description:
      book.description || "A featured book waiting to be discovered in MediaVault.",
    detail: book.authors?.length ? book.authors.join(", ") : "Author unavailable",
    image: book.thumbnail || null,
  }));

const LandingPage = () => {
  const { completeLogoutRedirect } = useAuth();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sourceErrors, setSourceErrors] = useState([]);
  const [failedImages, setFailedImages] = useState(() => new Set());
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    completeLogoutRedirect();
  }, [completeLogoutRedirect]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionQuery.matches);

    updateMotionPreference();
    motionQuery.addEventListener?.("change", updateMotionPreference);
    return () => motionQuery.removeEventListener?.("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadFeaturedMedia = async () => {
      setLoading(true);
      setSourceErrors([]);

      const [movieResult, bookResult] = await Promise.allSettled([
        getPopularMovies(1),
        getPopularBooks(1, 8),
      ]);

      if (ignore) return;

      const movies =
        movieResult.status === "fulfilled"
          ? createMovieSlides(movieResult.value.results)
          : [];
      const books =
        bookResult.status === "fulfilled"
          ? createBookSlides(bookResult.value.results)
          : [];
      const errors = [];

      if (movieResult.status === "rejected") errors.push("movies");
      if (bookResult.status === "rejected") errors.push("books");

      const nextSlides = interleaveSlides(movies, books);
      setSlides(nextSlides.length ? nextSlides : FALLBACK_SLIDES);
      setSourceErrors(errors);
      setCurrentIndex(0);
      setFailedImages(new Set());
      setLoading(false);
    };

    loadFeaturedMedia();
    return () => {
      ignore = true;
    };
  }, [requestVersion]);

  const showPrevious = useCallback(() => {
    setCurrentIndex((index) => (index - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((index) => (index + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (
      slides.length < 2 ||
      hoverPaused ||
      focusPaused ||
      reducedMotion ||
      loading
    ) {
      return undefined;
    }

    const timer = window.setTimeout(showNext, AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [
    currentIndex,
    focusPaused,
    hoverPaused,
    loading,
    reducedMotion,
    showNext,
    slides.length,
  ]);

  const nextIndex = slides.length ? (currentIndex + 1) % slides.length : 0;
  const activeSlide = slides[currentIndex];
  const statusMessage = useMemo(() => {
    if (loading) return "Loading featured movies and books.";
    if (sourceErrors.length === 2) {
      return "Live recommendations are unavailable. Showing MediaVault highlights instead.";
    }
    if (sourceErrors.length === 1) {
      return `Live ${sourceErrors[0]} are unavailable. Showing the available collection.`;
    }
    if (slides === FALLBACK_SLIDES) return "No featured media is available right now.";
    return "";
  }, [loading, slides, sourceErrors]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  const handleImageError = (slideId) => {
    setFailedImages((previous) => new Set(previous).add(slideId));
  };

  return (
    <main className={`landing-page${reducedMotion ? " reduce-motion" : ""}`}>
      <section
        className="cinematic-carousel"
        aria-roledescription="carousel"
        aria-label="Featured movies and books"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocusCapture={() => setFocusPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
        }}
        onKeyDown={handleKeyDown}
        tabIndex="0"
      >
        <div className="landing-carousel-stage" aria-live="off">
          {loading && <div className="carousel-placeholder" aria-hidden="true" />}

          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            const shouldLoadImage = isActive || index === nextIndex;
            const imageAvailable = slide.image && !failedImages.has(slide.id);

            return (
              <article
                className={`carousel-slide carousel-slide--${slide.type}${
                  isActive ? " is-active" : ""
                }`}
                key={slide.id}
                aria-hidden={!isActive}
                aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
              >
                {shouldLoadImage && imageAvailable ? (
                  <>
                    <img
                      className="slide-background"
                      src={slide.image}
                      alt=""
                      width="1280"
                      height="720"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      onError={() => handleImageError(slide.id)}
                    />
                    {slide.type === "book" && (
                      <img
                        className="book-cover-feature"
                        src={slide.image}
                        alt={`${slide.title} cover`}
                        width="320"
                        height="480"
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        onError={() => handleImageError(slide.id)}
                      />
                    )}
                  </>
                ) : (
                  <div className="missing-image" aria-hidden="true">
                    <span>{slide.type === "book" ? "MV" : "▶"}</span>
                  </div>
                )}
                <div className="slide-overlay" aria-hidden="true" />
              </article>
            );
          })}
        </div>

        <div className="welcome-panel">
          <p className="brand-kicker">Your stories. One place.</p>
          <h1>MediaVault</h1>
          <p className="welcome-copy">Welcome to your next great discovery.</p>
          <p className="app-explanation">
            Find movies and books, save what catches your eye, and build a personal
            shelf that grows with you.
          </p>
          <div className="welcome-actions">
            <Link className="landing-button landing-button--primary" to="/login">
              Log In
            </Link>
            <Link className="landing-button landing-button--secondary" to="/register">
              Register
            </Link>
          </div>
          {statusMessage && (
            <div
              className={`carousel-status${sourceErrors.length ? " has-error" : ""}`}
              role={sourceErrors.length ? "alert" : "status"}
            >
              <span>{statusMessage}</span>
              {sourceErrors.length > 0 && (
                <button type="button" onClick={() => setRequestVersion((value) => value + 1)}>
                  Try again
                </button>
              )}
            </div>
          )}
        </div>

        {activeSlide && (
          <div className="slide-caption" aria-live="polite" aria-atomic="true">
            <p>{activeSlide.label}</p>
            <h2>{activeSlide.title}</h2>
            <span>{activeSlide.detail}</span>
            <div className="caption-description">{activeSlide.description}</div>
          </div>
        )}

        {slides.length > 1 && (
          <div className="carousel-controls" aria-label="Carousel controls">
            <button
              className="landing-carousel-control"
              type="button"
              onClick={showPrevious}
              aria-label="Show previous featured item"
            >
              <span aria-hidden="true">←</span>
            </button>
            <p aria-live="polite" aria-atomic="true">
              <span className="sr-only">Item </span>
              {currentIndex + 1} / {slides.length}
            </p>
            <button
              className="landing-carousel-control"
              type="button"
              onClick={showNext}
              aria-label="Show next featured item"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default LandingPage;
