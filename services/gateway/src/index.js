const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);
const routes = {
  catalog: process.env.CATALOG_URL || "http://catalog",
  orders: process.env.ORDERS_URL || "http://orders",
  payments: process.env.PAYMENTS_URL || "http://payments",
  users: process.env.USERS_URL || "http://users",
  notifications: process.env.NOTIFICATIONS_URL || "http://notifications",
};

app.use(express.json());
app.get("/healthz", (_, response) => response.json({ status: "ok", service: "gateway" }));
app.get("/readyz", (_, response) => response.json({ status: "ready", service: "gateway" }));
app.get("/", (_, response) => response.json({ service: "gateway", routes: Object.keys(routes) }));
app.all("/api/:service/*", async (request, response, next) => {
  const upstream = routes[request.params.service];
  if (!upstream) {
    return response.status(404).json({ error: "unknown service" });
  }
  try {
    const target = `${upstream}${request.originalUrl}`;
    const upstreamResponse = await fetch(target, {
      method: request.method,
      headers: { "content-type": "application/json" },
      body: ["GET", "HEAD"].includes(request.method) ? undefined : JSON.stringify(request.body),
    });
    const body = await upstreamResponse.text();
    response.status(upstreamResponse.status).type("application/json").send(body);
  } catch (error) {
    next(error);
  }
});
app.use((error, _, response, next) => {
  if (response.headersSent) return next(error);
  return response.status(502).json({ error: "upstream service unavailable" });
});
app.listen(port, "0.0.0.0");
