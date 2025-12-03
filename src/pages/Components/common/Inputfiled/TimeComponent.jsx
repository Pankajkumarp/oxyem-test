import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function TextComponent({ type, readonly, isDisabled, placeholder, label, value, validations = [], onChange }) {
  const isRequired = validations.some(validation => validation.type === "required");

  const [textData, settextData] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    settextData(value);
  }, [value]);
  
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    settextData(newValue);
    onChange(newValue); // Notify parent component about value change
  };
  return (
    <>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <input type='time' className="form-control" placeholder={placeholder} value={textData} readonly={readonly} disabled={isDisabled} onChange={handleInputChange} />
    </>
  );
}
