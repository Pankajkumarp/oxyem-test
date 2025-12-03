import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function ExistingShift({ label, validations = [], value, onChange, data }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Find the department field within the Role Information subsection
        const infoSubsection = data.Subsection.find(subsection => subsection.SubsectionName === 'Add shift');

        if (!infoSubsection) {
          throw new Error('Information subsection is missing');
        }

        const employeeField = infoSubsection.fields.find(field => field.name === 'idEmployee');

        if (!employeeField) {
          throw new Error('Employee field is missing in Role Information subsection');
        }

        // Extract the employee ID value
        const empId = employeeField.value.value;

        if (!empId) {
          throw new Error('Employee ID value is missing');
        }

        const response = await axiosJWT.get(`${apiUrl}/currentShift`, {
          params: { idEmployee: empId }
        });

        const fetchedData = response.data.data;

        // Normalize the fetched data to be an array
        const optionsData = Array.isArray(fetchedData) ? fetchedData : [fetchedData];

        setOptions(optionsData);

        // Set the initial selected option
        const initialSelectedOption = optionsData.find(option => option.value === value);

        // Ensure the selected option is set correctly
        setSelectedSubject(initialSelectedOption || (optionsData.length > 0 ? optionsData[0] : null));
      } catch (error) {
        setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
  }, [data, value]);

  const handleSelectChange = (selectedOption) => {
    setSelectedSubject(selectedOption);
    // Pass the value to the onChange callback
    onChange(selectedOption ? selectedOption.value : null);
  };

  return (
    <>
      
      <SelectRole 
        options={options} 
        label={label} 
        onChange={handleSelectChange} 
        value={selectedSubject ? selectedSubject.value : null} // Pass the value to SelectRole
        isDisabled={true}
		validations={validations}
      />
    </>
  );
}
