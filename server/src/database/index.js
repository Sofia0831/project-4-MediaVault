import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the .env file.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

/**
 * Test the database connection
 */
const testConnection = async () => {
  let client;

  try {
    client = await pool.connect();

    console.log("✅ Successfully connected to the Supabase PostgreSQL database.");

    const result = await client.query("SELECT NOW()");

    console.log("🕒 Database Time:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error.message);
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Run the connection test when the server starts
testConnection();

export default pool;