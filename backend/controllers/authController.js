const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail, updateUserProfile } = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

// Register User with Role and Gardening Preferences
const registerUser = async (req, res) => {
  const { username, email, password, role, gardening_preferences } = req.body;

  try {
    if (!role) {
      return res.status(400).json({ msg: "Role is required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser(username, email, hashedPassword, role, gardening_preferences);

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: newUser.role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    // Assume req.user is populated by your auth middleware with { email: ... }
    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
      gardening_preferences: user.gardening_preferences,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update User Profile
const updateUserProfileHandler = async (req, res) => {
  const { username, gardening_preferences } = req.body;

  try {
    const updatedUser = await updateUserProfile(req.user.email, username, gardening_preferences);
    res.json({ msg: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile: updateUserProfileHandler };
