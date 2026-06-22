import React, { useEffect } from 'react';
import { FaPlus } from "react-icons/fa6";
export default function TextComponent({ name, label, value, handleGetAddField, editAdditionalfiled }) {
  useEffect(() => {
    // if(pageedit === 'edit'){
      editAdditionalfiled(name, value)
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  
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
