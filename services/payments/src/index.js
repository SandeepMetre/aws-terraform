const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);
app.use(express.json());

app.get("/healthz", (_, response) => response.json({ status: "ok", service: "payments" }));
app.get("/readyz", (_, response) => response.json({ status: "ready", service: "payments" }));
app.post("/api/payments/authorize", (request, response) => {
  const { orderId, amount } = request.body || {};
  if (!orderId || !Number.isFinite(amount) || amount <= 0) {
    return response.status(400).json({ error: "orderId and a positive amount are required" });
  }
  return response.status(201).json({ payment: { orderId, amount, status: "authorized" } });
});
app.listen(port, "0.0.0.0");
