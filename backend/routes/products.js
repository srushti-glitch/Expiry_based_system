const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyAdminToken = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');


// Configure where to store uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // create this folder if it doesn’t exist
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


// ✅ Get products with optional filters: category, search, pagination
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (req.query.category && req.query.category !== 'All') {
    sql += ' AND category = ?';
    params.push(req.query.category);
  }

  if (req.query.search) {
    sql += ' AND name LIKE ?';
    params.push(`%${req.query.search}%`);
  }

  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    // Total count query
    let countSql = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];

    if (req.query.category && req.query.category !== 'All') {
      countSql += ' AND category = ?';
      countParams.push(req.query.category);
    }

    if (req.query.search) {
      countSql += ' AND name LIKE ?';
      countParams.push(`%${req.query.search}%`);
    }

    db.query(countSql, countParams, (err, countResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json({
        products: results,
        total: countResults[0].total,
        page,
        totalPages: Math.ceil(countResults[0].total / limit),
      });
    });
  });
});


// ✅ (Optional) Get distinct categories from DB
router.get('/categories/all', (req, res) => {
  db.query('SELECT DISTINCT category FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    // Extract categories and ensure unique values (in case 'All' is already in DB)
    const distinctCategories = [...new Set(results.map(row => row.category))];

    // Make sure 'All' is the first and only once in the list
    const categories = ['All', ...distinctCategories.filter(cat => cat !== 'All')];

    res.json(categories);
  });
});


// ✅ Get a product by ID
router.get('/:id', (req, res) => {
  const productId = req.params.id;
  db.query("SELECT * FROM products WHERE id = ?", [productId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(results[0]);
  });
});





// Create product (admin only)
// ✅ Create product (admin only)
router.post('/', verifyAdminToken, upload.single('image'), (req, res) => {
  try {
    const {
      name,
      category,
      base_price,
      manufacture_date,
      expiry_date,
      quantity
    } = req.body;

    // Optional: handle missing fields
    if (!name || !category || !base_price || !manufacture_date || !expiry_date || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Handle image if uploaded
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      INSERT INTO products
      (name, category, base_price, manufacture_date, expiry_date, quantity, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, category, base_price, manufacture_date, expiry_date, quantity, image_url],
      (err, result) => {
        if (err) {
          console.error('Database insert error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({
          message: 'Product created successfully',
          productId: result.insertId,
        });
      }
    );
  } catch (err) {
    console.error('Error in product creation:', err);
    res.status(500).json({ error: 'Server error while adding product' });
  }
});


// ✅ Update product (admin only)
router.put('/:id', verifyAdminToken, upload.single('image'), (req, res) => {
  const id = req.params.id;

  const {
    name,
    category,
    base_price,
    manufacture_date,
    expiry_date,
    quantity,
  } = req.body;

  // Handle uploaded file (if new image is uploaded)
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  // First, get existing product to preserve old image if needed
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });

    const existing = results[0];

    const updatedImage = image_url || existing.image_url;

    const sql = `
      UPDATE products 
      SET name = ?, category = ?, base_price = ?, manufacture_date = ?, expiry_date = ?, quantity = ?, image_url = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [name, category, base_price, manufacture_date, expiry_date, quantity, updatedImage, id],
      (err) => {
        if (err) {
          console.error('DB update error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ message: 'Product updated successfully' });
      }
    );
  });
});


// Delete product (admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Product deleted' });
  });
});

module.exports = router;
