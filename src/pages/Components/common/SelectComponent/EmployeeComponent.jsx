import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function SelectComponent({ label, validations = [] , value, onChange, showImage ,documentType ,selectedAsset,isDisabled ,getRewardData}) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedOption(selectedAsset);
  }, [selectedAsset]);
  
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
          emailAddress: item.emailAddress,
          value: item.idEmployee,
          image: item.profilePicPath ? item.profilePicPath : "",
          profileLink: item.profileLink ? item.profileLink : "",
          designation: item.designation ? item.designation : "",
        }));

        setOptions(optionsData);
      } catch (error) {
        console.error(error)
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
        console.error(error)
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
