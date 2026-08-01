import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import isLoggedIn from "../utils/isLoggedIn.js";
import UserModel from "../models/userModel.js";

dotenv.config();

const authController = {};

/* *****************************
 * Register
 * ***************************** */
authController.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required.",
      });
    }

    // Check if email already exists
    const existingUser = await UserModel.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user
    const user = await UserModel.registerUser(
      username,
      email,
      passwordHash
    );

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log("Registered");

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true when using HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

/* *****************************
 * Login
 * ***************************** */
authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Already logged in?
    const decoded = isLoggedIn(req);

    if (decoded && decoded.email === email) {
      return res.status(400).json({
        message: "Already logged in.",
      });
    }

    // Find user in database
    const user = await UserModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email.",
      });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    console.log("Logged in");

    return res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

/* *****************************
 * Logout
 * ***************************** */
authController.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.json({
    message: "Logged out successfully.",
  });
};

/* *****************************
 * Protected Route
 * ***************************** */
authController.protected = async (req, res) => {
  try {
    const decoded = isLoggedIn(req);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid or expired token.",
      });
    }

    return res.status(200).json({
      message: "Access granted.",
      user: decoded,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export default authController;
