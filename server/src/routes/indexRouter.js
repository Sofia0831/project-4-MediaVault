import jwt from "jsonwebtoken";
import express from "express";
import authRouter from "./authRouter.js";
import UserModel from "../models/userModel.js";
import mediaRouter from "./mediaRouter.js";

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

router.use("/media", mediaRouter);



export default router;