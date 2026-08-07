import openLibraryService from "../services/openLibraryService.js";

const bookController = {};

/* *****************************
 * Search Books
 * ***************************** */
bookController.searchBooks = async (req, res) => {
  try {

    const { query, subject } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required.",
      });
    }

    const books = await openLibraryService.searchBooks(query, page, limit, subject);

    return res.status(200).json(books);

  } catch (error) {

    return res.status(500).json({
      message: "Book search is temporarily unavailable. Please try again.",
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
      message: "Book details are temporarily unavailable. Please try again.",
    });

  }
};

/* *****************************
 * Book Details
 * ***************************** */
bookController.getAuthor = async (req, res) => {
  try {

    const { id } = req.params;

    const author = await openLibraryService.getAuthor(id);

    return res.status(200).json(author);

  } catch (error) {

    return res.status(500).json({
      message: "Author details are temporarily unavailable. Please try again.",
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
      message: "Book recommendations are temporarily unavailable. Please try again.",
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
    const { subject } = req.query;

    const books = await openLibraryService.getPopularBooks(page, limit, subject);
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: "Popular books are temporarily unavailable. Please try again.",
    });
  }
};

export default bookController;
