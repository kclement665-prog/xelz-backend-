const express = require("express");

const router = express.Router();

const products = [];

// Create a product
router.post("/", (req, res) => {
  const { title, description, price, sellerId, category, image } = req.body;

  if (!title || price === undefined || !sellerId) {
    return res.status(400).json({
      success: false,
      message: "Title, price and sellerId are required"
    });
  }

  const product = {
    id: Date.now().toString(),
    title,
    description: description || "",
    price: Number(price),
    sellerId,
    category: category || "General",
    image: image || "",
    published: false,
    createdAt: new Date().toISOString()
  };

  products.push(product);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product
  });
});

// Get products
router.get("/", (req, res) => {
  res.json({
    success: true,
    products
  });
});

module.exports = router;
