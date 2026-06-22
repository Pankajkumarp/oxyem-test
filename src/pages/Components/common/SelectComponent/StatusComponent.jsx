import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/SelectComponent';


export default function StatusComponent({ label, isDisabled, additionalLabel, validations = [], value, onChange, handleGetvalueClick }) {
  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'Inactive' }
  ];
  const [selectedSubject, setSelectedOption] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedOption(value);
  }, [value]);



  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);
    const newValue = selectedValue;
    onChange(newValue);
  };


  return (
    <>
      {additionalLabel ? (<span className='oxyem-right-label' onClick={handleGetvalueClick}>{additionalLabel}</span>) : (<></>)}
      <SelectRole options={options} label={label} isDisabled={isDisabled} onChange={handleSelectChange} value={selectedSubject} validations={validations} />
    </>
  );
}
