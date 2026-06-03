import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  // ✅ Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      console.log('AdminAuth token (loaded from storage):', storedToken);
    } else {
      console.log('AdminAuth token: none found in localStorage');
    }
  }, []);

  // ✅ Log whenever token changes (for debugging)
  useEffect(() => {
    console.log('AdminAuth token changed:', token);
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('admin_token', newToken);
    navigate('/admin/dashboard');
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
