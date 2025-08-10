const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const workerRoutes = require("./routes/WorkerRoutes");
const loginRoutes = require("./routes/loginRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use(cookieParser());
app.use("/api/customer", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/work", workerRoutes);
app.use("/api/auth", loginRoutes);
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
