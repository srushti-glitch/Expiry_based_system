// src/pages/admin/EditProduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const { token } = useAdminAuth();
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [loading, setLoading] = useState(true); // Wait until product & categories load

  // Redirect if no token
  useEffect(() => {
    if (token === '') {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return; // wait for token

    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/categories/all');
        setCategories(res.data);
      } catch (err) {
        setError('Failed to load categories');
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const p = res.data;
        setForm({
          name: p.name,
          category: p.category,
          base_price: p.base_price,
          manufacture_date: p.manufacture_date.split('T')[0],
          expiry_date: p.expiry_date.split('T')[0],
          quantity: p.quantity,
          image: null,
        });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please login.');
          navigate('/admin/login');
        } else {
          setError('Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id, token, navigate]);

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
      setError('No admin token. Please login.');
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

      console.log('Sending PUT request with token:', token);

      await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please login again.');
        navigate('/admin/login');
      } else {
        setError('Failed to update product');
      }
    }
  };

  if (!token || loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Product</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {[
          { label: 'Product Name', type: 'text', name: 'name' },
          { label: 'Base Price', type: 'number', name: 'base_price' },
          { label: 'Manufacture Date', type: 'date', name: 'manufacture_date' },
          { label: 'Expiry Date', type: 'date', name: 'expiry_date' },
          { label: 'Quantity', type: 'number', name: 'quantity' },
        ].map(({ label, type, name }) => (
          <div key={name} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px',
              }}
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
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          >
            {categories.map((cat, index) => (
              <option key={cat + index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Image (optional)</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            style={{ fontSize: '16px' }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
