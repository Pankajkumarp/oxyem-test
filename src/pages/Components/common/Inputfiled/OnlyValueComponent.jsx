import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function OnlyValueComponent({ isDisabled, label, value, validations = [] }) {
  const isRequired = validations.some(validation => validation.type === "required");

  const [textData, settextData] = useState(value);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    settextData(value);
  }, [value]);

  return (
    <div className='field_no_input'>
      <span className='f_lable_no_inp'>{isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} disabled={isDisabled} />}</span>
      <span className='f_value_no_inp'>{textData}</span>
    </div>
  );
}
