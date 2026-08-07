import tmdbService from "../services/tmdbService.js";

const movieController = {};

movieController.searchMovies = async (req, res) => {
  try {
    const { query, page, genre } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query required.",
      });
    }

    const movies = await tmdbService.searchMovies(query, page, genre);

    res.json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Movie search is temporarily unavailable. Please try again.",
    });
  }
};

movieController.getMovie = async (req, res) => {
  try {
    const movie = await tmdbService.getMovie(req.params.id);

    res.json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Movie details are temporarily unavailable. Please try again.",
    });
  }
};

movieController.getTrending = async (req, res) => {
  try {
    const { page } = req.query;

    const movies = await tmdbService.getTrendingMovies(page);

    res.json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Trending movies are temporarily unavailable. Please try again.",
    });
  }
};

movieController.getPopular = async (req, res) => {
  try {
    const { page, genre } = req.query;

    const movies = await tmdbService.getPopularMovies(page, genre);

    res.json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Popular movies are temporarily unavailable. Please try again.",
    });
  }
};

movieController.getRecommendations = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: "Movie id required.",
      });
    }

    const movies = await tmdbService.getMovieRecommendations(id);

    res.json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Movie recommendations are temporarily unavailable. Please try again.",
    });
  }
};

export default movieController;
