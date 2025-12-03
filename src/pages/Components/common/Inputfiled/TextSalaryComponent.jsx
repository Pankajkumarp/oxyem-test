import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function TextSalaryComponent({ type, readonly, isDisabled, placeholder, label, value, validations = [], onChange }) {
  const isRequired = validations.some(validation => validation.type === "required");

  const [textData, settextData] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    settextData(value);
  }, [value]);

  return (
    <>
      <div className='text_salary_info'>
        <p className='salary_info_text'>{label}</p>
        <p className='salary_amt_info'>{textData}</p>
      </div>
    </>
  );
}
