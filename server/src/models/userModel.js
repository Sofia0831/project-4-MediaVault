import pool from "../database/index.js";

const UserModel = {};

/* *****************************
 * Register User
 * ***************************** */
UserModel.registerUser = async (username, email, passwordHash) => {
  try {
    const sql = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at;
    `;

    const result = await pool.query(sql, [
      username,
      email,
      passwordHash,
    ]);

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

/* *****************************
 * Check Existing Email
 * ***************************** */
UserModel.checkExistingEmail = async (email) => {
  try {
    const sql = `
      SELECT 1
      FROM users
      WHERE email = $1
      LIMIT 1;
    `;

    const result = await pool.query(sql, [email]);

    return result.rowCount > 0;
  } catch (error) {
    throw error;
  }
};

/* *****************************
 * Get User by Email
 * ***************************** */
UserModel.getUserByEmail = async (email) => {
  try {
    const sql = `
      SELECT id, username, email, password_hash
      FROM users
      WHERE email = $1;
    `;

    const result = await pool.query(sql, [email]);

    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/* *****************************
 * Get User by ID
 * ***************************** */
UserModel.getUserById = async (id) => {
  try {
    const sql = `
      SELECT id, username, email, password_hash
      FROM users
      WHERE id = $1;
    `;

    const result = await pool.query(sql, [id]);

    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/* *****************************
 * Update Account Info
 * ***************************** */
UserModel.updateAccountInfo = async (username, email, id) => {
  try {
    const sql = `
      UPDATE users
      SET
        username = $1,
        email = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING id, username, email, updated_at;
    `;

    const result = await pool.query(sql, [
      username,
      email,
      id,
    ]);

    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/* *****************************
 * Update Password
 * ***************************** */
UserModel.updatePassword = async (passwordHash, id) => {
  try {
    const sql = `
      UPDATE users
      SET
        password_hash = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING id;
    `;

    const result = await pool.query(sql, [
      passwordHash,
      id,
    ]);

    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export default UserModel;