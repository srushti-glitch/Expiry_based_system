const express = require("express");


const cors = require("cors");
const path = require("path");
const app = express();
const productRoutes = require("./routes/products");
const adminAuthRoutes = require('./routes/adminAuth');
const discountRulesRoutes = require('./routes/adminDiscount.js');

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://srushti-glitch.github.io"
  ],
  credentials: true,
}));
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API is up and running!");
});

app.use("/api/products", productRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/discount-rules', discountRulesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
