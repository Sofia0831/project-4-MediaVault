import jwt from "jsonwebtoken";
import express from "express";
import authRouter from "./auth.js";
import UserModel from "../models/userModel.js"

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello Express!");
});

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "MediaVault API is running",
  });
});


router.use("/auth", authRouter);



export default router;