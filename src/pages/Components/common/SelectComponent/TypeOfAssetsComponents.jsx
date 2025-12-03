import React, { useState, useEffect } from 'react';
import SelectRole from '../SelectOption/SelectComponent';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function SelectComponent({ label, validations = [], value, onChange, data, pagename, name ,selectedAsset }) {
  const [options, setOptions] = useState([]);
  const [selectedSubject, setSelectedOption] = useState(selectedAsset);
  const [error, setError] = useState(null);
  const [initialDepartmentValue, setInitialDepartmentValue] = useState('');



  useEffect(() => {
    setSelectedOption(selectedAsset);
  }, [selectedAsset]);

  useEffect(() => {
    const fetchOptions = async (departmentValue) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/asset/getTypeofAsset`, { params: { idAssetCategory: departmentValue } });
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
      // Find the department field within the "Assets Information" subsection
      const assetsInfoSubsection = data.Subsection.find(subsection => subsection.SubsectionName === "Assets Information");
      if (!assetsInfoSubsection) {
        throw new Error('Assets Information subsection is missing');
      }

      const departmentField = assetsInfoSubsection.fields.find(field => field.name === "assetsCategories");
      
      if (!departmentField) {
        throw new Error('Department field is missing in Assets Information subsection');
      }

      return departmentField.value.value;
    };

    try {
      const departmentValue = getDepartmentValue();
      // Store the initial department value if not already set
      if (initialDepartmentValue !== departmentValue) {
        setInitialDepartmentValue(departmentValue);
        fetchOptions(departmentValue);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
    }
  }, [data, initialDepartmentValue,selectedAsset]);

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
