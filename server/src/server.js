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
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);


app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "MediaVault API is running",
  });
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`MediaVault API running at http://localhost:${PORT}`);
  console.log(`Health check at http://localhost:${PORT}/api/health`);
});
