// src/pages/admin/ProductList.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ProductList = () => {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get('https://expiry-based-system.onrender.com/api/products?limit=1000', {
        headers: { Authorization: `Bearer ${token}` }
      });
      let allProducts = res.data.products || [];

      // Apply search filter
      if (search.trim()) {
        allProducts = allProducts.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply category filter
      if (filterCategory !== 'All') {
        allProducts = allProducts.filter(p => p.category === filterCategory);
      }

      setProducts(allProducts);
    } catch {
      setError('Failed to load products');
    }
  }, [search, filterCategory, token]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('https://expiry-based-system.onrender.com/api/products/categories/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch {
      setError('Failed to load categories');
    }
  },[token]);

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Append newly added product from AddProduct page
  useEffect(() => {
    if (location.state?.newProduct) {
      setProducts(prev => [location.state.newProduct, ...prev]);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`https://expiry-based-system.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.id !== id));
    } catch {
      setError('Failed to delete product');
    }
  };

  const daysLeft = (expiryDate) => Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 3600 * 24));

  const discountedPrice = (basePrice, discountPercent) => {
    const bp = Number(basePrice);
    const dp = Number(discountPercent);
    if (isNaN(bp) || isNaN(dp)) return 'N/A';
    return (bp * (1 - dp / 100)).toFixed(2);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Product List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="All">All</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Expiry Date</th>
            <th>Days Left</th>
            <th>Base Price</th>
            <th>Discount %</th>
            <th>Discounted Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>No products found.</td>
            </tr>
          )}
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{new Date(product.expiry_date).toLocaleDateString()}</td>
              <td>{daysLeft(product.expiry_date)}</td>
              <td>${Number(product.base_price).toFixed(2)}</td>
              <td>{product.discount_percent || 0}%</td>
              <td>${discountedPrice(product.base_price, product.discount_percent)}</td>
              <td>{product.quantity || 0}</td>
              <td>
                <button onClick={() => navigate(`/admin/edit-product/${product.id}`)}>Edit</button>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{ marginLeft: '8px', color: 'red' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
