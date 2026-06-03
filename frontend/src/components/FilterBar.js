// src/components/FilterBar.js
import React from 'react';
import Select from 'react-select';
import './FilterBar.css';

const FilterBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onDiscountChange,
  onExpiryChange
}) => {
  // Options for react-select
  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  const discountOptions = [
    { value: '', label: 'Any Discount' },
    { value: '10', label: '10%+' },
    { value: '20', label: '20%+' },
    { value: '30', label: '30%+' }
  ];

  const expiryOptions = [
    { value: '', label: 'Any Expiry' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '7 Days' },
    { value: '14', label: '14 Days' }
  ];

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#f5f5f5',     // light background for the control
      borderColor: state.isFocused ? '#27ae60' : '#ccc',  // your brand green when focused
      boxShadow: state.isFocused ? '0 0 0 2px rgba(39, 174, 96, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#27ae60'
      },
      borderRadius: '8px',
      minHeight: '40px'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      marginTop: 4,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#27ae60' : state.isFocused ? '#e8f5e9' : '#fff',
      color: state.isSelected ? 'white' : '#333',
      padding: 10,
      '&:active': {
        backgroundColor: '#27ae60'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#888'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333'
    })
  };

  // Custom theme override
  const customTheme = theme => ({
    ...theme,
    borderRadius: 8,
    colors: {
      ...theme.colors,
      primary25: '#e8f5e9',      // hover option background
      primary: '#27ae60',        // selected option border etc.
      neutral0: '#ffffff',       // background color of control
      neutral50: '#666666',      // placeholder / non-selected text
      neutral80: '#333333'       // text color
    }
  });

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Category</label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find(o => o.value === selectedCategory)}
          onChange={selected => onCategoryChange(selected.value)}
          styles={customStyles}
          theme={customTheme}
          placeholder="Select Category"
        />
      </div>
      <div className="filter-group">
        <label>Minimum Discount</label>
        <Select
          options={discountOptions}
          onChange={selected => onDiscountChange(selected.value)}
          styles={customStyles}
          theme={customTheme}
          placeholder="Any Discount"
        />
      </div>
      <div className="filter-group">
        <label>Expiry Within</label>
        <Select
          options={expiryOptions}
          onChange={selected => onExpiryChange(selected.value)}
          styles={customStyles}
          theme={customTheme}
          placeholder="Any Expiry"
        />
      </div>
    </div>
  );
};

export default FilterBar;
