import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function SelectComponent({ label, validations = [], value, onChange, data,pagename ,name}) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(value);
  const [initialDepartmentValue, setInitialDepartmentValue] = useState('');

  
  useEffect(() => {
    const fetchOptions = async (departmentValue) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/asset/assetDropdown`, { params: { idEmployee: departmentValue } });
        const optionsData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setOptions(optionsData);
      } catch (error) {
        console.error(error)
      }
    };

    const getDepartmentValue = () => {
      // Find the department field within the Role Information subsection
      const roleInfoSubsection = data.Subsection.find(subsection => subsection.SubsectionName === "Extend Allocation" || subsection.SubsectionName === "Asset Deallocation");
      if (!roleInfoSubsection) {
        throw new Error('Role Information subsection is missing');
      }

      const departmentField = roleInfoSubsection.fields.find(field => field.name === "idEmployee");
      if (!departmentField) {
        throw new Error('Department field is missing in Role Information subsection');
      }

      return departmentField.value.value;
    };

    try {
      const departmentValue = getDepartmentValue();

      // Store the initial department value if not already set
      if (initialDepartmentValue === null || departmentValue === '' || departmentValue === undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInitialDepartmentValue(departmentValue);
        
      } else if (departmentValue !== initialDepartmentValue) {
        setInitialDepartmentValue(departmentValue);
        fetchOptions(departmentValue);
      }
    } catch (error) {
      console.error(error)
    }
  }, [data, initialDepartmentValue]);

  const handleSelectChange = (selectedValue) => {
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

  return (
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
  );
}
