import mangaDexService from "../services/mangaDexService.js";

const mangaController = {};

/* *****************************
 * Search Manga
 * ***************************** */
mangaController.searchManga = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required.",
      });
    }

    const manga = await mangaDexService.searchManga(query);
    //const result = manga["data"].find((a) => a["titles"][0]["title"] == query || a["titles"][1]["title"] == query);

    return res.status(200).json(manga);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* *****************************
 * Manga Details
 * ***************************** */
mangaController.getManga = async (req, res) => {
  try {
    const { id } = req.params;

    const manga = await mangaDexService.getManga(id);

    return res.status(200).json(manga);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


/* *****************************
 * Top Manga
 * ***************************** */
mangaController.getTopManga = async (req, res) => {
  try {
    const manga = await mangaDexService.getTopManga();

    return res.status(200).json(manga);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default mangaController;