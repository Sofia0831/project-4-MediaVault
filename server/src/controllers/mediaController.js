import mediaModel from "../models/mediaModel.js";
import isLoggedIn from "../utils/isLoggedIn.js";
import jikanService from "../services/jikanService.js";
import openLibraryService from "../services/openLibraryService.js";
import mangaDexService from "../services/mangaDexService.js";
import tmdbService from "../services/tmdbService.js";
import { validateRating, validateStatus } from "../utils/mediaValidation.js";
import { normalizeMediaBookCover } from "../utils/bookCovers.js";

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
            message: "Search is temporarily unavailable. Please try again."
        });

    }
}

/* ****************************************
 * Get User Shelf
 **************************************** */

mediaController.getShelf = async (req, res) => {

    try {

        const user = isLoggedIn(req);

        if (!user) {
            return res.status(401).json({
                message: "Your session has expired or login is required."
            });
        }

        const shelf = await mediaModel.getShelf(user.id);

        res.status(200).json(shelf.map(normalizeMediaBookCover));

    } catch (error) {

        res.status(500).json({
            message: "Unable to load your shelf right now. Please try again."
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
                message: "Your session has expired or login is required."
            });
        }

        const item = await mediaModel.getShelfItem(req.params.id, user.id);

        if (!item) {
            return res.status(404).json({
                message: "Media not found."
            });
        }

        res.status(200).json(normalizeMediaBookCover(item));

    } catch (error) {

        res.status(500).json({
            message: "Unable to load this saved item right now. Please try again."
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
                message: "Your session has expired or login is required."
            });
        }

        const mediaPayload = normalizeMediaBookCover(req.body);
        const statusError = validateStatus(mediaPayload.status);
        const ratingError = validateRating(mediaPayload.rating);
        if (statusError || ratingError) {
            return res.status(400).json({ message: statusError || ratingError });
        }

        const existing = await mediaModel.getExistingMedia(
            user.id,
            mediaPayload.external_id,
            mediaPayload.media_type,
            mediaPayload.external_source
        );

        if (existing) {
            return res.status(409).json({
                message: "Media already exists in your shelf."
            });
        }

        const media = await mediaModel.addToShelf(user.id, mediaPayload);

        res.status(201).json(normalizeMediaBookCover(media));

    } catch (error) {

        res.status(500).json({
            message: "Unable to save this item right now. Please try again."
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
                message: "Your session has expired or login is required."
            });
        }

        const item = await mediaModel.getShelfItem(req.params.id, user.id);

        if (!item) {
            return res.status(404).json({
                message: "Media not found."
            });
        }

        var {
            status,
            rating,
            review,
            started_at,
            completed_at
        } = req.body;
        
        const statusError = validateStatus(status);
        const ratingError = validateRating(rating);
        if (statusError || ratingError) {
            return res.status(400).json({ message: statusError || ratingError });
        }

        if (status == null){
            status = item.status;
        }
        if (rating == null) {
            rating = item.rating;
        }
        if (!Object.prototype.hasOwnProperty.call(req.body, "review")){
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

        res.status(200).json(normalizeMediaBookCover(updated));

    } catch (error) {
        res.status(500).json({
            message: "Unable to update this saved item right now. Please try again."
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
                message: "Your session has expired or login is required."
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
            message: "Unable to remove this saved item right now. Please try again."
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
                message: "Your session has expired or login is required."
            });
        }

        const stats = await mediaModel.getDashboardStats(user.id);
        const recent = await mediaModel.getRecent(user.id);
        const inProgress = await mediaModel.getInProgress(user.id);

        res.status(200).json({
            stats,
            recent: recent.map(normalizeMediaBookCover),
            inProgress: inProgress.map(normalizeMediaBookCover)
        });

    } catch (error) {

        res.status(500).json({
            message: "Unable to load the dashboard right now. Please try again."
        });

    }

};

export default mediaController;
