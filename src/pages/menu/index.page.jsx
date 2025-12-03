import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import EmployeeSection from './inner';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { fetchWithToken } from '../Auth/fetchWithToken';

export default function User({ userFormdata }) {

    const headingContent = 'Add Menu';
    const router = useRouter();
    const AdduserContent = userFormdata
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/permission/assignMenu';
    const [ErrorMsg, setErrorMsg] = useState('');

    const completehandleSubmit = async (value) => {
        const formattedData = {};
        const missingFields = [];
        value.section.forEach(section => {
            section.fields.forEach(field => {
                if (field.name === "assignedRoles") {
                    formattedData.assignedRoles = field.attributeValue.length > 0
                        ? field.attributeValue.map(role => role.id)
                        : ""; // Set to empty string if length is 0
                } else if (field.name === "assignedMenuIds" && field.attributeValue.length > 0) {
                    formattedData.assignedMenuIds = field.attributeValue.map(permission => permission.id);
                } else if (field.name === "assignedUsers") {
                    formattedData.assignedUsers = field.attributeValue.length > 0
                        ? field.attributeValue.map(user => user.id)
                        : ""; // Set to empty string if length is 0
                }
            });
        });
    
        // Validation check: Ensure no required values are empty
        if (!formattedData.assignedMenuIds) missingFields.push("Menu");
    
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
                router.push(`/menu-list`);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.errors || [];
                ToastNotification({ message: errors });
                
            }
        }
    };
    
    
    return (
        <>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12 mt-3">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <p className='text-danger'>{ErrorMsg}</p>
                                                       
                                                        <EmployeeSection AdduserContent={AdduserContent} headingContent={headingContent} apiUrl={apiUrl} getsubmitformdatapreview={completehandleSubmit} />
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
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'createMenu' }, context);
	return {
	  props: { userFormdata  },
	}
  }