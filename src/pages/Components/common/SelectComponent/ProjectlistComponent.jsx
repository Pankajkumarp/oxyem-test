import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import SelectRole from '../SelectOption/SelectComponent';
import ViewPopup from '../../Popup/PopupForm';
import { format } from "date-fns";


const colourStyles = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#0056A1" : null,
      color: isFocused ? "#fff" : "#333333",
    };
  }
};
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d) ? "" : format(d, "dd MMM yyyy");
};


export default function ProjectlistComponent({ label, isDisabled, additionalLabel, validations = [], value, onChange, handleGetformvalueClick, isModule, getProjectDate }) {
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
        const response = await axiosJWT.get(`${apiUrl}/project/list`);

        if (response?.data?.data) {

          const optionsData = response.data.data.map((item) => ({
            label:
  isModule === "AssignTaskNew"
    ? `${item.projectName} (${formatDate(item.startDate)} to ${formatDate(item.endDate)})`
    : item.projectName,
            value: item.idProject,
            startDate: item.startDate,
            endDate: item.endDate 
          }));

          setOptions(optionsData);
        }
      } catch (error) {
        setError(error.message || "Failed to fetch options");
      }
    };

    fetchOptions();
  }, []);

useEffect(() => {
  if (!value || options.length === 0) return;

  // 🔍 find project by id
  const matchedProject = options.find(
    opt => opt.value === value
  );

  if (matchedProject) {

    if (
      matchedProject.startDate &&
      matchedProject.endDate &&
      typeof getProjectDate === "function"
    ) {
      getProjectDate(
        matchedProject.startDate,
        matchedProject.endDate
      );
    }
  }
}, [value, options, getProjectDate]);


  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);
    const newValue = selectedValue;
    onChange(newValue ? newValue.value : "");
    if(selectedValue.startDate && getProjectDate && typeof getProjectDate === 'function' && selectedValue.endDate){
      getProjectDate(selectedValue.startDate, selectedValue.endDate);
    }
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
      <SelectRole options={options} isDisabled={isDisabled} label={label} onChange={handleSelectChange} value={selectedSubject ? selectedSubject : ''} validations={validations}/>
    </>
  );
}
