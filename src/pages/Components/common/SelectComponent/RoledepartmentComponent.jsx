
import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function RoledepartmentComponent({ label, validations = [], value, onChange, data }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Find the department field within the Role Information subsection
        const roleInfoSubsection = data.Subsection.find(subsection => 
    subsection.SubsectionName === 'Profile Information' || subsection.SubsectionName === '');

        if (!roleInfoSubsection) {
          throw new Error('Role Information subsection is missing');
        }

        const departmentField = roleInfoSubsection.fields.find(field => field.name === 'department');
        if (!departmentField) {
          throw new Error('Department field is missing in Role Information subsection');
        }

        // Extract the department value
        const departmentValue = departmentField.value.value;
        if (!departmentValue) {
          throw new Error('Department value is missing');
        }

        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { 
          params: { 
            isFor: 'roles',
            id: departmentValue // Pass the department value as a parameter
          } 
        });

        const optionsData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        console.log(optionsData,"this isoption ")
        setOptions(optionsData);
         setSelectedOption(null);


      if (value) {
        const matched = optionsData.find(opt => opt.value === value.value);
        if (matched) {
          setSelectedOption(matched);
        }
      }
      } catch (error) {
        console.error('Error fetching options:', error);
        setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
  }, [data]);

  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);
    onChange(selectedValue); 
  };

  return (
    <SelectRole options={options} label={label} onChange={handleSelectChange} 
    value={
      selectedSubject && selectedSubject.value 
        ? selectedSubject.value 
        : selectedSubject
    } 
	validations={validations}
    />
  );
}
