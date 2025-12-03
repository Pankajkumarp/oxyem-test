import React, { useEffect, useState } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Edit from '../Edit/Edit';
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';

export default function EducationInfo({ empId, apiBaseUrl,showbutton }) {
  const [educationInfo, setEducationInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [Formdata, setFormData] = useState([]);

  const openEditModal = () => {
    setIsEditOpen(true);
    fetchEducationForm();
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };


  const fetchEducationForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response =   await axiosJWT.get(`${apiUrl}/getDynamicForm`, {params:{"formType":"EducationalInformation"}})
        
        console.log(response);
        if (response.status === 200 && response.data.data) {
          setFormData(response.data.data);
        }
      
      // console.log(response);
    } catch (error) {
      console.error("Error occurred during API call:", error);
    }
  };

  const fetchEducationInfo = async () => {
    try {
      if (empId) {
        const response = await axiosJWT.get(`${apiBaseUrl}/educationalnfo`, {
          params: { idEmployee: empId }
        });
        if (response.data.status === 200) {
          setEducationInfo(response.data.data);
          setError(null);  // Clear any previous error
        } else if (response.data.status === 404) {
          setEducationInfo([]);
          setError(response.data.message);
        } else {
          setError('Failed to fetch education information');
        }
      }
    } catch (error) {
      setError('An error occurred while fetching education information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationInfo();
    
  }, [empId]);

  const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
  const getsubmitformdata = async (value) => {
    setSubmitButtonLoading(true);
    try {
      if (value) {
        const response = await axiosJWT.post(`${apiBaseUrl}/educationalnfo`, value);
        if (response.status === 200) {
          closeEditModal();
          fetchEducationInfo();
          ToastNotification({ message: response.data.message });
          setSubmitButtonLoading(false);
        }
      }
    } catch (error) {
      setSubmitButtonLoading(false);
      console.error("Error occurred during API call:", error);

    }
  }

  return (
    <>
      <Edit isOpen={isEditOpen} closeModal={closeEditModal} formData={Formdata} getsubmitformdata={getsubmitformdata} empId={empId} loaderSubmitButton={SubmitButtonLoading}/>
      <div className="card-body">
        <h3 className="card-title">
          Education Information
          {!showbutton ? null : <span className="add-btn-circle" onClick={openEditModal}>+</span>  }
        </h3>
        <div className="experience-box">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : educationInfo.length === 0 ? (
            <div>No records found</div>
          ) : (
            <ul className="experience-list">
              {educationInfo.map((education) => (
                <li key={education.idEducation}>
                  <div className="experience-user">
                    <div className="before-circle" />
                  </div>
                  <div className="experience-content">
                    <div className="timeline-content">
                      <a href="#/" className="name">{education.Institution}</a>
                      <div>{education.Subject}</div>
                      <div>{education.QualificationType}</div>
                      <span className="time">
                         {education.startDate} - {education.endDate}
                      </span>
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
