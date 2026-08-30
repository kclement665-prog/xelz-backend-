const express = require("express");
const cors = require("cors");
require("dotenv").config();

const healthRoutes = require("./routes/health");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Xelz Backend 🚀",
    version: "1.0.0"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Xelz Backend running on port ${PORT}`);
});
