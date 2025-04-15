import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [decoded.user_id]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware; //  Use "export default"
