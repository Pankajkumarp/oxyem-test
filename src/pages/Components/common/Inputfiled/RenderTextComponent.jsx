import React, { useState, useEffect } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function RenderTextComponent({ label, value, validations = [] }) {
  const isRequired = validations.some(validation => validation.type === "required");

  const [textData, settextData] = useState(value);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    settextData(value);
  }, [value]);
  
  return (
    <div className='rendertextData'>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}:
      <span className='inner_rendertext'>{textData}</span>
    </div>
  );
}
