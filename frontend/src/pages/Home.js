// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import Categories from '../components/Categories';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filterCat, setFilterCat] = useState('All');
  const [categories, setCategories] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://expiry-based-system.onrender.com/api/products?limit=1000'); // <-- fetch all products
      const data = await res.json();
      const productsData = data.products || [];
      setProducts(productsData);

      // extract unique categories for Categories component
      const uniqueCategories = ['All', ...new Set(productsData.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Append newly added product if navigated from AddProduct
  useEffect(() => {
    if (location.state?.newProduct) {
      setProducts(prev => [location.state.newProduct, ...prev]);
      fetchProducts(); // refresh to ensure latest products from backend
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  const filtered = filterCat === 'All'
    ? products
    : products.filter(p => p.category === filterCat);

  return (
    <div className="home-page">
      <HeroBanner />
      <Categories categories={categories} onSelect={setFilterCat} />

      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>🔥 Featured Deals</h2>
      <div className="products-grid">
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', width: '100%' }}>No products available.</p>
        ) : (
          filtered.map(product => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </div>
  );
};

export default Home;
