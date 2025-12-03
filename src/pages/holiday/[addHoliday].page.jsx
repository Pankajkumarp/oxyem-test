import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import SecTab from '../Components/Employee/SecTab';
import axios from "axios";
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification.jsx';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
export default function Holiday({ leaveFormdata, errorMessage, previousUrl }) {
  const router = useRouter();
  useEffect(() => {
      if (errorMessage && previousUrl) {
          router.push(previousUrl);
        }
  }, [errorMessage, router ,previousUrl]);
  const [AdduserContent, setAdduserContent] = useState(leaveFormdata);
const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
  const getsubmitformdata = async (value) => {
    setSubmitButtonLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
        const response = await axiosJWT.post(`${apiUrl}/holiday`, value)
        if (response.status === 200) {
          router.push(`/holiday`);
          setSubmitButtonLoading(false);
          ToastNotification({ message: response.data.message });
      }
    } catch (error) { 
      setSubmitButtonLoading(false);
    }
  };

  return (
    <>
    <Head><title>{pageTitles.AddHoliday}</title></Head>
    {AdduserContent && (
      <div>
      <div className="main-wrapper" id="holiday_page">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs maintext={"Add Holidays"} />
                  </div>
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                          <SecTab AdduserContent={AdduserContent}   getsubmitformdata={getsubmitformdata} loaderSubmitButton={SubmitButtonLoading}/>
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
    )}
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie || '';
  const accessToken = cookies.split(';').find(cookie => cookie.trim().startsWith('accessToken='))?.split('=')[1] || null;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const previousUrl = context.req.headers.referer || '/';
  let leaveFormdata = null;
  let errorMessage = null;

  try {
    const response = await axios.get(`${apiUrl}/getDynamicForm`, {
      params: { formType: 'addHoliday' },
      headers: {
        Authorization: accessToken,
      },
    });

    if (response.data?.errorMessage) {
      errorMessage = response.data.errorMessage;
    } else {
      leaveFormdata = response.data.data;
    }
  } catch (error) {
    
  }

  return {
    props: { leaveFormdata: leaveFormdata || null, errorMessage ,previousUrl },
  };
}
