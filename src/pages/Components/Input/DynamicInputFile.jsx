// components/DynamicInput.js
import { useState } from 'react';

const DynamicInput = ({inputType,label,  name,classname, onChange , labelclass,htmlFor, value, onBlur}) => {
    
  return (
    <div>
      <label htmlFor= {htmlFor} className={labelclass} >{label}</label>
      <input type={inputType} name={name} className = {classname} value={value} onChange={onChange} onBlur={onBlur} />
    </div>
  );
};

export default DynamicInput;
