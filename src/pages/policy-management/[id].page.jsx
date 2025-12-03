import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SecTab from '../Components/Employee/SecTab';
import { axiosJWT } from '../Auth/AddAuthorization';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function EditPolicy({ userFormdata }) {
  const router = useRouter();
  const headingContent = '';
  const [AdduserContent, setAdduserContent] = useState(userFormdata);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fetchInfo = async (value) => {
    const payload = { "policyid": value }
    try {
      if (value) {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.post(`${apiUrl}/policy/policyEdit`, payload);
        if (response) {
          const fetchedData = response.data.policyDetail;
          // Merge response data into the AdduserContent state
          const updatedContent = { ...AdduserContent };

          // Check if fetched data matches fields in the array and update them
          updatedContent.section.forEach((section) => {
            section.Subsection.forEach((subsection) => {
              subsection.fields.forEach((field) => {
                if (fetchedData[field.name]) {
                  // Update the value of the matching field
                  field.value = fetchedData[field.name];
                }
              });
            });
          });

          // Update the state with the modified content
          setAdduserContent(updatedContent);
        }
      }
    } catch (error) {

    }
  };
  useEffect(() => {
    const { id } = router.query;
    console.log(id)
    fetchInfo(id)
  }, [router.query.id]);

  const [getFileinfo, setGetFileinfo] = useState("");
  const handlesubmitApiData = async (newArray, value) => {
    const section = newArray.section[0];
    const apipayload = {};
    section.fields.forEach(field => {
      apipayload[field.name] = field.attributeValue;
    });
    let docType;
	if(getFileinfo){
      docType = getFileinfo[0].type;
      apipayload['docType'] = docType;
	}
    try {
      const { id } = router.query;
      const addpayload = { policyid: id };
      const updatedPayload = { ...apipayload, ...addpayload };
      const response = await axiosJWT.post(`${apiUrl}/policy/editpolicy`, updatedPayload);
      if (response.status === 200) {
        const idClaim = response.data.docId;
        if (getFileinfo !== "") {
          const fileinfo = getFileinfo;
          const formData = new FormData();
          const fileData = [];
          if (Array.isArray(fileinfo)) {
            fileinfo.forEach((file) => {
              if (file instanceof File) {
                formData.append('files', file);
                fileData.push({
                  type: 'RequirementDocument',
                  name: file.name
                });
              } else {
                console.error("Invalid file object:", file);
              }
            });
          }
          formData.append('fileData', JSON.stringify(fileData));
          await handeldocfiles(formData, idClaim);
        } else {
          router.push(`/policy-dashboard`);
        }
      }
    } catch (error) {
      // Handle the error if any
      console.error("Error occurred:", error);
    }
  };

  const handeldocfiles = async (formData, id) => {
    try {
      if (formData) {
        formData.append('moduleId', id);
        const apiUrle = process.env.NEXT_PUBLIC_API_BASE_URL;
        const apiUrl = apiUrle + '/policy/upload';
        const response = await axiosJWT.post(apiUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response) {
          router.push(`/policy-dashboard`);
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  const handleGetfiles = async (value) => {
    setGetFileinfo(value)
  };

  return (
    <>
      <Head><title>{pageTitles.AttendanceApplyAttendance}</title></Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs maintext={"Edit Policy Management"} />
                  </div>
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                            <SecTab AdduserContent={AdduserContent} headingContent={headingContent} handlesubmitApiData={handlesubmitApiData} handleGetfiles={handleGetfiles} filegetpagename="policyManagement" pagename="edit_attendances" />
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
  const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'policy_management' }, context);
  return {
    props: { userFormdata },
  }
}
