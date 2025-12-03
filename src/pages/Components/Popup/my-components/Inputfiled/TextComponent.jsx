import React from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function TextComponent({type, placeholder, label, validations = [] }) {
  const isRequired = validations.some(validation => validation.type === "required");

  return (
    <>
      {isRequired ? <LabelMandatory labelText={label}/> : <LabelNormal labelText={label}/> }

      <input type={type} className="form-control" required={isRequired} placeholder={placeholder} />
    </>
  );
}
