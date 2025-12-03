import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { FaPlus } from "react-icons/fa6";
export default function TextComponent({ name, type, readonly, isDisabled, placeholder, label, value, validations = [], onChange, handleGetAddField ,editAdditionalfiled,pageedit }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const [textData, settextData] = useState(value);
  useEffect(() => {
    settextData(value || []);
    // if(pageedit === 'edit'){
      editAdditionalfiled(name, value)
    // }
  }, [value]);
  
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    settextData(newValue);
    onChange(newValue); // Notify parent component about value change
  };
  const handleAddField = () => {
    if(name === "otherAllowance"){
    handleGetAddField("earning")
    }else if(name === "deductionOtherAllowance"){
      handleGetAddField("deductions")
    }
  };
  
  return (
    <div className='other_info_field'>
    <span className="other_info_field_lable">{label}</span>
    <span className="add_icon_with_input" onClick={handleAddField}><FaPlus />Add More</span>
    </div>
  );
}
