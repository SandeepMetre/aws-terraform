const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);

app.get("/healthz", (_, response) => response.json({ status: "ok", service: "users" }));
app.get("/readyz", (_, response) => response.json({ status: "ready", service: "users" }));
app.get("/api/users/:id", (request, response) =>
  response.json({ user: { id: request.params.id, displayName: "Demo customer" } }),
);
app.listen(port, "0.0.0.0");
