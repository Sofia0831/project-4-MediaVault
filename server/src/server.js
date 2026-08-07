import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import router from "./routes/indexRouter.js";
import pool from "./database/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

const configuredClientOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
const allowedClientOrigins = new Set(configuredClientOrigins);

for (const origin of configuredClientOrigins) {
  try {
    const url = new URL(origin);
    if (url.hostname === "localhost") {
      url.hostname = "127.0.0.1";
      allowedClientOrigins.add(url.origin);
    } else if (url.hostname === "127.0.0.1") {
      url.hostname = "localhost";
      allowedClientOrigins.add(url.origin);
    }
  } catch {
    // Invalid configured origins remain unavailable rather than opening CORS broadly.
  }
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedClientOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin is not allowed by CORS."));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api", router);

app.listen(PORT, () => {
  console.log(`MediaVault API running at http://localhost:${PORT}`);
  console.log(`Health check at http://localhost:${PORT}/api/health`);
});
