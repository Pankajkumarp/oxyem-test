import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SecTab from '../Components/Employee/SecTab';
import { axiosJWT } from '../Auth/AddAuthorization';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegClock, FaTimes } from "react-icons/fa";
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function Projectmanagement({ userFormdata }) {
  const router = useRouter();
  const headingContent = '';

  const AdduserContent = userFormdata
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [btpdata, setBtpData] = useState([]); // State to hold the content
  const [errorMessage, seterrorMessage] = useState("");
  
    const mergeSections = (newArraySections, btpdata) => {
    const projectManagementSection = newArraySections.find(section => section.SectionName === "ProjectManagement");

    if (projectManagementSection) {
        btpdata.forEach(btpSection => {
            if (btpSection.SectionName === "BTP" || btpSection.SectionName === "STP") {
                btpSection.fields.forEach(field => {
                    projectManagementSection.fields.push({
                        name: field.name,
                        attributeValue: field.attributeValue
                    });
                });
            }
        });
    }

    return newArraySections;
};
  const [SubmitButtonloader, setSubmitButtonloader] = useState(false);
  const handlesubmitApiData = async (newArray, value) => {
	  seterrorMessage("")
    setSubmitButtonloader(true);
    const sendData = mergeSections(newArray.section, btpdata);
    const apipayload = {
      "feature": newArray.feature,
      "section": sendData
    }
    try {
      const response = await axiosJWT.post(`${apiUrl}/project`, apipayload);
      // Handle the response if needed
      if (response.status === 200) {
		  if(response.data.errorMessage){
          seterrorMessage(response.data.errorMessage)
          window.scrollTo(0, 0);
      }
        const idProject = response.data.data.idProject; 
        setTimeout(() => {
			handeldocfiles(value, idProject);  
		}, 600);
    
      }
    } catch (error) {
      setSubmitButtonloader(false);
      console.error("Error occurred:", error);
    }
  };


  const handeldocfiles = async (formData, idProject) => {
    try {
      if (formData) {
        formData.append('idProject', idProject);

        const apiUrle = process.env.NEXT_PUBLIC_API_BASE_URL;
        const apiUrl = apiUrle + '/project/uploadDocuments ';
        const message = 'You have successfully create your new Project!';
        const response = await axiosJWT.post(apiUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.status === 200) {
        
          toast.success(({ id }) => (
            <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                <img src='/assets/img/Project-mang.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                <span dangerouslySetInnerHTML={{ __html: message }}></span>
                <button
                    onClick={() => toast.dismiss(id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#4caf50',
                        marginLeft: 'auto',
                        cursor: 'pointer'
                    }}
                >
                    <FaTimes />
                </button>
            </div>
        ), {
            icon: null, // Disable default icon
            duration: 5000,
            style: {
                border: '1px solid #4caf50',
                padding: '8px',
                color: '#4caf50',
            },
        });
       
          router.push(`/Project-dashboard`);
          setSubmitButtonloader(false);
        }
      }
    } catch (error) {
      setSubmitButtonloader(false);
      console.error("Error occurred during API call:", error);
    }
  }


  const handleBTPformvalue = (value) => {

    const newSections = value.section;
    setBtpData(newSections)

  };
    const onClose = async () => {
    seterrorMessage("")
  }
  return (
    <>
    <Head><title>{pageTitles.ProjectCreateProject}</title></Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs maintext={"Create Project"} tooltipcontent={"Add New Project"}/>
                  </div>
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body project-oxyem-alocation">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
						  {errorMessage !== "" ? (<div className="alert alert-danger alert-dismissible fade show" role="alert">{errorMessage}  <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></div>) : (null)}
                            <SecTab AdduserContent={AdduserContent} headingContent={headingContent} handlesubmitApiData={handlesubmitApiData} handleBTPformvalue={handleBTPformvalue} loaderSubmitButton={SubmitButtonloader}/>
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
      <Toaster
                position="top-right"
                reverseOrder={false}

            />

    </>

  );
}
export async function getServerSideProps(context) {

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'Project_management' }, context);
  return {
    props: { userFormdata },
  }
}
