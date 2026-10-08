// src/pages/admin/ExpiringSoon.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const ExpiringSoon = () => {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchExpiring() {
      try {
        const res = await axios.get('https://expiry-based-system.onrender.com/api/admin/expiring-soon', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load expiring products');
      }
    }
    fetchExpiring();
  }, [token]);

  const daysLeft = expiryDate => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const applyClearance = async productId => {
    try {
      await axios.post(
        `https://expiry-based-system.onrender.com/api/admin/products/${productId}/apply-clearance`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Clearance applied');
      setProducts(products.filter(p => p.id !== productId));
    } catch {
      alert('Failed to apply clearance');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Expiring Soon Products</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {products.length === 0 ? (
        <p>No products expiring soon.</p>
      ) : (
        <table border="1" cellPadding={8} style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Expiry Date</th>
              <th>Days Left</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const left = daysLeft(product.expiry_date);
              let status = '';
              let color = '';

              if (left <= 2) {
                status = 'Urgent';
                color = 'red';
              } else if (left <= 7) {
                status = 'Warning';
                color = 'orange';
              }

              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{new Date(product.expiry_date).toLocaleDateString()}</td>
                  <td>{left}</td>
                  <td style={{ color, fontWeight: 'bold' }}>{status}</td>
                  <td>
                    <button onClick={() => applyClearance(product.id)}>Apply Clearance</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpiringSoon;
