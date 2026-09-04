const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);
app.use(express.json());

app.get("/healthz", (_, response) => response.json({ status: "ok", service: "orders" }));
app.get("/readyz", (_, response) => response.json({ status: "ready", service: "orders" }));
app.post("/api/orders", (request, response) => {
  const { userId, items = [] } = request.body || {};
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ error: "userId and at least one item are required" });
  }
  return response.status(201).json({
    order: { id: `order-${Date.now()}`, userId, items, status: "pending" },
  });
});
app.listen(port, "0.0.0.0");
