import React, { useState, useEffect } from 'react';
// import Selectcreatable from 'react-select/creatable';
// import Select from 'react-select';
import SecTab from '../Components/Employee/SecTab';
import axios from "axios";
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { fetchWithToken } from '../Auth/fetchWithToken';

export default function Projectmanagement({ userFormdata }) {

    const headingContent = '';
    
    const [AdduserContent, setAdduserContent] = useState(userFormdata);
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const apidata = {
        "feature": "Project_management",
        "section": [
            {
                "SectionName": "ProjectManagement",
                "fields": [
                    {
                        "name": "projectName",
                        "attributeValue": "Oxytal Project"
                    },
                    {
                        "name": "clientName",
                        "attributeValue": "2075a6b0-5d20-4dbb-a596-3c8b120e38a0"
                    },
                    {
                        "name": "startDate",
                        "attributeValue": "2024-04-29"
                    },
                    {
                        "name": "endDate",
                        "attributeValue": "2024-05-22"
                    }
                ]
            },
            {
                "SectionName": "TeamManagement",
                "fields": [
                    {
                        "name": "projectManager",
                        "attributeValue": [
                            10494959
                        ]
                    },
                    {
                        "name": "addTeam",
                        "attributeValue": [
                            2958595050,
                            304985858959
                        ]
                    },
                    {
                        "name": "Description",
                        "attributeValue": "Oxytal Project Description"
                    }
                ]
            },
            {
                "SectionName": "Documents",
                "fields": [
                    {
                        "name": "97a47f32-b021-470c-a83a-192ef3caa7af",
                        "fileData": "[object Object]"
                    },
                    {
                        "name": "e203bc68-6c1a-4397-a6db-2bb46352f8eb",
                        "fileData": "[object Object]"
                    }
                ]
            }
        ]
    }

    console.log("11 formdata", userFormdata)
    console.log("22 apidata", apidata)
    const handlesubmitApiData = async (value) => {
        console.log("Documents section api:", value);
        try {
          const response = await axios.post(`${apiUrl}/Projectmanagement`, value);
          // Handle the response if needed
          console.log("Response:", response.data);
        } catch (error) {
          // Handle the error if any
          console.error("Error occurred:", error);
        }
      };
      const mergeFormDataWithApiData = (formData, apiData) => {
        // Iterate through each section in the form data
        formData.section.forEach(formSection => {
          // Find the corresponding section in the API data
          const apiSection = apiData.section.find(apiSec => apiSec.SectionName === formSection.name);
      
          if (apiSection) {
            // Iterate through each subsection in the form section
            formSection.Subsection.forEach(subsection => {
              subsection.fields.forEach(field => {
                // Check if the field is of type 'DocumentType'
                if (field.type === 'DocumentType') {
                  // Handle document type fields separately
                  field.value = [];
                  apiSection.fields.forEach(apiField => {
                    if (apiField.fileData) {
                      field.value.push({
                        type: apiField.name,
                        files: apiField.fileData
                      });
                    }
                  });
                } else {
                  // Find the corresponding field in the API data for non-document fields
                  const apiField = apiSection.fields.find(apiFld => apiFld.name === field.name);
                  if (apiField) {
                    // Update the field value with the API data value
                    field.value = apiField.attributeValue;
                  }
                }
              });
            });
          }
        });
      
        return formData;
      };
      
     // const updatedFormData = mergeFormDataWithApiData(userFormdata, apidata);
     useEffect(() => {
        const updatedFormData = mergeFormDataWithApiData(userFormdata, apidata);
        setAdduserContent(updatedFormData)
        console.log("dummy jason data", updatedFormData)
    }, [userFormdata, apidata]);


    return (
        <>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                <div className="col">
                                    <Breadcrumbs maintext={"Edit Project"} />
                                </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <SecTab AdduserContent={AdduserContent} headingContent={headingContent} handlesubmitApiData={handlesubmitApiData}/>
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

            
        </>

    );
}
export async function getServerSideProps(context) {	
 
	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
     const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'Project_management' }, context);
	
	return {
	  props: { userFormdata  },
	}
  }
