const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);
const products = [
  { id: "sku-001", name: "Cloud starter kit", price: 49.99 },
  { id: "sku-002", name: "Platform t-shirt", price: 24.99 },
];

app.get("/healthz", (_, response) => response.json({ status: "ok", service: "catalog" }));
app.get("/readyz", (_, response) => response.json({ status: "ready", service: "catalog" }));
app.get("/api/catalog/products", (_, response) => response.json({ products }));
app.listen(port, "0.0.0.0");
