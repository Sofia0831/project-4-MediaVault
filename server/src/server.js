import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "MediaVault API is running",
  });
});

app.listen(PORT, () => {
  console.log(`MediaVault API running at http://localhost:${PORT}`);
  console.log(`Health check at http://localhost:${PORT}/api/health`);
});
