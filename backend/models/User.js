const pool = require("../config/db");

const createUser = async (username, email, hashedPassword, role, gardening_preferences = null) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password, role, gardening_preferences) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [username, email, hashedPassword, role, gardening_preferences]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

const updateUserProfile = async (email, username, gardening_preferences) => {
  const result = await pool.query(
    "UPDATE users SET username = $1, gardening_preferences = $2 WHERE email = $3 RETURNING *",
    [username, gardening_preferences, email]
  );
  return result.rows[0];
};

module.exports = { createUser, findUserByEmail, updateUserProfile };
