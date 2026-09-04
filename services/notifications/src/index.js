const express = require("express");

const app = express();
const port = Number(process.env.PORT || 3000);
app.use(express.json());

app.get("/healthz", (_, response) => response.json({ status: "ok", service: "notifications" }));
app.get("/readyz", (_, response) => response.json({ status: "ready", service: "notifications" }));
app.post("/api/notifications", (request, response) => {
  const { userId, message } = request.body || {};
  if (!userId || !message) {
    return response.status(400).json({ error: "userId and message are required" });
  }
  return response.status(202).json({ accepted: true, userId, message });
});
app.listen(port, "0.0.0.0");
