// src/pages/admin/DiscountRules.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Create axios instance outside the component to avoid re-creation on every render
const api = axios.create({
  baseURL: 'http://localhost:5000/api/admin/discount-rules',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
    'Content-Type': 'application/json',
  },
});

const DiscountRules = () => {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({ days_to_expiry: '', discount_percent: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all discount rules
  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await api.get('/');
      setRules(res.data);
    } catch (err) {
      setError('Failed to load discount rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update a discount rule
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.days_to_expiry || !form.discount_percent) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const payload = {
        days_to_expiry: Number(form.days_to_expiry),
        discount_percent: Number(form.discount_percent),
      };

      if (editingId) {
        await api.put(`/${editingId}`, payload);
      } else {
        await api.post('/', payload);
      }

      setForm({ days_to_expiry: '', discount_percent: '' });
      setEditingId(null);
      fetchRules();
    } catch (err) {
      setError('Error saving discount rule');
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setForm({
      days_to_expiry: rule.days_to_expiry,
      discount_percent: rule.discount_percent,
    });
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
    try {
      await api.delete(`/${id}`);
      fetchRules();
    } catch (err) {
      setError('Error deleting discount rule');
    }
  };

  // Styles
  const thStyle = { padding: '12px', fontWeight: 'bold', borderBottom: '2px solid #ddd' };
  const tdStyle = { padding: '12px' };
  const actionButton = { padding: '6px 12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', marginRight: '8px', cursor: 'pointer' };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Discount Rules</h1>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontWeight: 'bold' }}>Days to Expiry</label>
            <input
              type="number"
              name="days_to_expiry"
              value={form.days_to_expiry}
              onChange={handleChange}
              min="0"
              required
              style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }}
            />
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontWeight: 'bold' }}>Discount %</label>
            <input
              type="number"
              name="discount_percent"
              value={form.discount_percent}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: editingId ? '#ffc107' : '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {editingId ? 'Update Rule' : 'Add Rule'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ days_to_expiry: '', discount_percent: '' });
                  setError('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading rules...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Days to Expiry</th>
              <th style={thStyle}>Discount %</th>
              <th style={thStyle}>Created At</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No discount rules found.
                </td>
              </tr>
            ) : (
              rules.map((rule) => {
                const discount = Number(rule.discount_percent);
                return (
                  <tr key={rule.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>{rule.id}</td>
                    <td style={tdStyle}>{rule.days_to_expiry}</td>
                    <td style={tdStyle}>
                      {isNaN(discount) ? '0.00%' : discount.toFixed(2) + '%'}
                    </td>
                    <td style={tdStyle}>{new Date(rule.created_at).toLocaleString()}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleEdit(rule)}
                        style={{ ...actionButton, backgroundColor: '#ffc107', color: '#000' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        style={{ ...actionButton, backgroundColor: '#dc3545', color: '#fff' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DiscountRules;
