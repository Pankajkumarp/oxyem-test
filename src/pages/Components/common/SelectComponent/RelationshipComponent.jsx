import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function SelectComponent({ label, validations = [] , value, onChange }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);  

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { 
          params: { isFor: 'relationship' } 
      });

        const optionsData = response.data.data.map((item) => ({
          label: item.relationship,
          value: item.idRelationship,
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
    onChange(newValue); 
  };

  return (
    <SelectRole options={options} label={label} onChange={handleSelectChange} value={selectedSubject.value} validations={validations} />
  );
}
