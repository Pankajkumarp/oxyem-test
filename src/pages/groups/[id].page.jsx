import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import EmployeeSection from '../create-group/inner';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import axios from 'axios';

export default function index({userFormdata ,errorMessage, previousUrl}) { 
    const router = useRouter();
    const [details, setClaimDetails] = useState([]);
    const [cid, setCId] = useState('');
    const headingContent = 'Edit Group';
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/permission/addGroup';

    useEffect(() => {
          if (errorMessage && previousUrl) {
              router.push(previousUrl);
            }
      }, [errorMessage, router ,previousUrl]);
      
    useEffect(() => {
          const { id } = router.query;
          fetchInfo(id);
          setCId(id)
      }, [router.query.id]);

      

    const fetchInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/permission/viewGroupDetails`, { params: { idGroup: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    setClaimDetails(fetchedData);
                }
            }
        } catch (error) { 
            
        }
    };

    const initialContent = userFormdata
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        if (details && Object.keys(details).length !== 0 && content) {
            const { groupName, assignedPermissions, unAssignedPermissions ,unAssignedUsers ,assignedUsers ,assignedRoles ,unAssignedRoles} = details; // Destructure details
            const updatedFormData = { ...content };
            const section = updatedFormData.section.find(sec => sec.name === "assignedPermissionsSection");
            const section2 = updatedFormData.section.find(sec => sec.name === "assignedRolesSection");
            const section3 = updatedFormData.section.find(sec => sec.name === "assignedUsersSection");

            if (section) {
                const subsection = section.Subsection.find(sub => sub.SubsectionName === "Assign Permissions");

                if (subsection) {
                    const groupNameField = subsection.fields.find(field => field.name === "groupName");
                    const assignedPermissionsField = subsection.fields.find(field => field.name === "assignedPermissions");

                    if (groupNameField) {
                        groupNameField.value = groupName; // Set the group name
                    }

                    if (assignedPermissionsField) {
                        // Set assigned permissions if available
                        if (Array.isArray(assignedPermissions)) {
                            assignedPermissionsField.value = assignedPermissions.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedPermissionsField.value = []; // Set to an empty array if no permissions are available
                        }

                        // Set available options for unassigned permissions
                        if (Array.isArray(unAssignedPermissions)) {
                            assignedPermissionsField.availableOption = unAssignedPermissions.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedPermissionsField.availableOption = []; // Set to an empty array if no permissions are available
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
                    const assignedPermissionsField = subsection3.fields.find(field => field.name === "assignedUsers");

                    if (assignedPermissionsField) {
                        // Set assigned permissions if available
                        if (Array.isArray(assignedUsers)) {
                            assignedPermissionsField.value = assignedUsers.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedPermissionsField.value = []; // Set to an empty array if no permissions are available
                        }

                        // Set available options for unassigned permissions
                        if (Array.isArray(unAssignedUsers)) {
                            assignedPermissionsField.availableOption = unAssignedUsers.map(permission => ({
                                id: permission.id,
                                name: permission.name
                            }));
                        } else {
                            
                            assignedPermissionsField.availableOption = []; // Set to an empty array if no permissions are available
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
    
        formattedData.idGroup = cid;
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
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.errors || [];
                ToastNotification({ message: errors });
                console.log(errors);
            }
        }
    };
    

  return (
        <>
        {content && (
        <div>
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
        </div>
        )}
        </>
    )}

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