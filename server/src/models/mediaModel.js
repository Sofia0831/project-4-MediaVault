import pool from "../database/index.js";

const mediaModel = {};

/* *********************************
 * Get Entire Shelf
 * ********************************* */
mediaModel.getShelf = async (userId) => {
    const sql = `
        SELECT
            id,
            media_type,
            external_source,
            external_id,
            title,
            creator,
            cover_url,
            release_year,
            genres,
            status,
            rating,
            review
        FROM user_media_logs
        WHERE user_id = $1
        ORDER BY updated_at DESC
    `;

    const result = await pool.query(sql, [userId]);
    return result.rows;
};

/* *********************************
 * Get One Item
 * ********************************* */
mediaModel.getShelfItem = async (id, userId) => {
    const sql = `
        SELECT *
        FROM user_media_logs
        WHERE id = $1
          AND user_id = $2
    `;

    const result = await pool.query(sql, [id, userId]);
    return result.rows[0];
};

/* *********************************
 * Check Existing Media
 * ********************************* */
mediaModel.getExistingMedia = async (
    userId,
    externalId,
    mediaType,
    externalSource
) => {

    const sql = `
        SELECT *
        FROM user_media_logs
        WHERE
            user_id = $1
            AND external_id = $2
            AND media_type = $3
            AND external_source = $4
    `;

    const values = [
        userId,
        externalId,
        mediaType,
        externalSource
    ];

    const result = await pool.query(sql, values);

    return result.rows[0];
};

/* *********************************
 * Add Media To Shelf
 * ********************************* */
mediaModel.addToShelf = async (userId, media) => {

    const sql = `
        INSERT INTO user_media_logs (
            user_id,
            media_type,
            external_source,
            external_id,
            title,
            creator,
            cover_url,
            release_year,
            genres,
            status,
            rating,
            review,
            started_at,
            completed_at
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,
            $10,$11,$12,$13,$14
        )
        RETURNING *;
    `;

    const values = [
        userId,
        media.media_type,
        media.external_source,
        media.external_id,
        media.title,
        media.creator,
        media.cover_url,
        media.release_year,
        media.genres,
        media.status || "plan",
        media.rating || null,
        media.review || null,
        media.started_at || null,
        media.completed_at || null
    ];

    const result = await pool.query(sql, values);

    return result.rows[0];
};

/* *********************************
 * Update User Log
 * ********************************* */
mediaModel.updateUserLog = async (id, userId, data) => {
    

    const sql = `
        UPDATE user_media_logs
        SET
            status = $1,
            rating = $2,
            review = $3,
            started_at = $4,
            completed_at = $5,
            updated_at = NOW()
        WHERE
            id = $6
            AND user_id = $7
        RETURNING *;
    `;

    const values = [
        data.status,
        data.rating,
        data.review,
        data.started_at,
        data.completed_at,
        id,
        userId
    ];

    const result = await pool.query(sql, values);

    return result.rows[0];
};

/* *********************************
 * Delete Shelf Item
 * ********************************* */
mediaModel.deleteShelfItem = async (id, userId) => {

    const sql = `
        DELETE FROM user_media_logs
        WHERE
            id = $1
            AND user_id = $2
        RETURNING *;
    `;

    const result = await pool.query(sql, [id, userId]);

    return result.rows[0];
};

/* *********************************
 * Dashboard Statistics
 * ********************************* */
mediaModel.getDashboardStats = async (userId) => {

    const sql = `
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (WHERE status = 'plan') AS planned,
            COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
            COUNT(*) FILTER (WHERE status = 'completed') AS completed,
            ROUND(AVG(rating), 1) AS average_rating
        FROM user_media_logs
        WHERE user_id = $1;
    `;

    const result = await pool.query(sql, [userId]);

    return result.rows[0];
};

/* *********************************
 * Recent Activity
 * ********************************* */
mediaModel.getRecent = async (userId) => {

    const sql = `
        SELECT *
        FROM user_media_logs
        WHERE user_id = $1
        ORDER BY updated_at DESC
        LIMIT 10;
    `;

    const result = await pool.query(sql, [userId]);

    return result.rows;
};

/* *********************************
 * Continue Watching/Reading
 * ********************************* */
mediaModel.getInProgress = async (userId) => {

    const sql = `
        SELECT *
        FROM user_media_logs
        WHERE
            user_id = $1
            AND status = 'in_progress'
        ORDER BY updated_at DESC;
    `;

    const result = await pool.query(sql, [userId]);

    return result.rows;
};

export default mediaModel;
