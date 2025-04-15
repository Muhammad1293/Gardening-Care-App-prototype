import express from "express";
import pool from "../config/db.js"; // Database connection
import authMiddleware from "../middleware/authMiddleware.js"; // Protect routes

const router = express.Router();

/**
 *  POST: Add an observation for a tracked plant
 */
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { tracking_id, note, observation_type } = req.body;
    const user_id = req.user.id; // Extracted from JWT token

    // Ensure the tracking entry exists and belongs to the user
    const trackingCheck = await pool.query(
      "SELECT * FROM plant_tracking WHERE id = $1 AND user_id = $2",
      [tracking_id, user_id]
    );

    if (trackingCheck.rows.length === 0) {
      return res.status(404).json({ error: "Tracking entry not found or unauthorized" });
    }

    // Insert the observation entry
    const result = await pool.query(
      "INSERT INTO observations (tracking_id, note, observation_type) VALUES ($1, $2, $3) RETURNING *",
      [tracking_id, note, observation_type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(" Error adding observation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 *  GET: Get all observations for a tracked plant
 */
router.get("/:tracking_id", authMiddleware, async (req, res) => {
  try {
    const { tracking_id } = req.params;
    const user_id = req.user.id;

    // Ensure the tracking entry belongs to the user
    const trackingCheck = await pool.query(
      "SELECT * FROM plant_tracking WHERE id = $1 AND user_id = $2",
      [tracking_id, user_id]
    );

    if (trackingCheck.rows.length === 0) {
      return res.status(404).json({ error: "Tracking entry not found or unauthorized" });
    }

    // Retrieve observations
    const result = await pool.query(
      "SELECT * FROM observations WHERE tracking_id = $1 ORDER BY created_at DESC",
      [tracking_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(" Error fetching observations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
