import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import EmployeeSection from './inner';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles';
import axios from 'axios';
export default function User({ userFormdata ,errorMessage ,previousUrl}) {

    const router = useRouter();
        useEffect(() => {
            if (errorMessage && previousUrl) {
              router.push(previousUrl);
            }
          }, [errorMessage, router ,previousUrl]);
    const headingContent = 'Create Group';
    const AdduserContent = userFormdata
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/permission/addGroup';
    const [ErrorMsg, setErrorMsg] = useState('');

    const [SubmitButtonloader, setSubmitButtonloader] = useState(false);
    const completehandleSubmit = async (value) => {
        setSubmitButtonloader(true);
        const formattedData = {};
        const missingFields = [];
        value.section.forEach(section => {
            section.fields.forEach(field => {
                if (field.name === "groupName" && field.attributeValue) {
                    formattedData.groupName = field.attributeValue;
                } else if (field.name === "assignedRoles") {
                    formattedData.assignedRoles = field.attributeValue.length > 0
                        ? field.attributeValue.map(role => role.id)
                        : ""; // Set to empty string if length is 0
                } else if (field.name === "assignedPermissions" && field.attributeValue.length > 0) {
                    formattedData.assignedPermissions = field.attributeValue.map(permission => permission.id);
                } else if (field.name === "assignedUsers") {
                    formattedData.assignedUsers = field.attributeValue.length > 0
                        ? field.attributeValue.map(user => user.id)
                        : ""; // Set to empty string if length is 0
                }
            });
        });
    
        // Validation check: Ensure no required values are empty
        if (!formattedData.groupName) missingFields.push("Group Name");
        if (!formattedData.assignedPermissions) missingFields.push("Assigned Permissions");
    
        if (missingFields.length > 0) {
            ToastNotification({
                message: `<span style="color: red;">The following fields are required:<br/>${missingFields.join("<br/>")}.</span>`
            });
            return;
        }
    
        try {
            const response = await axiosJWT.post(apiUrl, formattedData);
            if (response.status === 200) {
                ToastNotification({ message: response.data.message });
                router.push(`/groups`);
                setSubmitButtonloader(false);
            }
        } catch (error) {
            setSubmitButtonloader(false);
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.errors || [];
                ToastNotification({ message: errors });
                console.log(errors);
            }
        }
    };
    
    
    return (
        <>
        {userFormdata ? (
    <div>
           
        <Head>
        <title>{pageTitles.PermissionManagementAddGroup}</title>
        <meta name="description" content={pageTitles.PermissionManagementAddGroup} />
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
                                                        <p className='text-danger'>{ErrorMsg}</p>
                                                       
                                                        <EmployeeSection AdduserContent={AdduserContent} headingContent={headingContent} apiUrl={apiUrl} getsubmitformdatapreview={completehandleSubmit} loaderSubmitButton={SubmitButtonloader}/>
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
        params: { formType: 'createGroup' },
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
