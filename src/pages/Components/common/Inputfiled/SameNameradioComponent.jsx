import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import View from '../../Popup/assetDetail';

export default function SameNameradioComponent({ options, value, name, onChange, label, pagename }) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openDetailpopup = async () => {
    setIsModalOpen(true);
  };
  const closeDetailpopup = async () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <View isOpen={isModalOpen} closeModal={closeDetailpopup} />
      <div className='radio_btn_box'>
        <span style={{ padding: '7px', fontWeight: '600' }}>{label}</span>
        {options.map((option, index) => (
          <div className="form-check form-check-inline mt-3" key={index}>
            <input
              className="form-check-input"
              type="radio"
              name={name}
              id={`${name}-${index}`}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={`${name}-${index}`} style={{ position: 'relative', top: '0', left: '0' }}>
              {option.name}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
