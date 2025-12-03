import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ToastNotification, ToastContainer } from '../../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { useRouter } from 'next/router';
import Head from 'next/head';
import pageTitles from '../../../common/pageTitles';
const DynamicForm = dynamic(() => import('../../Components/CommanForm'), {
    ssr: false
});

export default function AddClaim() {
  const router = useRouter();
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "applyClaim" } });

      if (response.status === 200 && response.data.data) {
        setContent(response.data.data);
      }
    } catch (error) {
    //   console.error("Error occurred during API call:", error);
    }
  };


    const handleChangeValue = (fieldName, value) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array

        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];

            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];

                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];

                    if (field.name === fieldName) {
                        // Update the value of the field with matching fieldName
                        updatedArray.section[i].Subsection[j].fields[k].value = value;
                        break;
                    }
                }
            }
        }
        setContent(updatedArray);
    };
    
    const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const submitformdata = async (formdata ,fileData) => {
        const formattedData = {};
        setSubmitButtonLoading(true);
        content.section.forEach(section => {
          section.Subsection.forEach(subsection => {
              subsection.fields.forEach(field => {
                  // Skip radio objects
                  if (field.type === 'Radiot&c' || field.type === 'ClaimDoc') { return; }
                  
                  if (typeof field.value === 'object' && 'value' in field.value) {
                      formattedData[field.name] = field.value.value;
                  } else {
                      formattedData[field.name] = field.value;
                  }
              });
          });
      });
  
        try {
          
              const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/manageClaims';
              const response = await axiosJWT.post(apiUrl, formattedData);
  
              if (response.status === 200) {
                  
                  ToastNotification({ message: response.data.message });
                  const idClaim = response.data.data.idClaim;
                    handeldocfiles(fileData, idClaim);
                  if(formattedData.idEmployee) {
                      router.push(`/admin/claim`);
                  }else {
                      router.push(`/claim`);
                  }
                  setSubmitButtonLoading(false);
              }
      } catch (error) {
  
          if (error.response && error.response.status === 400) {
              const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
              ToastNotification({ message: errorMessage });
          } else {  
              ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
          }
          setSubmitButtonLoading(false);
      }
    };
  
  
    const handeldocfiles = async (formData, id) => {
      try {
        if (formData) {
          formData.append('moduleId', id);
          const apiUrle = process.env.NEXT_PUBLIC_API_BASE_URL;
          const apiUrl = apiUrle + '/claims/uploadDocuments';
          const response = await axiosJWT.post(apiUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
      } catch (error) { }
    }
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'claim-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);
    return (
        <>
        <Head>
        <title>{pageTitles.ClaimApplyClaim}</title>
        <meta name="description" content={pageTitles.ClaimApplyClaim} />
    </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        {content && content.section && Array.isArray(content.section) ? (
                                                            content.section.map((section, index) => (
                                                                <div key={index} >
                                                                    <DynamicForm
                                                                        fields={section}
                                                                        submitformdata={submitformdata}
                                                                        handleChangeValue={handleChangeValue}
                                                                        handleChangess={() => handleChangess(index)}
                                                                        pagename={'claim'}
                                                                        isModule={content.formType}
                                                                        loaderSubmitButton={SubmitButtonLoading}
                                                                    />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
