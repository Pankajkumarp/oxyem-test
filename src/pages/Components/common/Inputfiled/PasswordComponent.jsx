import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordComponent({ label, placeholder, isDisabled, pagename, value, validations = [], onChange }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isRequired = validations.some(validation => validation.type === "required");
 const [textData, settextData] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    settextData(value);
  }, [value]);
  const handleInputChange = (e) => {
    onChange(e.target.value); // Notify parent component about value change
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  return (
    <>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <div className="password-input-container">
        <input
          type={isPasswordVisible ? "text" : "password"}
          className="form-control"
          id="password"
          placeholder={placeholder}
          disabled={isDisabled}
          value={textData}
          onChange={handleInputChange}
		  autoComplete="off"
        />
        {pagename === "createPricing" ? (
          null
        ) : (
          <button
            type="button"
            className="password-toggle-button"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}

      </div >
    </>
  );
}
