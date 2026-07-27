import express from "express";
import bookController from "../../controllers/bookController.js";

const router = express.Router();

router.get("/search", bookController.searchBooks);

router.get("/popular", bookController.getPopularBooks);

router.get("/recommendations", bookController.getRecommendations);

router.get("/:id", bookController.getBook);

export default router;