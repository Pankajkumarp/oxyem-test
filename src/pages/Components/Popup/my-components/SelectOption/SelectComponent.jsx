import React from 'react'
import Select from 'react-select';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';


const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  // Add more options as needed
];

export default function SelectComponent({label, validations = []}) {
  
  const isRequired = validations.some(validation => validation.type === "required");
  
  return (
    <>
    {isRequired ? <LabelMandatory labelText={label}/> : <LabelNormal labelText={label}/> }
     <Select
      options={options}
      //onChange={onChange}
      //value={value}
      isMulti={"true"}
      isClearable={"true"} 
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      className="oxyem-custom-dropdown"
      //closeMenuOnSelect={!isMulti} 
      //hideSelectedOptions={!isMulti}
      styles={{
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? 'var(--dropdownhoverbg)' : provided.borderColor, // Change border color when focused
            boxShadow: state.isFocused ? 'var(--dropdownbgshadow)' : provided.boxShadow, // Change box shadow when focused
            '&:hover': {
              borderColor: state.isFocused ? 'var(--dropdownhoverbg)' : provided.borderColor // Ensure hover state does not override focus state
            }
          }),
          indicatorSeparator: (provided, state) => ({
            ...provided,
            backgroundColor: 'var(--dropdownhoverbg)' // Change border color when clicked to show options
          }),
        option: (provided, state) => ({
          ...provided,
          padding: 'var(--dropdownpadding)',
          //margin: '5px 0px',
          cursor:'var(--dropdowncursorstyle)',
          backgroundColor: state.isFocused || state.isSelected ? 'var(--dropdownhoverbg)' : 'var(--dropdowntransparentcolor)', // Change background color on hover and when selected
          color: state.isSelected ? 'var(--dropdownselectcolor)' : 'var(--dropdowninheritcolor)', // Change text color of selected options
          ':hover': {
            backgroundColor: 'var(--dropdownhoverbg)', // Change background color on hover
            color: 'var(--dropdownhovercolor)' // Change text color on hover
          }
        })
      }}
      //isDisabled={!onChange} // Disable select if onChange is not provided
    />
    </>
  )
}
