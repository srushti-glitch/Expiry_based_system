// useEffect to fetch available categories from DB
import { useEffect, useState } from 'react';
import axios from 'axios';

const Categories = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products/categories/all') 
      .then(res => setCategories(['All', ...res.data]))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  return (
    <div className="categories">
      {categories.map((cat) => (
        <button key={cat} onClick={() => onSelect(cat)}>
          {cat}
        </button>
      ))}
    </div>
  );
};

export default Categories;