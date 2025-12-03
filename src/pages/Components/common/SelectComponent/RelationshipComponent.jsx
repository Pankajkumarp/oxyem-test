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

export default function SelectComponent({ label, validations = [] , value, onChange }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        // const response = await axios.get(`${apiUrl}/dropdowns`, { params: { isFor: 'roles' } });

        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { 
          params: { isFor: 'relationship' } 
      });

        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          label: item.relationship,
          value: item.idRelationship,
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
    <SelectRole options={options} label={label} onChange={handleSelectChange} value={selectedSubject.value} validations={validations} />
  );
}
