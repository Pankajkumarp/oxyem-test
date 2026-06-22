import React, { useState, useEffect } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import SelectRole from '../SelectOption/SelectComponent';
import ViewPopup from '../../Popup/PopupForm';

export default function PolicyComponent({ label, isDisabled, additionalLabel, validations = [], value, onChange, handleGetformvalueClick }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedOption(value);
  }, [value]);


  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/policy/policyDropdown`);

        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          label: item.name,
          value: item.idpolicy,
        }));

        setOptions(optionsData);
      } catch (error) {
        console.error(error)
      }
    };

    fetchOptions();
  }, []);



  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue.value);

    const newValue = selectedValue.value;
    onChange(newValue);
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
    <ViewPopup isOpen={isModalOpeninput} closeModal={closeModalInputselect} labelText={"BTP - SHTP"} dynamicform={"Btp_shtp"} section={"Btp_shtp"} handleGetformvalueClick={handleGetformvalueClick}/>
    {!isDisabled && additionalLabel ? (
    <span className='oxyem-right-label' onClick={handleGetvalueClick}>
        {additionalLabel}
    </span>
) : (
  <span className='oxyem-right-label' >
  {additionalLabel}
</span>
)}
      <SelectRole options={options} isDisabled={isDisabled} label={label} onChange={handleSelectChange} value={selectedSubject} validations={validations}/>
    </>
  );
}
