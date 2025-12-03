import React, { useState, useEffect } from 'react';
import Select from '../SelectOption/CreateSingleSelect';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function CreateSingleSelectComponent({ label, validations = [], value, onChange, documentType }) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(value);
  const [error, setError] = useState(null);

  // Fetch options from the API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
          params: { isFor: documentType }
        });

        const optionsData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));

        setOptions((prevOptions) => {
          // Merge the fetched options with the existing options, avoiding duplicates
          const mergedOptions = [...optionsData];
          prevOptions.forEach((option) => {
            if (!mergedOptions.some((opt) => opt.value === option.value)) {
              mergedOptions.push(option);
            }
          });
          return mergedOptions;
        });
      } catch (error) {
        setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
  }, [documentType]);

  // Check if the value is new and add it to options if necessary
  useEffect(() => {
    if (value && value.__isNew__) {
      setOptions((prevOptions) => {
        if (!prevOptions.some(option => option.value === value.value)) {
          return [
            ...prevOptions,
            { label: value.label, value: value.value }
          ];
        }
        return prevOptions;
      });
    }
  }, [value]);

  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

  return (
    <Select
      options={options}
      label={label}
      onChange={handleSelectChange}
      validations={validations}
      value={
        selectedOption && selectedOption.value
          ? selectedOption.value
          : selectedOption
      }
    />
  );
}
