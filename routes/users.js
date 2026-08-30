const express = require("express");

const router = express.Router();

// Temporary in-memory users.
// We will replace this with a real database later.
const users = [];

// Create a user
router.post("/", (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists"
    });
  }

  const user = {
    id: Date.now().toString(),
    name,
    email,
    role: role || "buyer",
    verified: false,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user
  });
});

// Get all users
router.get("/", (req, res) => {
  res.json({
    success: true,
    users
  });
});

module.exports = router;
