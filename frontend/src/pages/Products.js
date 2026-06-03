// src/pages/Products.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [discountFilter, setDiscountFilter] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products?limit=1000');
      const data = await res.json();
      const productsData = data.products || [];
      setProducts(productsData);
      setFiltered(productsData);

      const uniqueCategories = [...new Set(productsData.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle new product passed via state (from AddProduct page)
  useEffect(() => {
    if (location.state?.newProduct) {
      setProducts(prev => [location.state.newProduct, ...prev]);
      navigate(location.pathname, { replace: true }); // clear state to prevent duplicates
    }
  }, [location.state,  location.pathname,navigate]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    let filteredData = [...products];

    if (selectedCategory !== 'All') {
      filteredData = filteredData.filter(p => p.category === selectedCategory);
    }

    if (discountFilter) {
      filteredData = filteredData.filter(p => p.discount_percent >= parseInt(discountFilter));
    }

    if (expiryFilter) {
      const now = new Date();
      filteredData = filteredData.filter(p => {
        const expiry = new Date(p.expiry_date);
        const diff = (expiry - now) / (1000 * 60 * 60 * 24);
        return diff <= parseInt(expiryFilter);
      });
    }

    setFiltered(filteredData);
  }, [selectedCategory, discountFilter, expiryFilter, products]);

  return (
    <div className="products-page">
      <h1>All Products</h1>
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onDiscountChange={setDiscountFilter}
        onExpiryChange={setExpiryFilter}
      />
      <div className="products-grid">
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', width: '100%' }}>No products found.</p>
        ) : (
          filtered.map(product => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </div>
  );
};

export default Products;
