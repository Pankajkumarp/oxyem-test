import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Edit from '../../Components/EmployeeDashboard/Edit/Edit';
import { axiosJWT } from '../../Auth/AddAuthorization';
import toast, { Toaster } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { FaRegCheckCircle} from "react-icons/fa";
const DynamicForm = dynamic(() => import('../../Components/CommanForm'), { ssr: false });
export default function Finance({ applicantid, fullName,isBoaGenerated }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState([]);
    const [content, setContent] = useState([]);
    const router = useRouter();
    const openEditModal = () => {
        fetchBankForm();
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
    };


        useEffect(() => {
            fetchForm();   // Ensure content updates when formData prop changes
        }, []);

    const fetchBankForm = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "basketAllowanceforApplicant" } });

            if (response.status === 200 && response.data.data) {
                const updatedFormData = response.data.data;

                // Update the Employee Name field with the fullName prop
                updatedFormData.section[0].Subsection[0].fields = updatedFormData.section[0].Subsection[0].fields.map(field => {
                    if (field.name === "employeeName") {
                        return { ...field, value: fullName }; // Set the fullName as the default value
                    }
                    return field;
                });

                setFormData(updatedFormData);
            }
        } catch (error) {
            
            setError("Failed to fetch form data");
        }
    };

    const fetchForm = async () => {
      try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "applicantJoininginfo" } });
  
          if (response.status === 200 && response.data.data) {
              const updatedFormData = response.data.data;
  
              // Assuming offerLetterPath is coming from some API response
              const offerLetterPath = isBoaGenerated; 
  
              updatedFormData.section.forEach(section => {
                  section.buttons = section.buttons.map(button => {
                      if (button.value === "offerletter") {
                          return { ...button, isDisabled: !offerLetterPath }; // Disable if null/undefined/empty
                      }
                      if (button.value === "finance") {
                          return { ...button, isDisabled: !!offerLetterPath }; // Enable if offerLetterPath is available
                      }
                      return button;
                  });
              });
  
              setContent(updatedFormData);
          }
      } catch (error) {
          setError("Failed to fetch form data");
      }
  };
  

    const handleCancel = () => {
        
        // Add your cancel logic here
    };

    const transformFormData = (data) => {
        const transformedData = {};
        data.section.forEach(section => {
            section.fields.forEach(field => {
                if (field.name !== "employeeName") {
                    transformedData[field.name] = field.attributeValue;
                }
            });
        });
        transformedData.idJobApplicant = applicantid; // Add the idJobApplicant field
        return transformedData;
    };

    const getsubmitformdata = async (value) => {
        const transformedData = transformFormData(value);
        // Add your form submission logic here, e.g., sending the transformed data to an API
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 
            const response = await axiosJWT.post(`${apiUrl}/jobs/generateBoa`, transformedData);
      
            if (response) {
              const message = 'You have successfully <strong>added BOA </strong>!';
              toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                  <FaRegCheckCircle style={{
							fontSize: '35px',
							marginRight: '10px',
							color: '#4caf50'
						}} />
                  <span dangerouslySetInnerHTML={{ __html: message }}></span>
                  <button
            onClick={() => toast.dismiss(id)}
            style={{
                background: 'none',
				border: 'none',
				color: '#4caf50',
				marginLeft: 'auto',
				cursor: 'pointer',
				fontSize: '20px',
            }}
          >
                    <FaTimes />
                  </button>
                </div>
              ), {
                icon: null, // Disable default icon
                duration: 7000,
                style: {
                  border: '1px solid #4caf50',
                  padding: '8px',
                  color: '#4caf50',
                },
              });
                closeEditModal();
                router.push('/onboardDashboard'); 
            }
          } catch (error) {
            const errormessage = 'Error connecting to the backend. Please try after Sometime.';
            toast.success(({ id }) => (
              <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
                <button
                  onClick={() => toast.dismiss(id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FF000F',
                    marginLeft: 'auto',
                    cursor: 'pointer'
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            ), {
              icon: null, // Disable default icon
              duration: 7000,
              style: {
                border: '1px solid #FF000F',
                padding: '8px',
                color: '#FF000F',
              },
            });
            
          }
    };

    const getsubmit = async (value) =>{

    }
    const handleJobApplicantOfferlatter = async (value ,formData) =>{
        if(value === "Finance"){
        openEditModal();
        }
        else if(value === "OfferLetter"){
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                const idJobApplicant = applicantid || ''; // Replace 'defaultId' with actual logic if necessary
                const transformedData = {
                ...formData,
                idJobApplicant // Adding idJobApplicant to the data object
            };

                const response = await axiosJWT.post(`${apiUrl}/jobs/generateOfferLetter`, transformedData);
          
                if (response) {
                  const message = 'You have successfully <strong>generated Offer Letter</strong>!';
                  toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                      <FaRegCheckCircle style={{
							fontSize: '35px',
							marginRight: '10px',
							color: '#4caf50'
						}} />
                      <span dangerouslySetInnerHTML={{ __html: message }}></span>
                      <button
            onClick={() => toast.dismiss(id)}
            style={{
                background: 'none',
				border: 'none',
				color: '#4caf50',
				marginLeft: 'auto',
				cursor: 'pointer',
				fontSize: '20px',
            }}
          >
                        <FaTimes />
                      </button>
                    </div>
                  ), {
                    icon: null, // Disable default icon
                    duration: 7000,
                    style: {
                      border: '1px solid #4caf50',
                      padding: '8px',
                      color: '#4caf50',
                    },
                  });

                    closeEditModal();
                    router.push('/onboardDashboard'); 
                }
              } catch (error) {
                const errormessage = 'Error connecting to the backend. Please try after Sometime.';
                toast.success(({ id }) => (
                  <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
                    <button
                      onClick={() => toast.dismiss(id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FF000F',
                        marginLeft: 'auto',
                        cursor: 'pointer'
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ), {
                  icon: null, // Disable default icon
                  duration: 7000,
                  style: {
                    border: '1px solid #FF000F',
                    padding: '8px',
                    color: '#FF000F',
                  },
                });
                
              }
        } 
    }
    

    const handleChangeValue = (fieldName, value) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array
        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];
            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];
                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];
                    if (field.name === fieldName) {
                        updatedArray.section[i].Subsection[j].fields[k].value = value;
                        break;
                    }
                }
            }
        }
        setContent(updatedArray);
    };
    return (
        <>
            <Edit
                isOpen={isEditOpen}
                closeModal={closeEditModal}
                formData={formData}
                getsubmitformdata={getsubmitformdata}
                empId={applicantid}
                error={error}
                pagename={'onboardingProcess'}
            />
                        <div className="mt-4">
                            {content && content.section && Array.isArray(content.section) ? (
                                content.section.map((section, index) => (
                                    <div key={index} >
                                        <DynamicForm
                                            fields={section}
                                            submitformdata={getsubmit}
                                            handleChangeValue={handleChangeValue}
                                            handleChangess={() => handleChangess(index)}
                                            pagename={'jobApplicantsFinance'}
                                            isModule={content.formType}  
                                            handleApprrovereqClaim={handleJobApplicantOfferlatter}                                                                                
                                        />
                                    </div>
                                ))
                            ) : ( <div>No sections available</div> )}
                        </div>

            <Toaster
        position="top-right"
        reverseOrder={false}

      />
        </>
    );
}
