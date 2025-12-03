import React, { useState, useEffect } from 'react';
import SecTab from '../Components/Employee/SecTab';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router'
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function Projectallocation({ userFormdata }) {
    const router = useRouter();

    const headingContent = '';
    const [btpdata, setBtpData] = useState([]); // State to hold the content
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [getID, setGetID] = useState("")

    const [AdduserContent, setAdduserContent] = useState(userFormdata);
    const [apiResponse, setapiResponse] = useState();
    const [btpstpvalue, setBtpStpvalue] = useState({});


    const getProjectValue = async (id) => {
        try {

            const response = await axiosJWT.get(`${apiUrl}/project/getProject`, {
                params: {
                    'idProject': id
                }
            });
            if (response) {
                const apiResponse = response.data.data
                const extractedData = apiResponse.section.reduce((result, section) => {
                    section.fields.forEach(field => {
                        if (field.name === "BTP" || field.name === "STP") {
                            result[field.name] = field.attributeValue;
                        }
                    });
                    return result;
                }, {});
                setBtpStpvalue(extractedData)
                const mergedArray = mergeData(userFormdata, apiResponse);
                const summarySection = mergedArray.section.find(section => section.SectionName === "Summary");
                if (summarySection) {
                    // Update the value inside the Summary section
                    summarySection.Subsection.forEach(subsection => {
                        if (subsection.name === "summary") {
                            subsection.value = response.data.data.priceSummary; // Set the value to true
                        }
                    });
                }
                setAdduserContent(mergedArray)
                setapiResponse(apiResponse);
            }

        } catch (error) {

        }
    }
    useEffect(() => {
        const { id } = router.query; // Extract the "id" parameter from the query object
        setGetID(id)
        getProjectValue(id)

    }, [router.query.id]);

    const handlesubmitApiData = async (value) => {
        const sendData = mergeSections(value.section, btpdata);
        const apipayload = {
            "feature": value.feature,
            "idProject": getID,
            "section": sendData
        }
        try {
            const response = await axiosJWT.put(`${apiUrl}/project`, apipayload);
            if (response) {
                const message = 'You have successfully Edit Project!';
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
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };

    const handleBTPformvalue = (value) => {
        const newSections = value.section;
        setBtpData(newSections)

    };


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


    const converttoenable = async () => {
        try {

            const response = await axiosJWT.get(`${apiUrl}/project/getProject`, {
                params: {
                    'idProject': getID
                }
            });
            if (response) {
                const apiResponse = response.data.data
                const mergedArray = mergeDataen(userFormdata, apiResponse);
                const summarySection = mergedArray.section.find(section => section.SectionName === "Summary");
                if (summarySection) {
                    // Update the value inside the Summary section
                    summarySection.Subsection.forEach(subsection => {
                        if (subsection.name === "summary") {
                            subsection.value = response.data.data.priceSummary; // Set the value to true
                        }
                    });
                }
                setAdduserContent(mergedArray)
                setapiResponse(apiResponse);
            }

        } catch (error) {

        }
    }

    const [showButton, setShowButton] = useState("")
    // Function to merge data
    function mergeData(formArray, dataArray) {
        // Iterate over each section in the dataArray
        dataArray.section.forEach(dataSection => {
            // Iterate over each field in the section
            dataSection.fields.forEach(dataField => {
                // Find the corresponding section and field in the formArray
                formArray.section.forEach(formSection => {
                    formSection.Subsection.forEach(subSection => {
                        subSection.fields.forEach(formField => {
                            if (formField.name === dataField.name) {
                                formField.value = dataField.attributeValue;

                            }
                            if (formField.name === "projectCode") {
                                formField.isDisabled = true;
                            }
                            if (formField.name === "startDate") {
                                formField.isDisabled = true;
                            }
                        });
                    });
                });
            });
        });
        setShowButton("")
        return formArray;
    }

    // Merge the data



    // Function to merge data
    function mergeDataen(formArray, dataArray) {
        // Iterate over each section in the dataArray
        dataArray.section.forEach(dataSection => {
            // Iterate over each field in the section
            dataSection.fields.forEach(dataField => {
                // Find the corresponding section and field in the formArray
                formArray.section.forEach(formSection => {
                    formSection.Subsection.forEach(subSection => {
                        subSection.fields.forEach(formField => {
                            if (formField.name === dataField.name) {
                                formField.value = dataField.attributeValue;

                            }
                        });
                    });
                });
            });
        });
        formArray.section.forEach(formSection => {
            formSection.Subsection.forEach(subSection => {
                subSection.fields.forEach(formField => {
                    formField.isDisabled = ""; // Set isDisabled to false for each field
                });
            });
        });

        setShowButton("")
        return formArray;
    }

    return (
        <>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Project Allocation"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <SecTab AdduserContent={AdduserContent} headingContent={headingContent} handlesubmitApiData={handlesubmitApiData} actionid={getID} handleBTPformvalue={handleBTPformvalue} pagename="edit_allowcation" showButton={showButton} converttoenable={converttoenable} btpstpvalue={btpstpvalue}/>
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
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'Project_allocation' }, context);
    
    return {
        props: { userFormdata },
    }
}
