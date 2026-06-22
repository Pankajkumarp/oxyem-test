import React from 'react'
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function DateComponent({ label, value, validations = [] ,onChange,otherAttributes}) {
  const isRequired = validations.some(validation => validation.type === "required");
  const handleInputChange = (e) => {
    const newValue = e.target.value;
  onChange(newValue); // Notify parent component about value change
};

  return (
    <>
    {isRequired ? <LabelMandatory labelText={label}/> : <LabelNormal labelText={label}/> }
    <input type="date" className="form-control" value={value} onChange={handleInputChange}   {...otherAttributes.length > 0 ? otherAttributes.reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {}) : {}} />

    </>
  )
}
