import express from "express";
import tvController from "../../controllers/tvController.js";

const router = express.Router();

router.get("/search", tvController.searchTV);

router.get("/trending", tvController.getTrending);

router.get("/popular", tvController.getPopular);

router.get("/recommendations", tvController.getRecommendations);

router.get("/:id", tvController.getTV);

export default router;