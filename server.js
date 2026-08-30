export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Home
    if (request.method === "GET" && url.pathname === "/") {
      return json({
        success: true,
        message: "Xelz Backend is running",
        version: "1.0.0"
      });
    }

    // Health check
    if (request.method === "GET" && url.pathname === "/api/health") {
      return json({
        success: true,
        status: "healthy",
        service: "Xelz Store API"
      });
    }

    // Products
    if (request.method === "GET" && url.pathname === "/api/products") {
      return json({
        success: true,
        products: []
      });
    }

    // Create order
    if (request.method === "POST" && url.pathname === "/api/orders") {
      try {
        const body = await request.json();
        const { customer, items, amount } = body;

        if (!customer || !items || !amount) {
          return json(
            {
              success: false,
              message: "Customer, items and amount are required"
            },
            400
          );
        }

        const order = {
          id: "XZ-" + Date.now(),
          customer,
          items,
          amount,
          status: "pending",
          createdAt: new Date().toISOString()
        };

        return json({
          success: true,
          message: "Order created successfully",
          order
        }, 201);

      } catch (error) {
        return json({
          success: false,
          message: "Invalid JSON request"
        }, 400);
      }
    }

    // Not found
    return json({
      success: false,
      message: "Xelz API endpoint not found"
    }, 404);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
        }
