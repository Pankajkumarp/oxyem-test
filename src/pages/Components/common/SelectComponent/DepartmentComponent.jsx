import React, { useState, useEffect } from 'react';
import SelectDepartment from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function DepartmentComponent({ label, isDisabled, validations = [], value ,onChange}) {
  const [options, setOptions] = useState([]);
  
  const [selectedoption, setSelectedoption] = useState(value);
  useEffect(() => {
    // Synchronize internal state with props
    setSelectedoption(value);
  }, [value]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { 
          params: { isFor: 'departments' } 
      });

        const optionsData = response.data.data.map((item) => ({ 
          label: item.name,
          value: item.id,
        }));
        
        setOptions(optionsData);
      } catch (error) {
        console.error('Error fetching options:', error);
        setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
  }, []);


  const handleSelectChange = (selectedValue) => {
    setSelectedoption(selectedValue);
    const newValue = selectedValue;    
    onChange(newValue); 
  };

  return (
    <>
      <SelectDepartment options={options} isDisabled={isDisabled} label={label} onChange={handleSelectChange} 
      value={ selectedoption && selectedoption.value ? selectedoption.value  : selectedoption } validations={validations}
      />
    </>
  );
}
