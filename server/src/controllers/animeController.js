import jikanService from "../services/jikanService.js";

const animeController = {};

/* *****************************
 * Search Anime
 * *****************************/

animeController.searchAnime = async (req, res) => {
  try {

    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required."
      });
    }
    
    const anime = await jikanService.searchAnime();
    const result = anime["data"].find((a) => a["titles"][0]["title"] == query || a["titles"][1]["title"] == query);

    return res.status(200).json(result);

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

/* *****************************
 * Anime Details
 * *****************************/

animeController.getAnime = async (req, res) => {

  try {

    const anime = await jikanService.getAnime(req.params.id);

    return res.status(200).json(anime);

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

};


/* *****************************
 * Top Anime
 * *****************************/

animeController.getTopAnime = async (req, res) => {

  try {

    const anime =
      await jikanService.getTopAnime();

    return res.status(200).json(anime);

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

};

/* *****************************
 * Current Season
 * *****************************/

animeController.getCurrentSeason = async (req, res) => {

  try {

    const anime =
      await jikanService.getSeasonNow();

    return res.status(200).json(anime);

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

};

/* *****************************
 * Upcoming Season
 * *****************************/

animeController.getUpcomingSeason = async (req, res) => {

  try {

    const anime =
      await jikanService.getSeasonUpcoming();

    return res.status(200).json(anime);

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

};

export default animeController;