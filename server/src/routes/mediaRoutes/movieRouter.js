import express from "express";
import movieController from "../../controllers/movieController.js";

const router = express.Router();


router.get("/search", movieController.searchMovies);

router.get("/trending", movieController.getTrending);

router.get("/popular", movieController.getPopular);

router.get("/recommendations", movieController.getRecommendations);

router.get("/:id", movieController.getMovie);

export default router;