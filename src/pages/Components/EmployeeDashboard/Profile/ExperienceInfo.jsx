import React, { useState, useEffect } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';
import EmptyInfoBlock from '../../../Components/EmployeeDashboard/EmptyInfoBlock.jsx';
import { GiBriefcase } from 'react-icons/gi';

export default function ExperienceInfo({ empId }) {
    const [experienceInfo, setExperienceInfo] = useState([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [Formdata, setFormData] = useState([]);

  const openEditModal = () => {
    setIsEditOpen(true);
    fetchBankForm();
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const fetchBankForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response =   await axiosJWT.get(`${apiUrl}/getDynamicForm`, {params:{"formType":"work"}})
    
        if (response.status === 200 && response.data.data) {
          setFormData(response.data.data);
        }
      
    } catch (error) {
      console.error("Error occurred during API call:", error);
    }
  };


        const fetchExperienceInfo = async () => {
            try {
                if (empId) {
                    
                    const response = await axiosJWT.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/workExperience`, { 
                        params: { idEmployee: empId } 
                    });

                    if (response.status === 200 && response.data.data) {
                        setExperienceInfo(response.data.data);
                    }
                }
            } catch (error) {
                console.error("Error occurred during API call:", error);
            }
        };

        

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchExperienceInfo();
        
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [empId]);


      const getsubmitformdata = async (value) => {
        try {
            if (value) {
    
                
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/employees/workExperience';
                const response = await axiosJWT.post(apiUrl, value);
    
                if (response.status === 200) {
                    closeEditModal();
                    fetchExperienceInfo();
                    ToastNotification({ message: response.data.message });
                }
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    }

    return (
        <>
        <Edit isOpen={isEditOpen} closeModal={closeEditModal} formData={Formdata} getsubmitformdata={getsubmitformdata} empId={empId}/>
        <div className="card-body">
            <h3 className="card-title">Experience
            {experienceInfo.length > 0 && ( <span className="add-btn-circle" onClick={openEditModal}>+</span>)}
            
            </h3>
            <div className="experience-box">

            {experienceInfo.length === 0 ? (
 <EmptyInfoBlock
                    title="No experience added yet."
                    description="This helps HR reach someone in case of emergency."
                    buttonText="Add Experience Detail"
icon={<GiBriefcase size={48} color="#004D95" />}
                    onButtonClick={openEditModal}
                  />              ) : (
                <ul className="experience-list">
                
                    {experienceInfo.map((experience) => (
                        <li key={experience.idWorkExperience}>
                            <div className="experience-user">
                                <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                                <div className="timeline-content">
                                    <a href="#/" className="name">
                                        {experience.previousCompany ? `${experience.previousRole} at ${experience.previousCompany}` : `${experience.previousRole} at ${experience.previousCompany}`}
                                    </a>
                                    <span className="time">
                                        {experience.startDate} - {experience.endDate}
                                    </span>
                                    <div>{experience.previousLocation ? experience.previousLocation : experience.location}</div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

            )}
            </div>
        </div>
        <ToastContainer />
        </>
    );
}
