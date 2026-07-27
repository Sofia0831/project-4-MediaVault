import express from "express";
import animeController from "../../controllers/animeController.js";

const router = express.Router();

router.get("/search", animeController.searchAnime);

router.get("/top", animeController.getTopAnime);

router.get("/season/current", animeController.getCurrentSeason);

router.get("/season/upcoming", animeController.getUpcomingSeason);

router.get("/:id", animeController.getAnime);

export default router;