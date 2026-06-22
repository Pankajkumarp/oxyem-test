/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { GrFormNext } from 'react-icons/gr';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import { FaRegEdit } from "react-icons/fa";
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';
import { AiOutlineUser } from 'react-icons/ai';
import EmptyInfoBlock from '../../../Components/EmployeeDashboard/EmptyInfoBlock.jsx';

export default function PersonalInfo({ empId, apiBaseUrl }) {
    const [visible, setVisible] = useState(true); // Set to true to open section by default
    const [personalInfo, setPersonalInfo] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState([]);
    const [error, setError] = useState(null);

    const openEditModal = () => {
        fetchPersonalForm()
        setIsEditOpen(true);
        // if(isEditOpen){
        // populateFormData();
        // }
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
    };

    const fetchPersonalForm = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "PersonalInformation" } });

            if (response.status === 200 && response.data.data) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };

    const fetchPersonalInfo = async () => {
        try {
            if (empId) {
                const response = await axiosJWT.get(`${apiBaseUrl}/personalInfo`, { 
                    params: { idEmployee: empId } 
                });

                if (response.status === 200 && response.data.data) {
                    setPersonalInfo(response.data.data);
                }
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPersonalInfo();
        // if(isEditOpen){
        // fetchPersonalForm();
        // }
    }, [empId]);
useEffect(() => {
  if (isEditOpen && formData?.section?.length && personalInfo.length) {
    // eslint-disable-next-line react-hooks/immutability
    populateFormData();
  }
}, [isEditOpen, formData, personalInfo]);

    // const populateFormData = () => {
    //     const updatedFormData = { ...formData };
    //     const section = updatedFormData.section.find(sec => sec.SectionName === "PersonalInformation");
    //     if (section) {
    //         const subsection = section.Subsection.find(sub => sub.SubsectionName === "Personal Information");
    //         if (subsection) {
    //             subsection.fields.forEach(field => {
    //                 const matchingInfo = personalInfo.find(info => info.lebel === field.label);
    //                 if (matchingInfo) {
    //                     field.value = matchingInfo.value;
    //                 }
    //             });
    //         }
    //     }
    //     setFormData(updatedFormData);
    // };
    const populateFormData = () => {
  const updatedFormData = JSON.parse(JSON.stringify(formData));

  const section = updatedFormData.section.find(
    sec => sec.SectionName === "PersonalInformation"
  );

  if (!section) return;

  const subsection = section.Subsection.find(
    sub => sub.SubsectionName === "Personal Information"
  );

  if (!subsection) return;

  subsection.fields = subsection.fields.map(field => {
    const matchingInfo = personalInfo.find(
      info => info.lebel === field.label
    );

    return {
      ...field,
      value: matchingInfo ? matchingInfo.value : field.value || ""
    };
  });

  setFormData(updatedFormData);
};

const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const getSubmitFormData = async (value) => {
        setSubmitButtonLoading(true);
        try {
            if (value) {
                const apiUrl = `${apiBaseUrl}/personalInfo`;
                const response = await axiosJWT.post(apiUrl, value);

                if (response.status === 200) {
                    closeEditModal();
                    fetchPersonalInfo();
                    ToastNotification({ message: response.data.message });
                    setSubmitButtonLoading(false);
                }
            }
        } catch (error) {
            setSubmitButtonLoading(false);
            setError("something went wrong");
            console.error(error)
        }
    };

    return (
        <>
            <Edit isOpen={isEditOpen} closeModal={closeEditModal} formData={formData} getsubmitformdata={getSubmitFormData} empId={empId} error={error} loaderSubmitButton={SubmitButtonLoading}/>
            <div className="card-body">
                <h1 className="card-title">Personal Information

                        {personalInfo.length > 0 && (

                        <FaRegEdit style={{ cursor: 'pointer', float: 'right', color: 'var(--theme-pending-color-text)' }} size={15} onClick={openEditModal} />
                    )}
                    <GrFormNext 
                        onClick={() => setVisible(!visible)} 
                        style={{ cursor: 'pointer', transform: visible ? 'rotate(90deg)' : 'rotate(0deg)', float: 'right', margin: '-1px 11px 0px 0px' }} 
                    />
                </h1>
                
                {visible && (
                    <div>
                      {personalInfo.length === 0 ? (
<EmptyInfoBlock
                    title="No personal information added yet."
                    description="This helps HR reach someone in case of emergency."
                    buttonText="Add Personal Information"
icon={<AiOutlineUser size={48} color="#004D95" />}
                    onButtonClick={openEditModal}
                  />      ) : (
      <ul className="personal-info">
        {personalInfo.map((info, index) => {
          if (!info.value) return null;

          return (
            <React.Fragment key={index}>

              {/* Text before Aadhaar */}
              {info.lebel === "Aadhaar card No." && (
                <li className="section-text_identification">Identity</li>
              )}

              {/* Text before Passport */}
              {info.lebel === "Passport No" && (
                <li className="section-text_identification">Government IDs</li>
              )}

              <li>
                <div className="title">{info.lebel}</div>
                <div className="text">{info.value}</div>
              </li>

            </React.Fragment>
          );
        })}
      </ul>
    )}
                    </div>
                )}
            </div>
            <ToastContainer />
        </>
    );
}
