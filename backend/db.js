const mysql = require('mysql2');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Diksha218", // your password
  database: "expiry_based_system_data",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ MySQL connected.");
  }
});

module.exports = db;