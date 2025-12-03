import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import EmployeeSection from '../create-group/inner';

import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { fetchWithToken } from '../Auth/fetchWithToken';



export default function index({userFormdata}) {
    const router = useRouter();
    const [details, setClaimDetails] = useState([]);
    const [cid, setCId] = useState('');
    const headingContent = 'Edit Menu';
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/permission/assignMenu';
    
    useEffect(() => {
        const { id, editfor } = router.query;
        if (id) {
            fetchInfo(id, editfor);
            setCId(id);
        }
    }, [router.query.id]);
    
    
    

      

    const fetchInfo = async (id ,editfor) => {
        try {
            if (id) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                // https://www.api.oxyem.io/permission/viewAssignedMenuDetails?id=01871f37-736b-4487-ae61-d1cc1335dbee&isFor=role
                const response = await axiosJWT.get(`${apiUrl}/permission/viewAssignedMenuDetails`, { params: { id: id , isFor:editfor} });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data.menu;
                    setClaimDetails(fetchedData);
                }
            }
        } catch (error) { 
            
        }
    };



    const initialContent = userFormdata
    const [content, setContent] = useState(initialContent);

    

    useEffect(() => {
        if (details && Object.keys(details).length !== 0) {
            const { assignedMenuIds, unassignedMenuIds ,unAssignedUsers ,assignedUsers ,assignedRoles ,unAssignedRoles} = details; // Destructure details
            const updatedFormData = { ...content };
            const section = updatedFormData.section.find(sec => sec.name === "assignedMenuSection");
            const section2 = updatedFormData.section.find(sec => sec.name === "assignedRolesSection");
            const section3 = updatedFormData.section.find(sec => sec.name === "assignedUsersSection");

            
            if (section) {
                const subsection = section.Subsection.find(sub => sub.SubsectionName === "Assign Menu");

                
                if (subsection) {
                    const assignedMenuField = subsection.fields.find(field => field.name === "assignedMenuIds");

                    if (assignedMenuField) {
                        // Set assigned permissions if available
                        if (Array.isArray(assignedMenuIds)) {
                            assignedMenuField.value = assignedMenuIds.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedMenuField.value = []; // Set to an empty array if no permissions are available
                        }

                        // Set available options for unassigned permissions
                        if (Array.isArray(unassignedMenuIds)) {
                            assignedMenuField.availableOption = unassignedMenuIds.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedMenuField.availableOption = []; // Set to an empty array if no permissions are available
                        }
                    } else {
                        
                    }
                }
            }


            // section 2

            if (section2) {
                const subsection2 = section2.Subsection.find(sub => sub.SubsectionName === "Assign Roles");

                if (subsection2) {
                    const assignedRolesField = subsection2.fields.find(field => field.name === "assignedRoles");

                    
                    if (assignedRolesField) {
                        // Set assigned permissions if available
                        if (Array.isArray(assignedRoles)) {
                            assignedRolesField.value = assignedRoles.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedRolesField.value = []; // Set to an empty array if no permissions are available
                        }

                        // Set available options for unassigned permissions
                        if (Array.isArray(unAssignedRoles)) {
                            assignedRolesField.availableOption = unAssignedRoles.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedRolesField.availableOption = []; // Set to an empty array if no permissions are available
                        }
                    } else {
                        
                    }
                }
            }

            // Section 3

            if (section3) {
                const subsection3 = section3.Subsection.find(sub => sub.SubsectionName === "Assign Users");

                if (subsection3) {
                    const assignedMenuField = subsection3.fields.find(field => field.name === "assignedUsers");

                    if (assignedMenuField) {
                        // Set assigned permissions if available
                        if (Array.isArray(assignedUsers)) {
                            assignedMenuField.value = assignedUsers.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedMenuField.value = []; // Set to an empty array if no permissions are available
                        }

                        // Set available options for unassigned permissions
                        if (Array.isArray(unAssignedUsers)) {
                            assignedMenuField.availableOption = unAssignedUsers.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedMenuField.availableOption = []; // Set to an empty array if no permissions are available
                        }
                    } else {
                        
                    }
                }
            }

            // End sections

            setContent(updatedFormData); // Update the state with the modified form data
        }
    }, [details]); // Effect runs whenever 'details' changes

    
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
    
        formattedData.idGroup = cid;
        // Validation check: Ensure no required values are empty
        if (!formattedData.assignedMenuIds) missingFields.push("Assigned Menu");
    
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
                        <div className="row mt-3">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        
                                                        <EmployeeSection AdduserContent={content} headingContent={headingContent} apiUrl={apiUrl} getsubmitformdatapreview={completehandleSubmit} editgroup={true} editdata={details}/>
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
    )}

export async function getServerSideProps(context) {	
 
	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'createMenu' }, context);
	return {
	  props: { userFormdata  },
	}
  }