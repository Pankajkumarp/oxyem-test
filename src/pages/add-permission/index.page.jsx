import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { axiosJWT } from '../Auth/AddAuthorization';
import { useRouter } from 'next/router';
import { fetchWithToken } from '../Auth/fetchWithToken';

const DynamicForm = dynamic(() => import('../Components/CommanForm'), {
    ssr: false
});

export default function AddClaim({userFormdata}) {
  const router = useRouter();
  const [content, setContent] = useState(userFormdata);


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

                    // If the field name is 'service', update the dependentId of 'functions'
                    if (fieldName === 'idServiceMaster') {
                        const functionsField = subsection.fields.find(f => f.name === 'idFunctionMaster');
                        if (functionsField) {
                            functionsField.dependentId = value.value;
                        }
                    }

                    break;
                }
            }
        }
    }
    setContent(updatedArray);
};


const [SubmitButtonloader, setSubmitButtonloader] = useState(false);
    const submitformdata = async () => {
        const formattedData = {};
        setSubmitButtonloader(true);
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
          
              const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/permission/addPermission';
              const response = await axiosJWT.post(apiUrl, formattedData);
  
              if (response.status === 200) {
                  ToastNotification({ message: response.data.message });
                  router.push(`/permission-list`);
                    setSubmitButtonloader(false);
              }
      } catch (error) {
                setSubmitButtonloader(false);
          if (error.response && error.response.status === 400) {
              const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
              ToastNotification({ message: errorMessage });
          } else {  
              ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
          }
      }
    };
  
    return (
        <>
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
                                                                        pagename={'adminclaimInfo'}
                                                                        isModule={content.formType}
                                                                        loaderSubmitButton={SubmitButtonloader}
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


export async function getServerSideProps(context) {	
	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'permissionManagement' }, context);
	return {
	  props: { userFormdata  },
	}
  }




  