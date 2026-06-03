// src/components/Cart.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const calculateDiscountedPrice = (product) => {
    const today = new Date();
    const expiry = new Date(product.expiry_date);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    let discount = product.discount_percent || 0;
    if (diffDays <= 3) discount = Math.max(discount, 30);
    else if (diffDays <= 7) discount = Math.max(discount, 15);

    return product.base_price * (1 - discount / 100);
  };

  const total = cartItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + calculateDiscountedPrice(item) * quantity;
  }, 0).toFixed(2);

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    updateQuantity(id, qty);
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          {cartItems.map(item => {
            const quantity = item.quantity || 1;
            const price = calculateDiscountedPrice(item);
            const subtotal = (price * quantity).toFixed(2);
            const discount = item.discount_percent || 0;

            return (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>
                    Price: ₹{price.toFixed(2)}{' '}
                    {discount > 0 && <span className="discount">(-{discount}%)</span>}
                  </p>
                </div>
                <div className="cart-item-quantity">
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  />
                </div>
                <div className="cart-item-subtotal">₹{subtotal}</div>
                <div className="cart-item-remove">
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            );
          })}

          <div className="cart-summary">Total: ₹{total}</div>
        </>
      )}
    </div>
  );
};

export default Cart;
