import React, { useState, useEffect } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import SelectRole from '../SelectOption/SelectComponent';
import ViewPopup from '../../Popup/PopupForm';

export default function ProjectManagerlistComponent({ label, isDisabled, additionalLabel, validations = [], value, onChange, handleGetformvalueClick }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedOption(value);
  }, [value]);


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
        console.error(error)
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
