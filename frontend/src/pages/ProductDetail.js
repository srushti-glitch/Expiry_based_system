// src/pages/ProductDetail.js

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const [product, setProduct] = useState(location.state?.product || null);
  const [rules, setRules] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  // 🧮 Calculate discount based on rules (higher discount as expiry nears)
  const calculateDiscount = useCallback((prod, rulesData) => {
    const today = new Date();
    const expiry = new Date(prod.expiry_date);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    // ⚠️ If already expired — mark it and skip discounts
    if (diffDays < 0) {
      setIsExpired(true);
      setDiscountPercent(0);
      setDiscountedPrice(null);
      return;
    }

    setIsExpired(false);

    // Sort rules ascending by days_to_expiry (closest expiry = higher discount)
    const sortedRules = [...rulesData].sort((a, b) => a.days_to_expiry - b.days_to_expiry);

    // Find first matching rule (e.g. 25 days left → 30% discount)
    let disc = 0;
    for (let i = 0; i < sortedRules.length; i++) {
      if (diffDays <= sortedRules[i].days_to_expiry) {
        disc = sortedRules[i].discount_percent;
        break;
      }
    }

    setDiscountPercent(disc);
    setDiscountedPrice(disc > 0 ? (prod.base_price * (1 - disc / 100)).toFixed(2) : null);
  }, []);

  // 📦 Fetch product and discount rules
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let prod = product;
        if (!prod) {
          const res = await fetch(`https://expiry-based-system.onrender.com/api/products/${id}`);
          if (!res.ok) throw new Error('Product not found');
          prod = await res.json();
          setProduct(prod);
        }

        let rulesData = rules;
        if (rules.length === 0) {
          const token = localStorage.getItem('admin_token');
          const res = await fetch('https://expiry-based-system.onrender.com/api/admin/discount-rules', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!res.ok) throw new Error('Failed to fetch discount rules');
          rulesData = await res.json();
          setRules(rulesData);
        }

        calculateDiscount(prod, rulesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, calculateDiscount]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!product) return <div>No product found</div>;

  // 🖼️ Determine image URL
  const getImageUrl = () => {
    const img = product.image || product.image_url;
    if (!img) return '/placeholder.jpeg';
    if (img.startsWith('http')) return img;
    return `https://expiry-based-system.onrender.com${img.startsWith('/') ? img : '/' + img}`;
  };

  return (
    <div className="product-detail">
      <img
        src={getImageUrl()}
        alt={product.name}
        style={{
          filter: isExpired ? 'grayscale(100%) opacity(0.7)' : 'none',
          transition: '0.3s ease',
        }}
      />
      <h1>{product.name}</h1>
      <p>Category: {product.category}</p>
      <p>Count: {product.quantity}</p>
      <p>Expiry Date: {new Date(product.expiry_date).toLocaleDateString()}</p>
      <p>Manufacture Date: {new Date(product.manufacture_date).toLocaleDateString()}</p>
      <p>Base Price: ₹{product.base_price}</p>

      {/* ⚠️ If expired, show message instead of discount */}
      {isExpired ? (
        <p style={{ color: 'gray', fontWeight: 'bold' }}>⚠️ This product has expired.</p>
      ) : discountPercent > 0 ? (
        <>
          <p style={{ color: 'red', fontWeight: 'bold' }}>Discount: {discountPercent}% Off</p>
          <p style={{ fontSize: '1.2rem', color: '#2c3e50' }}>
            Discounted Price: ₹{discountedPrice}
          </p>
        </>
      ) : (
        <p>No Discount</p>
      )}

      <Link to="/products">← Back to Products</Link>
    </div>
  );
};

export default ProductDetail;
