import React, { useState, useEffect } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';

export default function ExperienceInfo({ empId ,showbutton}) {
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
        
        console.log(response);
        if (response.status === 200 && response.data.data) {
          setFormData(response.data.data);
        }
      
      // console.log(response);
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
        fetchExperienceInfo();
        
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
            {!showbutton ? null : <span className="add-btn-circle" onClick={openEditModal}>+</span>}
            
            </h3>
            <div className="experience-box">

            {experienceInfo.length === 0 ? (
                <div>No records found</div>
            ) : (
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
