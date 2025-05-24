const express = require("express");
const cors = require("cors");
require("dotenv").config();
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const workerRoutes = require("./routes/WorkerRoutes");
const loginRoutes = require("./routes/loginRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/customer", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/work", workerRoutes);
app.use("/api/auth", loginRoutes);
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const PORT = process.env.DB_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
