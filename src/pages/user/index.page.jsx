import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import EmployeeSection from '../Components/Employee/EmployeeSection';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import axios from 'axios';

export default function User({ userFormdata ,errorMessage ,previousUrl}) {

    const router = useRouter();
    useEffect(() => {
        if (errorMessage && previousUrl) {
          router.push(previousUrl);
        }
      }, [errorMessage, router ,previousUrl]);

    const headingContent = 'Create Account';
    const AdduserContent = userFormdata
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/employees';
    const [empId, setEmpID] = useState('');
    const [ErrorMsg, setErrorMsg] = useState('');
const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const completehandleSubmit = async (value ,myfiles) => {
      setSubmitButtonLoading(true);
        try {
            if (value) {
                const filteredValue = {
                    ...value,
                    section: value.section.filter(section => section.SectionName !== 'Preview' && section.SectionName !== 'Documents')
                };

                const response = await axiosJWT.post(apiUrl, filteredValue);

                if (response.status === 200) {
                    const employeeId = response.data.employeeId; // Ensure this matches your API response structure
                    
                    setEmpID(employeeId);
                    ToastNotification({ message: response.data.message });
                    handeldocfiles(myfiles, employeeId);
                    router.push(`/admin/user-list`);
                    setSubmitButtonLoading(false);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.errors || [];
                const errorMessage = errors.map(err => err.msg).join('.</br>') || 'Failed to submit the form. Please try again later.';
//                   let errorMessage = 'Failed to submit the form. Please try again later.';

// if (error.response?.data) {
//   const { errors, message } = error.response.data;

//   if (Array.isArray(errors)) {
//     // case: [{ msg: "Error1" }, { msg: "Error2" }]
//     errorMessage = errors.map(err => err.msg || err).join('.</br>');
//   } else if (typeof errors === 'string') {
//     // case: "Single error string"
//     errorMessage = errors;
//   } else if (typeof message === 'string') {
//     // case: { message: "Something went wrong" }
//     errorMessage = message;
//   }
// }




                ToastNotification({ message: errorMessage });
                console.log(errorMessage);
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
    
            console.log('Documents uploaded successfully', response.data);
          }
        } catch (error) {
          console.error("Error occurred during API call:", error);
        }
      }

    return (
        <>

{userFormdata ? (
        <div>
        <Head><title>{pageTitles.CreateUser}</title></Head>
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
                                                        <p className='text-danger'>{ErrorMsg}</p>
                                                       
                                                        <EmployeeSection AdduserContent={AdduserContent} headingContent={headingContent} apiUrl={apiUrl} getsubmitformdatapreview={completehandleSubmit} handeldocfiles={handeldocfiles} loaderSubmitButton={SubmitButtonLoading}/>
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
    
  }

  return {
    props: { userFormdata: userFormdata || null, errorMessage ,previousUrl },
  };
}