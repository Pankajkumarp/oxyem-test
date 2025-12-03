import React, { useState, useEffect, useRef } from 'react';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";
export default function StatusInput({ pagename, value, getStautLabel }) {
  const [selectedValue, setSelectedValue] = useState(value || null); // Store only a single selected value
  const [showValue, setShowValue] = useState(null);
  const [classValue, setClassValue] = useState(null);
  const name = 'status';
  const placeholder = 'status';
  const [options, setOptions] = useState([]);
  const fetchStatData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
        params: { isFor: 'performancestatus' },
      });

      if (response) {
        const optionsData = response.data.data.map((item, index) => {
          const isChecked = item.id === value || index < response.data.data.findIndex((el) => el.id === value);
          return {
            label: item.name,
            value: item.id,
            className: item.class,
            isChecked: isChecked
          };
        });
        setOptions(optionsData);
        if (pagename === "initiate") {
          const getName = optionsData.find((option) => option.value === value);
          if (getName) {
            setShowValue(getName.label);
            setClassValue(getName.className);
            getStautLabel(getName.label)
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStatData();
  }, []);

  useEffect(() => {
    if (pagename === "initiate") {
      const getName = options.find((option) => option.value === value);
      if (getName) {
        setShowValue(getName.label);
        setSelectedValue(value)
        setClassValue(getName.className);
      }
    }
  }, [options, value]);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    //setSelectedValue(newValue);
    //const selectedOption = options.find((option) => option.value === newValue);
    //if (selectedOption) {
    //  setShowValue(selectedOption.label);
    //}
    //setIsDropdownVisible(false); // Close the dropdown after selection
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
      <button className={`btn form-check-${classValue}`} onClick={toggleDropdown}>
        {showValue === null ? placeholder : showValue} {isDropdownVisible ? <FaAnglesUp /> : <FaAnglesDown />}
      </button>

      {isDropdownVisible && (
        <div className="custom_staus_dropdown_option">
          {options.map((option, index) => (
            <div className={`form-dropdown-field form-check-${option.className}`} key={index}>
              <input
                className="form-check-input"
                type="checkbox" // Use radio instead of checkbox
                name={name} // Same name for all options ensures only one can be selected
                id={`check-${option.className}`}
                value={option.value}
                checked={option.isChecked} // Only one value can be selected
                onChange={handleChange}
              />
              <label htmlFor={`check-${option.className}`} />
              <span className="form-check-label" style={{ position: 'relative', top: '0', left: '0' }}>
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
