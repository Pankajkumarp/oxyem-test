import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function FreeTextComponent({ type, name, readonly, isDisabled, placeholder, label, value, validations = [], onChange }) {
  const isRequired = validations.some(validation => validation.type === "required");

  const [textData, settextData] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    settextData(value);
  }, [value]);
  
  return (
    <>
        <div className="freetexfiled" style={{display:'flex'}}>
        <div className="title">{label} :</div>
        <div className="text">{placeholder}</div>
        </div>
    </>
  );
}
