import dotenv from "dotenv";
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import isLoggedIn from "../utils/isLoggedIn.js"; 

dotenv.config();

const users = [];

const authController = {};

// Register
authController.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required."
      });
    }

    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      username,
      password: hashedPassword
    });

    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,      // true when using HTTPS
        sameSite: "lax",
        maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.status(201).json({
      message: "User registered successfully."
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Login
authController.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);

    const decoded = isLoggedIn(req);

    if (decoded && decoded.username === username) {
        return res.status(400).json({
            message: "Already logged in."
        });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials."
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials."
      });
    }

    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,      // true when using HTTPS
        sameSite: "lax",
        maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.json({
        message: "Login successful"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

authController.logout = async (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false // change to true when using HTTPS
        });
        res.json({ message: 'Logged out successfully' });
    }
    
};

// Protected
authController.protected = async (req, res) => {
  try {
    var decoded = isLoggedIn(req, res);
    console.log(decoded);

    res.status(200).json({
      message: "Access granted.",
      user: decoded
    });

  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};

export default authController;