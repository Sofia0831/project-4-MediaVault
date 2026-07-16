import jwt from "jsonwebtoken";

export default function isLoggedIn(req) {
    const token = req.cookies?.token;

    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}