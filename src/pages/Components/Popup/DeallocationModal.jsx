import React, { useEffect, useState } from "react";
import { axiosJWT } from '../../Auth/AddAuthorization';
import Edit from "../EmployeeDashboard/Edit/Edit";

export default function LeavePopup({ isOpen, closeModal, onSubmit, DeallocationId }) {
  const [formData, setFormData] = useState('');
  const [error, setError] = useState(null);
  const getsubmitformdata = async (value) => { onSubmit(value); };

  const fetchBankForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "deallocateAssetsPopup" } });
      if (response.status === 200 && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if(isOpen){
    fetchBankForm();
    }
  }, [isOpen]);

  return (
    <>
    <Edit isOpen={isOpen} closeModal={closeModal} formData={formData} getsubmitformdata={getsubmitformdata} error={error} empId={DeallocationId}/>
    </>
  );
}

