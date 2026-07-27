import mediaModel from "../models/mediaModel.js";
import isLoggedIn from "../utils/isLoggedIn.js";
import jikanService from "../services/jikanService.js";
import openLibraryService from "../services/openLibraryService.js";
import mangaDexService from "../services/mangaDexService.js";
import tmdbService from "../services/tmdbService.js";

const mediaController = {};

mediaController.globalSearch = async (req, res) => {
    try{
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                message: "Search query is required."
            });
        }

        var result = [];
        result.push(await openLibraryService.searchBooks(query));
        result.push(await mangaDexService.searchManga(query));
        result.push(await tmdbService.searchTV(query));
        result.push(await tmdbService.searchMovies(query));
        const anime = await jikanService.searchAnime();
        result.push(anime["data"].find((a) => a["titles"][0]["title"] == query || a["titles"][1]["title"] == query));


        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
}

/* ******************************
 * Get User Shelf
 * ****************************** */

mediaController.getShelf = async (req, res) => {

    try {

        const user = isLoggedIn(req);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const shelf = await mediaModel.getShelf(user.id);

        res.json(shelf);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* ****************************************
 * Get User Shelf
 **************************************** */

mediaController.getShelf = async (req, res) => {

    try {

        const user = isLoggedIn(req);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const shelf = await mediaModel.getShelf(user.id);

        res.status(200).json(shelf);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* ****************************************
 * Get One Shelf Item
 **************************************** */

mediaController.getShelfItem = async (req, res) => {

    try {

        const user = isLoggedIn(req);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const item = await mediaModel.getShelfItem(req.params.id);

        if (!item || item.user_id !== user.id) {
            return res.status(404).json({
                message: "Media not found."
            });
        }

        res.status(200).json(item);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* ****************************************
 * Add Media To Shelf
 **************************************** */

mediaController.addToShelf = async (req, res) => {

    try {

        const user = isLoggedIn(req);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const existing = await mediaModel.getExistingMedia(
            user.id,
            req.body.external_id,
            req.body.media_type,
            req.body.external_source
        );

        if (existing) {
            return res.status(409).json({
                message: "Media already exists in your shelf."
            });
        }

        const media = await mediaModel.addToShelf(user.id, req.body);

        res.status(201).json(media);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* ****************************************
 * Update User Log
 **************************************** */

mediaController.updateUserLog = async (req, res) => {

    try {

        const user = isLoggedIn(req);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const item = await mediaModel.getShelfItem(req.params.id);

        var {
            status,
            rating,
            review,
            started_at,
            completed_at
        } = req.body;

        if (
            rating !== undefined &&
            rating !== null &&
            (rating < 1 || rating > 5)
        ) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5."
            });
        }

        if (status == null){
            status = item.status;
        }
        if (rating == null) {
            rating = item.rating;
        }
        if (review == null){
            review = item.review;
        }
        if (started_at == null){
            started_at = item.started_at;
        }
        if (completed_at == null){
            completed_at = item.completed_at;
        }

        const updated = await mediaModel.updateUserLog(
            req.params.id,
            user.id,
            {
                status,
                rating,
                review,
                started_at,
                completed_at
            }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Media not found."
            });
        }

        res.status(200).json(updated);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* ****************************************
 * Delete Shelf Item
 **************************************** */

mediaController.deleteShelfItem = async (req, res) => {

    try {

        const user = isLoggedIn(req);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const deleted = await mediaModel.deleteShelfItem(
            req.params.id,
            user.id
        );

        if (!deleted) {
            return res.status(404).json({
                message: "Media not found."
            });
        }

        res.status(200).json({
            message: "Media removed from shelf."
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* ****************************************
 * Dashboard
 **************************************** */

mediaController.dashboard = async (req, res) => {

    try {

        const user = isLoggedIn(req);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const stats = await mediaModel.getDashboardStats(user.id);
        const recent = await mediaModel.getRecent(user.id);
        const inProgress = await mediaModel.getInProgress(user.id);

        res.status(200).json({
            stats,
            recent,
            inProgress
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export default mediaController;