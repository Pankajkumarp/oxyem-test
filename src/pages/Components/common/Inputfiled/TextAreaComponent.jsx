import React from 'react';
import LabelNormal from '../Label/LabelNormal';
import LabelMandatory from '../Label/LabelMandatory';
export default function TextareaComponent({label, placeholder, value, validations = [], onChange }) {
  const variants = ["flat", "faded", "bordered", "underlined"];
  const isRequired = validations.some(validation => validation.type === "required");
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log(newValue)
  onChange(newValue); // Notify parent component about value change
};
  return (
    <div>      
        {isRequired ? <LabelMandatory labelText={label}/> : <LabelNormal labelText={label}/> }
        <textarea 
          placeholder={placeholder}
          value = {value}
          className="form-control"
          onChange={handleInputChange}
        />
     
    </div>
  );
}
