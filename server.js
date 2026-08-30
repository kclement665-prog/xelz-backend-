require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Xelz Backend is running",
    version: "1.1.0"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "Xelz Store API",
    paystackConfigured: !!process.env.PAYSTACK_SECRET_KEY
  });
});

app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    products: []
  });
});

/* PAYSTACK CHECKOUT */
app.post("/api/paystack/initialize", async (req, res) => {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        success: false,
        message: "Paystack checkout is not configured. Add PAYSTACK_SECRET_KEY as a backend secret."
      });
    }

    const {
      email,
      amount,
      reference,
      callback_url,
      metadata
    } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: "Email and amount are required"
      });
    }

    const payload = {
      email,
      amount: String(Math.round(Number(amount) * 100))
    };

    if (reference) payload.reference = reference;
    if (callback_url) payload.callback_url = callback_url;
    if (metadata) payload.metadata = metadata;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return res.status(response.status || 400).json({
        success: false,
        message: data.message || "Unable to initialize Paystack transaction"
      });
    }

    return res.json({
      success: true,
      message: "Paystack checkout initialized",
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference
    });

  } catch (error) {
    console.error("Paystack initialization error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to connect to Paystack"
    });
  }
});

/* PAYSTACK VERIFY */
app.get("/api/paystack/verify/:reference", async (req, res) => {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        success: false,
        message: "Paystack is not configured"
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(req.params.reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return res.status(response.status || 400).json({
        success: false,
        message: data.message || "Unable to verify transaction"
      });
    }

    res.json({
      success: true,
      transaction: data.data
    });

  } catch (error) {
    console.error("Paystack verification error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to verify Paystack transaction"
    });
  }
});

/* ORDERS */
app.post("/api/orders", (req, res) => {
  const { customer, items, amount } = req.body;

  if (!customer || !items || !amount) {
    return res.status(400).json({
      success: false,
      message: "Customer, items and amount are required"
    });
  }

  const order = {
    id: "XZ-" + Date.now(),
    customer,
    items,
    amount,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Xelz API endpoint not found"
  });
});

app.listen(PORT, () => {
  console.log(`Xelz Backend running on port ${PORT}`);
});
