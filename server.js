const express = require("express");
const cors = require("cors");
require("dotenv").config();

const healthRoutes = require("./routes/health");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Xelz Backend 🚀",
    version: "1.0.0"
  });
});

app.use("/api/health", healthRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Xelz Backend running on port ${PORT}`);
});
