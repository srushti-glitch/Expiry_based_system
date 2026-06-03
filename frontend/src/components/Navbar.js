// src/components/Navbar.js
import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { CartContext } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext'; // ✅ NEW

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { token, logout } = useAdminAuth(); // ✅ NEW

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo (also goes to Home) */}
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          SmartDeals
        </NavLink>

        {/* Hamburger icon for mobile */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/products"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={closeMenu}
            >
              Products
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={closeMenu}
            >
              Cart ({cartItems.length})
            </NavLink>
          </li>

          {/* ✅ Admin Panel/Login */}
          {token ? (
            <>
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </NavLink>
              </li>
              <li>
                <button className="nav-link" onClick={() => { logout(); closeMenu(); }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink
                to="/admin/login"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMenu}
              >
                Admin Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
