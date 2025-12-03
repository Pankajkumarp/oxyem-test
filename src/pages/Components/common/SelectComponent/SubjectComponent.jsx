import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/CreateSingleSelect';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function SubjectComponent({ label, validations = [] , value, onChange }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        // const response = await axios.get(`${apiUrl}/dropdowns`, { params: { isFor: 'roles' } });

        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { 
          params: { isFor: 'subject' } 
      });

        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          label: item.name,
          value: item.idSubject,
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
    setSelectedOption(selectedValue);

    const newValue = selectedValue;    
    onChange(newValue); 
  };

  return (
    <SelectRole options={options} label={label} onChange={handleSelectChange} value={selectedSubject} validations={validations} />
  );
}
