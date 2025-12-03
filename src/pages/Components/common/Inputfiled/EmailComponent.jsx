import React, { useState, useEffect } from 'react'
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function EmailComponent({type, placeholder, label, isDisabled, value, validations = [],onChange ,otherAttributes }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const [emailData, setEmailData] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    setEmailData(value);
  }, [value]);
  const handleInputChange = (e) => {
      const newValue = e.target.value;
      setEmailData(newValue); 
    onChange(newValue); // Notify parent component about value change
  };
  return (
    <>
    {isRequired ? <LabelMandatory labelText={label} disabled={isDisabled}/> : <LabelNormal labelText={label} disabled={isDisabled}/> }
    <input type="text"  className="form-control" id={label} placeholder={placeholder} value={emailData}  disabled={isDisabled} onChange={handleInputChange} {...otherAttributes.length > 0 ? otherAttributes.reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {}) : {}}/>
    </>
  )
}