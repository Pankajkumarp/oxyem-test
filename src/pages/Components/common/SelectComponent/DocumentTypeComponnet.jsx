import React, { useState, useEffect } from 'react';
import SelectDocument from '../SelectOption/SelectComponent'
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function DocumentTypeComponnet({ experience, label, validations = [], onChange, value, name }) {
  const [options, setOptions] = useState([]);
  const [selectedoption, setSelectedOption] = useState(value);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        let response;
        if (name === "projectMang") {
          response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
            params: { isFor: 'poject_doc_Type' }
          });
        } else {
          response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
            params: { isFor: 'employeeMaster' }
          });
        }

        const optionsData = response.data.data
          .filter(item => {
            // Exclude items with isExperience true when experience prop is false
            if (!experience && item.isExperiece) {
              return false;
            }
            return true;
          })
          .map(item => ({
            label: item.name,
            value: item.id,
          }));

        setOptions(optionsData);

      } catch (error) {
        console.error(error)
      }
    };

    fetchOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience]);





  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);

    const newValue = selectedValue;
    onChange(newValue);
  };


  return (
    <>
      <SelectDocument options={options} label={label} onChange={handleSelectChange}
        value={selectedoption && selectedoption.value ? selectedoption.value : selectedoption} validations={validations}
      />
    </>
  );
}
