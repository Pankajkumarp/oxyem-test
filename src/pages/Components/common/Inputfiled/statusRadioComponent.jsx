import React, { useState, useEffect, useRef  } from 'react';

export default function statusRadioComponent({ options, value = [], name, onChange, label,placeholder, validations }) {
  const [selectedValues, setSelectedValues] = useState(value);
  const [showValues, setshowValues] = useState(value);
  useEffect(() => {
    setSelectedValues(value);
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setshowValues(selectedOption.name);
    }
  }, [value]);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const handleChange = (event) => {
    const newValue = event.target.value;
    const selectedOption = options.find((option) => option.value === newValue);
    if (selectedOption) {
      setshowValues(selectedOption.name);
    }
    setSelectedValues(newValue);
    onChange(newValue);
    setIsDropdownVisible(!isDropdownVisible);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="custom_staus_dropdown" ref={dropdownRef}>
      <span className="input-box-section" onClick={toggleDropdown}>
        {showValues === "" ? label : showValues}
      </span>

      {isDropdownVisible && (
        <div className="custom_staus_dropdown_option">
          {placeholder}
          {options.map((option, index) => (
            <div className={`form-dropdown-field form-check-${option.className}`} key={index}>
              <input
                className="form-check-input"
                type="checkbox"
                name={name}
                id={`check-${option.className}`}
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={handleChange}
              />
              <label for={`check-${option.className}`}></label>
              <span
                className="form-check-label"
                htmlFor={`check-${option.className}`}
                style={{ position: 'relative', top: '0', left: '0' }}
              >
                {option.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
