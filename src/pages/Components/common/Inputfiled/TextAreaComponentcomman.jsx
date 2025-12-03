import React, {useState, useEffect} from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function TextareaComponent({type, placeholder, label, value, validations = [] ,onChange,isDisabled }) {
  const isRequired = validations.some(validation => validation.type === "required");

  const [textData, settextData] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    settextData(value);
  }, [value]);
  const handleInputChange = (e) => {
    const newValue = e.target.value;    
    settextData(newValue); // Notify parent component about value change
    onChange(newValue); // Notify parent component about value change
};
  return (
    <>
      {isRequired ? <LabelMandatory labelText={label}/> : <LabelNormal labelText={label}/> }

      <textarea className="form-control oxyem-custom-textarea"  placeholder={placeholder} value={textData} onChange={handleInputChange} disabled={isDisabled} rows="8" cols="50" />
    </>
  );
}
