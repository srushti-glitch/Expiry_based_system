import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import PrivateRoute from './components/admin/PrivateRoute';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import ProductList from './pages/admin/ProductList';
import EditProduct from './pages/admin/EditProduct';
import DiscountRules from './pages/admin/DiscountRules';
import ExpiringSoon from './pages/admin/ExpiringSoon';

function App() {
  return (
    <CartProvider>
      
        <AdminAuthProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/add-product" element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            } />
           <Route
             path="/admin/products"
             element={
             <PrivateRoute>
              <ProductList />
            </PrivateRoute>
             }
           />
           <Route
             path="/admin/edit-product/:id"
             element={
             <PrivateRoute>
              <EditProduct />
            </PrivateRoute>
             }
           />
            <Route path="/admin/discount-rules" element={
              <PrivateRoute>
                <DiscountRules />
              </PrivateRoute>
            } />
            <Route path="/admin/expiring-soon" element={
              <PrivateRoute>
                <ExpiringSoon />
              </PrivateRoute>
            } />
          </Routes>

          <Footer />
        </AdminAuthProvider>
  
    </CartProvider>
  );
}

export default App;
