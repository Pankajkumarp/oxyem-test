import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function SelectComponent({ label, validations = [], value, onChange, data, pagename, name, selectedAsset }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);
  const [error, setError] = useState(null);
  const [initialDepartmentValue, setInitialDepartmentValue] = useState('');

  useEffect(() => {
    setSelectedOption(selectedAsset);
  }, [selectedAsset]);

  useEffect(() => {
    const fetchOptions = async (departmentValue) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Extract the actual department ID from departmentValue
        let departmentId = null;

        if (departmentValue && typeof departmentValue === 'object') {
          if (departmentValue.value?.value) {
            departmentId = departmentValue.value.value; // Nested object case
          } else if (departmentValue.value) {
            departmentId = departmentValue.value; // Direct object case
          } else {
            departmentId = departmentValue; // Direct value case
          }
        } else {
          departmentId = departmentValue; // Fallback for primitive values
        }

        // Validate departmentId
        if (!departmentId || typeof departmentId !== 'string') {
          throw new Error('Invalid department ID. Please select a valid department.');
        }

        

        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
          params: { isFor: 'roles', id: departmentId },
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

    const getDepartmentValue = () => {
      // Find the department field within the Role Information subsection
      const roleInfoSubsection = data.Subsection.find((subsection) => subsection.SubsectionName === 'Post new job');
      if (!roleInfoSubsection) {
        throw new Error('Role Information subsection is missing.');
      }

      const departmentField = roleInfoSubsection.fields.find((field) => field.name === 'idDepartment');
      if (!departmentField) {
        throw new Error('Department field is missing in Role Information subsection.');
      }

      return departmentField.value;
    };

    try {
      const departmentValue = getDepartmentValue();

      // Only fetch options if the department value changes
      if (departmentValue !== initialDepartmentValue) {
        setInitialDepartmentValue(departmentValue);
        fetchOptions(departmentValue);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
    }
  }, [data, initialDepartmentValue]);

  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

  return (
    <div>
      
      <SelectRole
        pagename={pagename}
        name={name}
        options={options}
        label={label}
        onChange={handleSelectChange}
        validations={validations}
        value={
          selectedSubject && selectedSubject.value
            ? selectedSubject.value
            : selectedSubject
        }
      />
    </div>
  );
}
