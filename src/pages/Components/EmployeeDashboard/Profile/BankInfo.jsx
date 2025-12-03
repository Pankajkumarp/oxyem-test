import React, { useState, useEffect } from 'react';
import { GrFormNext } from 'react-icons/gr';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';

export default function BankInfo({ empId, apiBaseUrl, Formdata ,showbutton}) {
  const [bankInfo, setBankInfo] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openSection, setOpenSection] = useState(0); // Default to first section open
  const [bankFormData, setFormData] = useState([]);
  const [error, setError] = useState(null);

  const fetchBankInfo = async () => {
    try {
      if (empId) {
        const response = await axiosJWT.get(`${apiBaseUrl}/bankInformation`, {
          params: { idEmployee: empId },
        });

        if (response.status === 200 && response.data.data) {
          // Assuming your response.data.data is already in the correct format
          setBankInfo(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error occurred during API call:", error);
    }
  };

  const fetchBankForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "BankInformation" } });

      if (response.status === 200 && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error("Error occurred during API call:", error);
    }
  };

  useEffect(() => {
    fetchBankInfo();
    
  }, [empId]);

  const openEditModal = () => {
    fetchBankForm();
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };
const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
  const getsubmitformdata = async (value) => {
    setSubmitButtonLoading(true);
    try {
      if (value) {
        // Filter out BankConformAccountNo field
        const filteredValue = {
          ...value,
          section: value.section.map(section => ({
            ...section,
            fields: section.fields.filter(field => field.name !== 'BankConformAccountNo')
          }))
        };
        const apiUrl = `${apiBaseUrl}/bankInformation`;
        const response = await axiosJWT.post(apiUrl, filteredValue);
  
        if (response.status === 200) {
          closeEditModal();
          fetchBankInfo();
          ToastNotification({ message: response.data.message });
          setSubmitButtonLoading(false);
        }
      }
    } catch (error) {
      setSubmitButtonLoading(false);
      setError("Something went wrong");
    }
  };

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <>
      <Edit isOpen={isEditOpen} closeModal={closeEditModal} formData={bankFormData} getsubmitformdata={getsubmitformdata} empId={empId} error={error} loaderSubmitButton={SubmitButtonLoading}/>
      <div className="card-body">
        <h3 className="card-title">Bank Information
        {!showbutton ? null : <span className="add-btn-circle" onClick={openEditModal}>+</span>}
        </h3>

        {bankInfo.length === 0 ? (
          <div>No records found</div>
        ) : (
          bankInfo.map((infoArray, index) => {
            const nameOnAccount = infoArray.find(info => info.lebel === "Name on account")?.value;
            const bankName = infoArray.find(info => info.lebel === "Bank Name")?.value;
            const isPrimary = infoArray.find(info => info.lebel === "Primary")?.value;

            return (
              <div key={index} className="accordion-item mt-1">
                <div className="accordion-header" onClick={() => toggleSection(index)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                  {nameOnAccount} ({bankName})  {isPrimary && <span className='oxyem-mark-active'>Primary</span>}
                  <GrFormNext size={20} style={{ transform: openSection === index ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                </div>
                {openSection === index && (
                  <div className="accordion-body mt-0">
                    <div className="accordion-body-content">
                      <ul className="personal-info">
                        
                        {infoArray
                          .filter(info => info.lebel !== "Primary")
                                                            .map((info, detailIndex) => (
                                                                <li key={detailIndex}>
                                                                    <div className="title">{info.lebel}</div>
                                                                    <div className="text">{info.value}</div>
                                                                </li>
                                                            ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "BankInformation" } });
  let Formdata = response.data.data;

  return {
    props: { Formdata },
  };
}
