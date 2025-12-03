import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import dynamic from 'next/dynamic';
import { ToastNotification, ToastContainer } from '../Components/EmployeeDashboard/Alert/ToastNotification';

const DynamicForm = dynamic(() => import('../Components/CommanForm'), {
  ssr: false,
});

export default function Index({ userFormdata }) {
  const router = useRouter();
  const [details, setClaimDetails] = useState({});
  const [cid, setCId] = useState('');
  const [content, setContent] = useState(userFormdata);
  const [content2, setContent2] = useState(userFormdata);
  const [isContentUpdated, setIsContentUpdated] = useState(false); // New state

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      fetchInfo(id);
      setCId(id);
    }
  }, [router.query.id]);

  const fetchInfo = async (value) => {
    try {
      if (value) {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/permission/viewPermission`, {
          params: { idPermission: value },
        });
        if (response.status === 200 && response.data.data) {
          const fetchedData = response.data.data;
          setClaimDetails(fetchedData);
          updateFormWithDetails(fetchedData);
        }
      }
    } catch (error) {
      
    }
  };

  const updateFormWithDetails = (fetchedData) => {
    const updatedContent = JSON.parse(JSON.stringify(content));

    updatedContent.section.forEach((section) => {
      section.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          if (fetchedData[field.name]) {
            if (typeof fetchedData[field.name] === 'object') {
              field.value = fetchedData[field.name];
            } else {
              field.value = fetchedData[field.name];
            }
          }
        });
      });
    });

    setContent2(updatedContent);
    setIsContentUpdated(true); // Mark content as updated
  };

  const handleChangeValue = (fieldName, value) => {
    const updatedArray = JSON.parse(JSON.stringify(content));

    for (let i = 0; i < updatedArray.section.length; i++) {
      const section = updatedArray.section[i];

      for (let j = 0; j < section.Subsection.length; j++) {
        const subsection = section.Subsection[j];

        for (let k = 0; k < subsection.fields.length; k++) {
          const field = subsection.fields[k];

          if (field.name === fieldName) {
            updatedArray.section[i].Subsection[j].fields[k].value = value;

            if (fieldName === 'idServiceMaster') {
              const functionsField = subsection.fields.find(f => f.name === 'idFunctionMaster');
              if (!functionsField) {
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

  const submitformdata = async () => {
    const formattedData = {};
    
    content2.section.forEach((section) => {
      section.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          if (field.type === 'Radiot&c' || field.type === 'ClaimDoc') return;

          if (typeof field.value === 'object' && 'value' in field.value) {
            formattedData[field.name] = field.value.value;
          } else {
            formattedData[field.name] = field.value;
          }
        });
      });
    });

    formattedData["idPermission"] = cid;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/permission/addPermission';
      const response = await axiosJWT.post(apiUrl, formattedData);

      if (response.status === 200) {
        ToastNotification({ message: response.data.message });
        router.push(`/permission-list`);
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.status === 400
          ? error.response.data.errors || 'Failed to submit the form. Please try again later.'
          : 'Failed to submit the form. Please try again later.';
      ToastNotification({ message: errorMessage });
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
                          <div
                            className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border"
                            id="sk-create-page"
                          >
                            {isContentUpdated ? ( // Only render DynamicForm after content is updated
                              content2.section.map((section, index) => (
                                <div key={index}>
                                  <DynamicForm
                                    fields={section}
                                    submitformdata={submitformdata}
                                    handleChangeValue={handleChangeValue}
                                    pagename={'adminclaimInfo'}
                                    isModule={content2.formType}
                                  />
                                </div>
                              ))
                            ) : (
                              <div>Loading...</div>
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
  const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, {
    params: { formType: 'permissionManagement' },
  });
  const userFormdata = response.data.data;
  return {
    props: { userFormdata },
  };
}
