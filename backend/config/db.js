const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306, // <-- Add this line
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Zoherama1122",
  database: process.env.DB_NAME || "car_wash",
});

console.log("MYSQL connected");

module.exports = db;
