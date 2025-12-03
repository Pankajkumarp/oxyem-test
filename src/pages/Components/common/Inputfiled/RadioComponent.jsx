
import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";
import View from '../../Popup/assetDetail';
export default function RadioComponent({ options, value, name, onChange, label, pagename }) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event) => {
    if (pagename === "createClient") {
      const newValue = event.target.value; // Ensure the value is treated as boolean
      setSelectedValue(newValue);
      onChange(newValue);
    } else {
      const newValue = event.target.value === 'true'; // Ensure the value is treated as boolean
      setSelectedValue(newValue);
      onChange(newValue);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openDetailpopup = async () => {
      setIsModalOpen(true)
  }
  const closeDetailpopup = async () => {
      setIsModalOpen(false)
  }
  return (
    <>
      <View isOpen={isModalOpen} closeModal={closeDetailpopup}  />
      <div className='radio_btn_box'>
        <span style={{ padding: '7px', fontWeight: '600' }}>{label}</span>
        {options.map((option, index) => (
          <div className="form-check form-check-inline mt-3" key={index}>
            <input
              className="form-check-input"
              type="checkbox"
              name={name}
              id={`${name}-${index}`}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleChange}
            />
            <span className="form-check-label" htmlFor={`${name}-${index}`} style={{ position: 'relative', top: '0', left: '0' }}>
              {option.name}
            </span>

          </div>
        ))}
        {pagename === "allocateAsset" ? (<span className='icon_input_radio' onClick={openDetailpopup}><FaEye /></span>) : (null)}
      </div>
    </>
  );
}