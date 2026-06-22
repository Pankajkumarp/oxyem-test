import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/CreateSingleSelect';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function AppraisalTypeComponent({ label, validations = [] , value, onChange }) {
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
        // const response = await axios.get(`${apiUrl}/dropdowns`, { params: { isFor: 'roles' } });

        const response = await axiosJWT.get(`${apiUrl}//dropdowns`, { 
          params: { isFor: 'appraisalType' } 
      });

        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          label: item.name,
          value: item.id,
        }));
        
        setOptions(optionsData);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  

  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);

    const newValue = selectedValue;    
    onChange(newValue); 
  };

  return (
    <SelectRole options={options} label={label} onChange={handleSelectChange} value={selectedSubject}  validations={validations}/>
  );
}
