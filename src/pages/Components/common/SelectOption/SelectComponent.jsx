import React, { useState } from 'react'
import Select from 'react-select';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import Profile from '../../commancomponents/profile';
import { FaRegEye } from "react-icons/fa6";
import View from '../../../assetManagement/assetInfo';
export default function SelectComponent({ label, name, isDisabled, validations = [], options, value, onChange, showImage, pagename, placeholder, onFocus }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const [inputValue, setInputValue] = useState('');
  const findSelectedOption = (options, selectedValue) => {
    return options.find(option => option.value === selectedValue);
  };

  //  let selectedOption;
  // if (pagename === "perform" && name === "goalName") {
  //    selectedOption = findSelectedOption(options, value) || null;
  // } else {
  //    selectedOption = findSelectedOption(options, value);
  // }

  let selectedOption = null;
  if (value === "") {
    selectedOption = null;
  } else if (pagename === "perform" && name === "goalName") {
    selectedOption = findSelectedOption(options, value) || null;
  } else {
    selectedOption = findSelectedOption(options, value);
  }

  //   const customFilter = (option, inputValue) => {
  //     return option.label.toLowerCase().includes(inputValue.toLowerCase());
  // };

  const customFilter = (option, inputValue) => {
    if (typeof option.label === 'string') {
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    }
    return false;
  };

  const filteredOptions = options.filter(option => customFilter(option, inputValue)).slice(0, 15);
  const Option = ({ innerProps, label, data }) => (
    <div {...innerProps} className='oxyem-react-select-custom position-relative'>
      <div className="oxyem-cus-select-section">
        <div style={{ borderRadius: '50%', margin: '4px 10px' }}>
          <Profile name={label} imageurl={data.image} size={"36"} profilelink={data.profileLink} />
        </div>
        <div className="oxyem-user-text">
          <h6><span className="main-text">{label}</span></h6>
          <p className="">
            <span className="sub-text">{data.designation}</span>
          </p>
        </div>
      </div>

    </div>
  );
  let customComponents = {};
  if (showImage === "yes") {
    customComponents = { Option };
  } else {
    customComponents = {};
  }


  const [isModalOpen, setIsModalOpen] = useState(false);
  const openDetailpopup = async () => {
    setIsModalOpen(true)
  }
  const closeDetailpopup = async () => {
    setIsModalOpen(false)
  }
  return (
    <div className='select_option_common'>
      <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={selectedOption?.value} />
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <Select
        components={customComponents}
        value={selectedOption}
        options={filteredOptions}
        onInputChange={(value) => {
          setInputValue(value);
        }}
        maxMenuHeight={200}
        onChange={onChange}
        isClearable={true}
        isDisabled={isDisabled || ""}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        className="oxyem-custom-dropdown"
		onFocus={onFocus}
        placeholder={placeholder === "" || placeholder === undefined || placeholder === null ? "Search and Select" : placeholder}
        //closeMenuOnSelect={!isMulti} 
        //hideSelectedOptions={!isMulti}
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
                ? 'var(--dropdowntransparentcolor)'
                : 'var(--dropdowntransparentcolor)',
            color: state.isSelected ? 'var(--dropdownselectedcolor)' : 'var(--dropdowninheritcolor)',
            ':hover': {
              backgroundColor: 'var(--dropdownhoverbg)',
              color: 'var(--dropdownhovercolor)',
              fontWeight: 'var(--dropdownfontweight)',
            },
          }),
        }}
      //isDisabled={!onChange} // Disable select if onChange is not provided
      />
      {pagename === "allocateAsset" ? (
        <>{name === "idAsset" ? (<span className='icon_input_radio' onClick={openDetailpopup}><FaRegEye size={15} color='var(--theme-primary-color)' /></span>) : (null)}</>
      ) : (null)}
    </div>
  )
}
