const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyAdminToken = require('../middleware/authMiddleware');

// Get all discount rules
router.get('/', verifyAdminToken, (req, res) => {
  const sql = 'SELECT * FROM discount_rules ORDER BY days_to_expiry ASC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Create a new discount rule
router.post('/', verifyAdminToken, (req, res) => {
  const { days_to_expiry, discount_percent } = req.body;
  const sql = 'INSERT INTO discount_rules (days_to_expiry, discount_percent) VALUES (?, ?)';
  db.query(sql, [days_to_expiry, discount_percent], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Discount rule created', id: result.insertId });
  });
});

// Update a discount rule by ID
router.put('/:id', verifyAdminToken, (req, res) => {
  const id = req.params.id;
  const { days_to_expiry, discount_percent } = req.body;
  const sql = 'UPDATE discount_rules SET days_to_expiry = ?, discount_percent = ? WHERE id = ?';
  db.query(sql, [days_to_expiry, discount_percent, id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Discount rule updated' });
  });
});

// Delete a discount rule by ID
router.delete('/:id', verifyAdminToken, (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM discount_rules WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Discount rule deleted' });
  });
});

module.exports = router;
