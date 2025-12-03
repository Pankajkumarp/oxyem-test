import React, { useState, useEffect } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import SelectRole from '../SelectOption/SelectComponent';

export default function YearComponent({ label, isDisabled, validations = [], value, onChange }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);
  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/getFinancialYears`);
        if(response){
          const financialYears = response.data.data;
          const optionsData = financialYears
          .reverse()
          .map((item) => ({
            label: item,
            value: item,
          }));
        setOptions(optionsData);
      }
      } catch (error) {

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
        <SelectRole options={options} isDisabled={isDisabled} label={label} onChange={handleSelectChange}
          value={selectedSubject && selectedSubject.value ? selectedSubject.value : selectedSubject}
          validations={validations} />
  );
}
