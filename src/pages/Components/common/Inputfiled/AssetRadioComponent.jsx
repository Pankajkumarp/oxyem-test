import React, { useState, useEffect } from 'react';
import { FaRegEye } from "react-icons/fa6";
import View from '../../Popup/assetDetail';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function RadioComponent({ value, name, onChange, label, pagename, data }) {
  const [selectedValue, setSelectedValue] = useState(value);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialDepartmentValue, setInitialDepartmentValue] = useState('');
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);
  const [viewData, setViewData] = useState(null);

  const handleChange = (event) => {
    const newValue = event.target.value === 'true'; // Ensure the value is treated as boolean
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const openDetailpopup = () => {
    setIsModalOpen(true);
  };

  const closeDetailpopup = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchOptions = async (departmentValue, idEmployee) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/asset/assetAllocationInfo`, {
          params: { typeOfAsset: departmentValue, idEmployee }
        });
        console.log(response);
        if (response.status === 200 && Object.keys(response.data).length > 0) {
          setViewData(response.data.data);
          setHasData(true);
          setSelectedValue(true); // Set value to true if data is not empty
        } else {
          setHasData(false);
          setSelectedValue(false); // Set value to false if data is empty
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch options');
        setHasData(false);
        setSelectedValue(false); // Set value to false if there's an error
      }
    };

    const getDepartmentValue = () => {
      const roleInfoSubsection = data.Subsection?.find(subsection => subsection.SubsectionName === "Allocation Information");
      if (!roleInfoSubsection) {
        throw new Error('Role Information subsection is missing');
      }

      const departmentField = roleInfoSubsection.fields.find(field => field.name === "typeOfAsset");
      if (!departmentField) {
        throw new Error('Department field is missing in Role Information subsection');
      }

      return departmentField.value.value;
    };

    const getIdEmployeeValue = () => {
      const roleInfoSubsection = data.Subsection?.find(subsection => subsection.SubsectionName === "Allocation Information");
      if (!roleInfoSubsection) {
        throw new Error('Role Information subsection is missing');
      }

      const employeeField = roleInfoSubsection.fields.find(field => field.name === "idEmployee");
      if (!employeeField) {
        throw new Error('idEmployee field is missing in Role Information subsection');
      }

      return employeeField.value.value;
    };

    try {
      if (data && Object.keys(data).length > 0) {
        const departmentValue = getDepartmentValue();
        const idEmployee = getIdEmployeeValue();

        if (initialDepartmentValue === '' || departmentValue !== initialDepartmentValue) {
          setInitialDepartmentValue(departmentValue);
          fetchOptions(departmentValue, idEmployee);
        }
      } else {
        setSelectedValue(false);
        setHasData(false);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch options');
      setHasData(false);
      setSelectedValue(false);
    }
  }, [data, initialDepartmentValue]);

  return (
    <>
      <View isOpen={isModalOpen} closeModal={closeDetailpopup} viewData={viewData} />
      <div className='radio_btn_box'>
        <span style={{ padding: '7px', fontWeight: '600' }}>{label}</span>
        <div className="form-check form-check-inline mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            name={name}
            id={`${name}-yes`}
            value={true}
            checked={selectedValue === true}
            onChange={handleChange}
            disabled
          />
          <span className="form-check-label" htmlFor={`${name}-yes`} style={{ position: 'relative', top: '0', left: '0' }}>
            Yes
          </span>
        </div>
        <div className="form-check form-check-inline mt-3">
          <input
            className="form-check-input"
            type="checkbox"
            name={name}
            id={`${name}-no`}
            value={false}
            checked={selectedValue === false}
            onChange={handleChange}
            disabled
          />
          <span className="form-check-label" htmlFor={`${name}-no`} style={{ position: 'relative', top: '0', left: '0' }}>
            No
          </span>
        </div>
        {pagename === "allocateAsset" && hasData && (
          <span className='icon_input_radio' onClick={openDetailpopup}>
            <FaRegEye size={15} color='var(--theme-primary-color)' />
          </span>
        )}
      </div>
    </>
  );
}
