const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    status: "online",
    message: "Xelz API is healthy 🚀"
  });
});

module.exports = router;
