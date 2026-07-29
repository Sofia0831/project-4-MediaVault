import tmdbService from "../services/tmdbService.js";

const movieController = {};

movieController.searchMovies = async (req, res) => {
  try {
    const { query, page } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query required.",
      });
    }

    const movies = await tmdbService.searchMovies(query, page);

    res.json(movies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

movieController.getMovie = async (req, res) => {
  try {
    const movie = await tmdbService.getMovie(req.params.id);

    res.json(movie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
      message: error.message,
    });
  }
};

movieController.getPopular = async (req, res) => {
  try {
    const { page } = req.query;

    const movies = await tmdbService.getPopularMovies(page);

    res.json(movies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
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
      message: error.message,
    });
  }
};

export default movieController;