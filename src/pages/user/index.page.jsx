import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import EmployeeSection from '../Components/Employee/EmployeeSection';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import Head from 'next/head';
import { FaUserPlus } from "react-icons/fa";
import Breadcrumbs from "../Components/Breadcrumbs/Breadcrumbsdiscription";
import axios from 'axios';

export default function User({ userFormdata, errorMessage, previousUrl }) {

  const router = useRouter();
  useEffect(() => {
    if (errorMessage && previousUrl) {
      router.push(previousUrl);
    }
  }, [errorMessage, router, previousUrl]);

  const headingContent = 'Create Account';
  const AdduserContent = userFormdata
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/employees';
  const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
  const completehandleSubmit = async (value, myfiles, buttonval) => {
    setSubmitButtonLoading(true);
    try {
      if (value) {
        const filteredValue = {
          ...value,
         status: buttonval,
          section: value.section.filter(section => section.SectionName !== 'Preview' && section.SectionName !== 'Documents')
        };

        const response = await axiosJWT.post(apiUrl, filteredValue);

        if (response.status === 200) {
          const employeeId = response.data.employeeId; // Ensure this matches your API response structure
          ToastNotification({ message: response.data.message });
          handeldocfiles(myfiles, employeeId);
          router.push(`/admin/user-list`);
          setSubmitButtonLoading(false);
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        const errors = error.response.data.errors || [];
        const errorMessage = errors.map(err => err.msg).join('.</br>') || 'Failed to submit the form. Please try again later.';
        ToastNotification({ message: errorMessage });
      } else {
        console.error('Error:', error);
        ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
      }
      setSubmitButtonLoading(false);
    }
  }

  const handeldocfiles = async (formData, employeeId) => {
    try {
      if (formData) {
        formData.append('idEmployee', employeeId);

        const apiUrle = process.env.NEXT_PUBLIC_API_BASE_URL;
        const apiUrl = apiUrle + '/employees/uploadDocuments';

        const response = await axiosJWT.post(apiUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if(response){
          /* empty */
        }
      }
    } catch (error) {
      console.error("Error occurred during API call:", error);
    }
  }

  return (
    <>

      {userFormdata ? (
        <div>
          <Head>
            <title>Create Employee Profile | Oxytal</title>
            <meta name="description" content={"Add a new employee user by entering profile details, role, department, and access permissions in the employee management system."} />
          </Head>
          <div className="main-wrapper">
            <div className="page-wrapper">
              <div className="content container-fluid">
                <Breadcrumbs
                  maintext={"Add New Employee"}
                  discription={"Create a new employee profile by entering personal details, role, department, and access information."}
                  icon={<FaUserPlus />}
                />
                <div className="row">
                  <div className="col-12 col-lg-12 col-xl-12">
                    <div className="row">
                      <div className="col-12 col-lg-12 col-xl-12 d-flex">
                        <div className="card flex-fill comman-shadow oxyem-index">
                          <div className="center-part">
                            <div className="card-body oxyem-mobile-card-body">
                              <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                <EmployeeSection AdduserContent={AdduserContent} headingContent={headingContent} apiUrl={apiUrl} getsubmitformdatapreview={completehandleSubmit} handeldocfiles={handeldocfiles} loaderSubmitButton={SubmitButtonLoading} />
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
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie || '';
  const accessToken = cookies.split(';').find(cookie => cookie.trim().startsWith('accessToken='))?.split('=')[1] || null;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const previousUrl = context.req.headers.referer || '/';
  let userFormdata = null;
  let errorMessage = null;

  try {
    const response = await axios.get(`${apiUrl}/getDynamicForm`, {
      params: { formType: 'createEmployee' },
      headers: {
        Authorization: accessToken,
      },
    });

    if (response.data?.errorMessage) {
      errorMessage = response.data.errorMessage;
    } else {
      userFormdata = response.data.data;
    }
  } catch (error) {
      console.error(error);
  }

  return {
    props: { userFormdata: userFormdata || null, errorMessage, previousUrl },
  };
}