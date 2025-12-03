import React from 'react';

export default function CheckboxComponent({ label, value, onChange, validations = [] }) {
  const handleInputChange = (e) => {
    const newValue = e.target.checked; 
    onChange(newValue); 
  };

  return (
    <div>
      <div className="oxyem-form-check">
        <div className="checkbox-wrapper-31">
          <input 
            type="checkbox" 
            checked={value} 
            onChange={handleInputChange} 
          />
          <svg viewBox="0 0 35.6 35.6">
            <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
            <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
            <polyline className="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
          </svg>
        </div>
        <span className="form-check-label"> {label} </span>
      </div>
    </div>
  );
}