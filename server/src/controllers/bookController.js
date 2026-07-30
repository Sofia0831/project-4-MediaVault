import openLibraryService from "../services/openLibraryService.js";

const bookController = {};

/* *****************************
 * Search Books
 * ***************************** */
bookController.searchBooks = async (req, res) => {
  try {

    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required.",
      });
    }

    const books = await openLibraryService.searchBooks(query);

    return res.status(200).json(books);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

/* *****************************
 * Book Details
 * ***************************** */
bookController.getBook = async (req, res) => {
  try {

    const { id } = req.params;

    const book = await openLibraryService.getBook(id);

    return res.status(200).json(book);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

/* *****************************
 * Recommendations
 * ***************************** */
bookController.getRecommendations = async (req, res) => {
  try {

    const books =
      await openLibraryService.getRecommendations();

    return res.status(200).json(books);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

/* *****************************
 * Popular Books
 * ***************************** */
bookController.getPopularBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const books = await openLibraryService.getPopularBooks(page, limit);
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default bookController;