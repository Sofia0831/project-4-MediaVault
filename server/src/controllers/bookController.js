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

    const item = await openLibraryService.getBook(id);

    // Fetch work details
    if (item.works?.length) {
      const workId = item.works[0].key.replace("/works/", "");

      const work = await openLibraryService.getBook(workId);

      item.title = work.title;
      item.description = work.description;

      if (!(item.subject || item.subjects) && (work.subjects || work.subject)) {
        item.subjects = work.subjects || work.subject;
      }

      if (!(item.authors || item.author_key)) {
        item.authors = work.authors;
      }

      if (work.covers?.length) {
        item.cover_i = work.covers[0];
      }
    }

    // Fetch author names
    const authorRefs =
      item.authors?.map((author) => author.key || author.author?.key) ||
      item.author_key?.map((key) => `/authors/${key}`) ||
      [];

    if (authorRefs.length) {
      const authorNames = await Promise.all(
        authorRefs.map(async (authorPath) => {
          try {
            const authorId = authorPath.replace("/authors/", "");
            const author = await openLibraryService.getAuthor(authorId);
            return author.name;
          } catch {
            return null;
          }
        })
      );

      item.author_name = authorNames.filter(Boolean);
    }

    return res.status(200).json(item);
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