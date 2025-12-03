import React, { useState, useEffect } from 'react';
import Select from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function SelectOptionComponent({ label, name, validations = [], isDisabled, onChange, documentType, data, dependentId, selectedAsset,placeholder }) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(selectedAsset);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (documentType) {
      fetchOptions();
    }
  }, [documentType, dependentId]);
  useEffect(() => {
    setSelectedOption(selectedAsset);
  }, [selectedAsset]);

  const fetchOptions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      let response;
      let optionsData;
      if (name === "projectName") {
        response = await axiosJWT.get(`${apiUrl}/opportunity/getProject`, {
          params: { idClient: dependentId }
        });
        optionsData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
          endDate: item.endDate,
          startDate: item.startDate,
        }));
      } else if (documentType === "financialYear") {
        response = await axiosJWT.get(`${apiUrl}/getFinancialYears`);
        optionsData = response.data.data.map((item) => ({
        label: item,
        value: item,
        }));
      } else if (documentType === "sub_modules") {
              
               response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
                params: { id:dependentId , isFor: documentType }
              });
              optionsData = response.data.data.map((item) => ({
              label: item.name,
              value: item.id,
              })); 
             
        } else {
        response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
          params: { isFor: documentType, id: dependentId }
        });
        optionsData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      }

      setOptions(optionsData);
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
    }
  };
  useEffect(() => {
    if (dependentId) {
      fetchOptions();
    }
  }, [dependentId]);
  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

  useEffect(() => {
    if (documentType === "financialYear" && options.length > 0) {
      setSelectedOption(options[0]?.value);
    }
  }, [options]);

  return (
    <>
      <Select
        options={options}
        label={label}
        isDisabled={isDisabled}
        onChange={handleSelectChange}
        validations={validations}
        placeholder={placeholder}
        value={selectedOption?.value ? selectedOption.value : selectedOption}
      />
    </>
  );
}
