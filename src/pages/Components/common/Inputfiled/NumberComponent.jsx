import React, { useState, useEffect } from 'react'
import LabelNormal from '../Label/LabelNormal';
import LabelMandatory from '../Label/LabelMandatory';

export default function NumberComponent({type, placeholder, isDisabled, label, value, validations = [] ,onChange,otherAttributes ,labelShow }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const [textData, settextData] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    settextData(value);
  }, [value]);
const handleInputChange = (e) => {
  const newValue = e.target.value;
  // Check if the new value is a valid positive number or an empty string
  if (/^\d*$/.test(newValue)) {
    settextData(newValue);
    onChange(newValue); // Notify parent component about value change
  }
}; 
const spanClass = isDisabled ? 'disabled-span' : '';
  return (
    <span className={spanClass}>
    {labelShow === false ? (
        <></>
      ): isRequired ? <LabelMandatory labelText={label} disabled={isDisabled}/> : <LabelNormal labelText={label} disabled={isDisabled}/>
    }
    <input type="number" className="form-control" disabled={isDisabled}  placeholder={placeholder} value={textData} onChange={handleInputChange}  {...otherAttributes.length > 0 ? otherAttributes.reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {}) : {}}/>
    </span>
  )  
}
