import React, { useContext } from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  // Calculate days left until expiry
  const getDaysLeft = (expiry) => {
    const expiryDate = new Date(expiry);
    const today = new Date();
    const diffTime = expiryDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysLeft(product.expiry_date);
  const isExpired = daysLeft < 0;

  // Determine correct image URL
const getImageUrl = () => {
  const img = product.image || product.image_url; // whatever field you use
  if (!img) return '/placeholder.jpeg'; // fallback
  if (img.startsWith('http')) return img;  // external URL
  return `https://expiry-based-system.onrender.com${img.startsWith('/') ? img : '/' + img}`; // local uploads
};


  return (
    <div className="product-card">
      <div className="image-container">
        <img src={getImageUrl()} alt={product.name} />

        {product.discount_percent && (
          <div className="discount-badge">-{product.discount_percent}%</div>
        )}
        {isExpired && <div className="expired-badge">Expired</div>}
      </div>

      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.base_price}</p>
        <p className={`expiry ${isExpired ? 'expired-text' : ''}`}>
          {isExpired ? 'Expired' : `⏳ ${daysLeft} days left`}
        </p>
      </div>

      <div className="card-buttons">
        <Link to={`/products/${product.id}`} className="view-btn">
          View
        </Link>
        <button
          className="add-btn"
          onClick={() => addToCart(product)}
          disabled={isExpired}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
