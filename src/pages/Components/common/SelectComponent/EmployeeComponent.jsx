import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

const colourStyles = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#0056A1" : null,
      color: isFocused ? "#fff" : "#333333",
    };
  }
};

export default function SelectComponent({ label, validations = [] , value, onChange, showImage ,documentType ,selectedAsset,isDisabled ,pagename ,getRewardData}) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(value);
  // useEffect(() => {
  //   setSelectedOption(value);
  // }, [value]);

  useEffect(() => {
    setSelectedOption(selectedAsset);
  }, [selectedAsset]);

  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        let response;
  
        if (documentType === 'projectManager') {
          response = await axiosJWT.get(`${apiUrl}/employees/employeesList`, { params: { "isFor": 'projectManager' } });
        } 
        else if(documentType === 'temporary') {
 response = await axiosJWT.get(`${apiUrl}/employees/employeesList`, { params: { "isFor": documentType } });
        }
        else if(documentType === 'permanent') {
 response = await axiosJWT.get(`${apiUrl}/employees/employeesList`, { params: { "isFor": documentType } });
        }
        else {
          response = await axiosJWT.get(`${apiUrl}/employees/employeesList`, { params: { "isFor": name } });
        }
  
        const optionsData = response.data.data.map((item) => ({
          label: item.employeeName,
          value: item.idEmployee,
          image: item.profilePicPath ? item.profilePicPath : "",
          profileLink: item.profileLink ? item.profileLink : "",
          designation: item.designation ? item.designation : "",
        }));

        setOptions(optionsData);
      } catch (error) {
        console.error('Error fetching options:', error);
        setError(error.message || 'Failed to fetch options');
      }
    };

    const fetchProject = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        let response;
        response = await axiosJWT.get(`${apiUrl}/dropdowns`, { params: { "isFor": 'projectList' } });
        const optionsData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setOptions(optionsData);
      } catch (error) {
        setError(error.message || 'Failed to fetch options');
      }
    };
  if(getRewardData === 'addReward'){
    fetchProject();
  }else{
    fetchOptions();
  }

  }, [documentType ,getRewardData]); // Added `name` as a dependency since it's used in the fetch call
  

  

  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);

    const newValue = selectedValue;    
    onChange(newValue); 
  };

  return (
    <SelectRole options={options} label={getRewardData === 'addReward' ? 'Project Name' :label} onChange={handleSelectChange} 
    value={
      selectedOption && selectedOption.value
        ? selectedOption.value
        : selectedOption
    } 
    showImage={showImage} validations={validations}
    isDisabled={isDisabled}
    />
  );
}
