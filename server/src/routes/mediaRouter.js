import express from "express";

import mediaController from "../controllers/mediaController.js";

import movieRouter from "./mediaRoutes/movieRouter.js";
import tvRouter from "./mediaRoutes/tvRouter.js";
import animeRouter from "./mediaRoutes/animeRouter.js";
import mangaRouter from "./mediaRoutes/mangaRouter.js";
import bookRouter from "./mediaRoutes/bookRouter.js";

const router = express.Router();

/* ======================================================
 * Global Search
 * ====================================================== */

router.get("/search", mediaController.globalSearch);

/* ======================================================
 * Dashboard
 * ====================================================== */

router.get("/dashboard", mediaController.dashboard);

/* ======================================================
 * User Shelf
 * ====================================================== */

// Get all media in the user's shelf
router.get("/shelf", mediaController.getShelf);

// Get a specific shelf item
router.get("/shelf/:id", mediaController.getShelfItem);

// Add media to shelf
router.post("/shelf", mediaController.addToShelf);

// Update user's log (status, rating, review, dates)
router.put("/shelf/:id", mediaController.updateUserLog);

// Remove media from shelf
router.delete("/shelf/:id", mediaController.deleteShelfItem);

/* ======================================================
 * Individual Media APIs
 * ====================================================== */

router.use("/movies", movieRouter);

router.use("/tv", tvRouter);

router.use("/anime", animeRouter);

router.use("/manga", mangaRouter);

router.use("/books", bookRouter);

export default router;