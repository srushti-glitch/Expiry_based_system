// src/pages/admin/AddProduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    base_price: '',
    manufacture_date: '',
    expiry_date: '',
    quantity: '',
    image: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://expiry-based-system.onrender.com/api/products/categories/all');
        setCategories(res.data);
        if (res.data.length > 0) {
          setForm(f => ({ ...f, category: res.data[0] }));
        }
      } catch {
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = e => {
    setForm(f => ({ ...f, image: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!token) {
      alert('You are not logged in. Please login first.');
      navigate('/admin/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('base_price', form.base_price);
      formData.append('manufacture_date', form.manufacture_date);
      formData.append('expiry_date', form.expiry_date);
      formData.append('quantity', form.quantity);
      if (form.image) formData.append('image', form.image);

      const res = await axios.post('https://expiry-based-system.onrender.com/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Product added successfully');

      // Pass newly added product to ProductList via state
      navigate('/admin/products', { state: { newProduct: res.data } });
    } catch (err) {
      console.error('Error adding product:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  if (token === null) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Product</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {['name', 'base_price', 'manufacture_date', 'expiry_date', 'quantity'].map(name => (
          <div key={name} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{name.replace('_', ' ').toUpperCase()}</label>
            <input
              type={name.includes('date') ? 'date' : name === 'base_price' || name === 'quantity' ? 'number' : 'text'}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Image (optional)</label>
          <input type="file" name="image" onChange={handleFileChange} accept="image/*" style={{ fontSize: '16px' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
