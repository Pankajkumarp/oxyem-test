import React, { useState, useEffect } from 'react';
import SelectLocation from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function SelectComponent({ label,isDisabled, validations = [], onChange, value ,documentType,selectedAsset }) {
  const [options, setOptions] = useState([]);
  const [selectedoption, setSelected] = useState(value);
  const [error, setError] = useState(null);

useEffect(() => {
  setSelected(selectedAsset);
  }, [selectedAsset]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const isForValue = documentType && documentType !== '' && documentType !== null && documentType !== undefined ? documentType : 'country';
        const response = await axiosJWT.get(`${apiUrl}/location`, { 
          params: { isFor: isForValue } // pass city country or state
      });

        const optionsData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));

        setOptions(optionsData);
      } catch (error) {
        setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
  }, []);

  const handleSelectChange = (selectedValue) => {
    setSelected(selectedValue);

    const newValue = selectedValue;
    onChange(newValue);
  };


  return (
      <SelectLocation options={options} isDisabled={isDisabled} label={label} onChange={handleSelectChange} validations={validations}
      value={ selectedoption && selectedoption.value ? selectedoption.value  : selectedoption } 
      />
  );
}
