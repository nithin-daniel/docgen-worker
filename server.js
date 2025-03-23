// server.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
require("dotenv").config();
app.get("/", (req, res) => {
  res.json({ status: "200", message: "Hello, world!" });
});
app.use("/api", require("./api"));
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
