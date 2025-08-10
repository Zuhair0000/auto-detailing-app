const mysql = require("mysql2/promise");

// db.js

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

console.log("MYSQL connected");

module.exports = db;
