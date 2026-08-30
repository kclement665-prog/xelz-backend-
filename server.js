import { createRequire } from "node:module";
import { httpServerHandler } from "cloudflare:node";
import express from "express";

const require = createRequire(import.meta.url);

const healthRoutes = require("./routes/health");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Xelz Backend 🚀",
    version: "1.0.0"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.listen(3000);

export default httpServerHandler({ port: 3000 });
