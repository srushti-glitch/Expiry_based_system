const express = require('express');
const router = express.Router();
const db = require('../db');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log("Incoming login:", username, password); //

  db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    console.log("DB results:", results); // 👈 Add this

    if (!results || results.length === 0 || !results[0].password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = results[0];

    try {
      const match = await bcrypt.compare(password, admin.password);
  console.log("Password match:", match); // 👈 Add this
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '2h' });

      res.json({ token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: 'Authentication error' });
    }
  });
});
module.exports = router;

