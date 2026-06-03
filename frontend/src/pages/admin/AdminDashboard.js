import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>👋 Welcome to Admin Dashboard</h1>

      <div className="admin-nav">
        <Link to="/admin/add-product">➕ Add Product</Link>
        <Link to="/admin/products">📦 Product List</Link>
       
        <Link to="/admin/discount-rules">💰 Discount Rules</Link>
        
      </div>

      <div className="summary-cards">
        <div className="card">
          <h3>🛒 Total Products</h3>
          <p>102</p> {/* Replace with dynamic data later */}
        </div>
        
        <div className="card">
          <h3>🔖 Discounted</h3>
          <p>25</p>
        </div>
        <div className="card">
          <h3>💸 Total Discount Value</h3>
          <p>₹5,670</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
