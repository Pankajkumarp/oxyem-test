import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import SelectRole from '../SelectOption/SelectComponent';
import ViewPopup from '../../Popup/PopupForm';

const colourStyles = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#0056A1" : null,
      color: isFocused ? "#fff" : "#333333",
    };
  }
};

export default function StatusComponent({ label, isDisabled, additionalLabel, validations = [], value, onChange, handleGetformvalueClick }) {
  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'Inactive' }
  ];
  const [selectedSubject, setSelectedOption] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
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
