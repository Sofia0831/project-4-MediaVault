import express from "express";
import mangaController from "../../controllers/mangaController.js";

const router = express.Router();

router.get("/search", mangaController.searchManga);

router.get("/top", mangaController.getTopManga);

router.get("/:id", mangaController.getManga);

export default router;