import tmdbService from "../services/tmdbService.js";

const tvController = {};

/* *****************************
 * Search TV Shows
 * *****************************/

tvController.searchTV = async (req, res) => {
    try {

        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                message: "Search query is required."
            });
        }

        const shows = await tmdbService.searchTV(query);

        return res.status(200).json(shows);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

/* *****************************
 * Get TV Details
 * *****************************/

tvController.getTV = async (req, res) => {

    try {

        const { id } = req.params;

        const show = await tmdbService.getTV(id);

        return res.status(200).json(show);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};

/* *****************************
 * Trending TV
 * *****************************/

tvController.getTrending = async (req, res) => {

    try {

        const shows = await tmdbService.getTrendingTV();

        return res.status(200).json(shows);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};

/* *****************************
 * Popular TV
 * *****************************/

tvController.getPopular = async (req, res) => {

    try {

        const shows = await tmdbService.getPopularTV();

        return res.status(200).json(shows);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};

/* *****************************
 * TV Recommendations
 * *****************************/

tvController.getRecommendations = async (req, res) => {

    try {

        const { id } = req.query;

        if (!id) {

            return res.status(400).json({
                message: "TV show id is required."
            });

        }

        const recommendations = await tmdbService.getTVRecommendations(id);

        return res.status(200).json(recommendations);

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};

export default tvController;