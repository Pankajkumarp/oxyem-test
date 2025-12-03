import React, { useState } from 'react';
import Select from 'react-select';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
const MonthSelect = ({ label, name, isDisabled, validations = [], options, value, onChange, showImage, pagename }) => {

  const isRequired = validations.some(validation => validation.type === "required");

  const months = [
    { value: 'jan', label: 'January' },
    { value: 'feb', label: 'February' },
    { value: 'mar', label: 'March' },
    { value: 'apr', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'jun', label: 'June' },
    { value: 'jul', label: 'July' },
    { value: 'aug', label: 'August' },
    { value: 'sep', label: 'September' },
    { value: 'oct', label: 'October' },
    { value: 'nov', label: 'November' },
    { value: 'dec', label: 'December' },
  ];

  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedMonth(selectedOption);
    onChange(selectedOption.value); // Pass the selected month value to the parent component
  };

  return (
    <div className='select_option_common'>
          {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
    <Select
      value={selectedMonth}
      maxMenuHeight={200}
      onChange={handleChange}
      options={months}
      placeholder="Select a month"
      className="oxyem-custom-dropdown"
      styles={{
        control: (provided, state) => ({
          ...provided,
          borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : provided.borderColor,
          boxShadow: state.isFocused ? 'var(--dropdownfocusboxshadow)' : provided.boxShadow,
          '&:hover': {
            borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : 'var(--dropdownhoverbordercolor)',
          },
          backgroundColor: state.isFocused ? 'var(--dropdownfocusbgcolor)' : provided.backgroundColor,
        }),
        indicatorSeparator: (provided, state) => ({
          ...provided,
          backgroundColor: 'var(--dropdownhoverbg)',
          fontWeight: 'var(--dropdownfontweight)',
        }),
        option: (provided, state) => ({
          ...provided,
          padding: 'var(--dropdownpadding)',
          cursor: 'var(--dropdowncursorstyle)',
          fontWeight: 'var(--dropdownfontweight)',
          backgroundColor: state.isSelected
            ? 'var(--dropdownselectedbgcolor)'
            : state.isFocused
              ? 'var(--dropdownhoverbg)'
              : 'var(--dropdowntransparentcolor)',
          color: state.isSelected ? 'var(--dropdownselectedcolor)' : 'var(--dropdowninheritcolor)',
          ':hover': {
            backgroundColor: 'var(--dropdownhoverbg)',
            color: 'var(--dropdownhovercolor)',
            fontWeight: 'var(--dropdownfontweight)',
          },
        }),
      }}
    />
    </div>
  );
};

export default MonthSelect;