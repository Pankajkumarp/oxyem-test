import React, { useState, useEffect } from 'react';
import { GrFormNext } from 'react-icons/gr';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import { FaRegEdit } from "react-icons/fa";
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';

export default function PersonalInfo({ empId, apiBaseUrl ,showbutton }) {
    const [visible, setVisible] = useState(true); // Set to true to open section by default
    const [personalInfo, setPersonalInfo] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState([]);
    const [error, setError] = useState(null);

    const openEditModal = () => {
        fetchPersonalForm()
        setIsEditOpen(true);
        if(isEditOpen){
        populateFormData();
        }
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
        fetchPersonalInfo();
        if(isEditOpen){
        fetchPersonalForm();
        }
    }, [empId]);

    const populateFormData = () => {
        const updatedFormData = { ...formData };
        const section = updatedFormData.section.find(sec => sec.SectionName === "PersonalInformation");
        if (section) {
            const subsection = section.Subsection.find(sub => sub.SubsectionName === "Personal Information");
            if (subsection) {
                subsection.fields.forEach(field => {
                    const matchingInfo = personalInfo.find(info => info.lebel === field.label);
                    if (matchingInfo) {
                        field.value = matchingInfo.value;
                    }
                });
            }
        }
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
        }
    };

    return (
        <>
            <Edit isOpen={isEditOpen} closeModal={closeEditModal} formData={formData} getsubmitformdata={getSubmitFormData} empId={empId} error={error} loaderSubmitButton={SubmitButtonLoading}/>
            <div className="card-body">
                <h3 className="card-title">Personal Information

                    {!showbutton ? null :
                    
                    personalInfo.length === 0 ? (
                        <span className="add-btn-circle" onClick={openEditModal}>+</span>
                    ) : (
                        <FaRegEdit style={{ cursor: 'pointer', float: 'right', color: 'var(--theme-pending-color-text)' }} size={15} onClick={openEditModal} />
                    )}
                    <GrFormNext 
                        onClick={() => setVisible(!visible)} 
                        style={{ cursor: 'pointer', transform: visible ? 'rotate(90deg)' : 'rotate(0deg)', float: 'right', margin: '-1px 11px 0px 0px' }} 
                    />
                </h3>
                
                {visible && (
                    <div>
                        {personalInfo.length === 0 ? (
                            <div>No records found</div>
                        ) : (
                            <ul className="personal-info">
                                {personalInfo.map((info, index) => (
                                    info.value ? (
                                        <li key={index}>
                                            <div className="title">{info.lebel}</div>
                                            <div className="text">{info.value}</div>
                                        </li>
                                    ) : null
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            <ToastContainer />
        </>
    );
}
