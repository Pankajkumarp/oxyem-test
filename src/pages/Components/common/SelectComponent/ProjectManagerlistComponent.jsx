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

export default function ProjectManagerlistComponent({ label, isDisabled, additionalLabel, validations = [], value, onChange, handleGetformvalueClick }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    setSelectedOption(value);
  }, [value]);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/employees/employeesList`, { params: { "isFor": 'projectManager' } });

        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          label: item.employeeName,
          value: item.idEmployee
        }));

        setOptions(optionsData);
      } catch (error) {

        setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
  }, []);



  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);

    const newValue = selectedValue;
    onChange(newValue ? newValue.value : "");
  };
  const [isModalOpeninput, setIsModalOpeninput] = useState(false);
  const closeModalInputselect = () => {
    setIsModalOpeninput(false);
  };
  const handleGetvalueClick = () => {
    setIsModalOpeninput(true);
  };

  return (
    <>
      <ViewPopup isOpen={isModalOpeninput} closeModal={closeModalInputselect} labelText={"BTP - SHTP"} dynamicform={"Btp_shtp"} section={"Btp_shtp"} handleGetformvalueClick={handleGetformvalueClick} />
      {!isDisabled && additionalLabel ? (
        <span className='oxyem-right-label' onClick={handleGetvalueClick}>
          {additionalLabel}
        </span>
      ) : (
        <span className='oxyem-right-label' >
          {additionalLabel}
        </span>
      )}
      <SelectRole options={options} isDisabled={isDisabled} label={label} onChange={handleSelectChange} value={selectedSubject ? selectedSubject : ''} validations={validations} />
    </>
  );
}
