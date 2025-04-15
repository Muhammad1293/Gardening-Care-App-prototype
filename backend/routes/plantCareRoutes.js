import express from "express";
import pool from "../config/db.js"; // Database connection
import authMiddleware from "../middleware/authMiddleware.js"; // Protect routes

const router = express.Router();

/**
 *  GET: Fetch distinct locations, climates, and soil types
 */
router.get("/locations", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT location, climate, soil_type FROM plant_care_recommendations
    `);

    const locations = [...new Set(result.rows.map(row => row.location))];
    const climates = [...new Set(result.rows.map(row => row.climate))];
    const soilTypes = [...new Set(result.rows.map(row => row.soil_type))];

    res.json({ locations, climates, soilTypes });
  } catch (error) {
    console.error(" Error fetching dropdown data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// routes/plantCareRoutes.js

router.get("/auto-suggest", async (req, res) => {
  try {
    const { location, climate, soil_type } = req.query;

    const suggestedPlants = new Set();

    //  From plant_care_recommendations (priority suggestions)
    const recommendationQuery = `
      SELECT DISTINCT plant_name FROM plant_care_recommendations
      WHERE 
        ($1::text IS NULL OR location ILIKE $1) AND
        ($2::text IS NULL OR climate ILIKE $2) AND
        ($3::text IS NULL OR soil_type ILIKE $3)
    `;
    const recParams = [
      location || null,
      climate || null,
      soil_type || null,
    ];

    const recResult = await pool.query(recommendationQuery, recParams);
    recResult.rows.forEach((row) => suggestedPlants.add(row.plant_name));

    //  From plants table (fallback suggestions)
    const plantQuery = `
      SELECT DISTINCT name FROM plants
      WHERE 
        ($1::text IS NULL OR climate ILIKE $1) AND
        ($2::text IS NULL OR soil_type ILIKE $2)
    `;
    const plantParams = [
      climate || null,
      soil_type || null,
    ];

    const plantResult = await pool.query(plantQuery, plantParams);
    plantResult.rows.forEach((row) => suggestedPlants.add(row.name));

    res.json([...suggestedPlants]);
  } catch (error) {
    console.error(" Error in /auto-suggest:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});


/**
 *  GET: Fetch Personalized Plant Care Recommendations
 * Filters based on user-provided plant, location, climate, and soil type.
 */
router.get("/recommendations", authMiddleware, async (req, res) => {
  try {
    const { plant, location, climate, soil_type } = req.query;
    let query = "SELECT * FROM plant_care_recommendations WHERE 1=1";
    const params = [];

    if (plant) {
      params.push(plant);
      query += ` AND LOWER(plant_name) = LOWER($${params.length})`;
    }
    if (location) {
      params.push(location);
      query += ` AND LOWER(location) = LOWER($${params.length})`;
    }
    if (climate) {
      params.push(climate);
      query += ` AND LOWER(climate) = LOWER($${params.length})`;
    }
    if (soil_type) {
      params.push(soil_type);
      query += ` AND LOWER(soil_type) = LOWER($${params.length})`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(" Error fetching recommendations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
