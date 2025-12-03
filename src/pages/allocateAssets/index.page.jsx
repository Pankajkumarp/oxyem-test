
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification.jsx';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import FillterForm from '../Components/Popup/FillterForm';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function allocateAssets({ payrollForm }) {
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    const router = useRouter();
    const data = router.query.data;
    const [storeArray, setStoreArray] = useState(payrollForm);
    const [AdduserContent, setAdduserContent] = useState(payrollForm);

    const filterSectionsBasedOnAssetType = (content, assetType) => {

        // Ensure 'content' and 'content.section' are arrays
        if (!content || !Array.isArray(content.section)) {
            return content; // Return the original content if it's not in the expected format
        }

        return content.section.map(section => {
            if (section.SectionName === "Assets Information") {
                // Ensure section.Subsection is an array
                if (!Array.isArray(section.Subsection)) {
                    section.Subsection = []; // Initialize to an empty array or handle the error as needed
                }

                // Update subsections based on the asset type
                section.Subsection = section.Subsection.map(subsection => {
                    let shouldBeVisible = true;

                    if (assetType === "Laptop") {
                        if (subsection.name === "printerConfig" || subsection.name === "otherConfig") {
                            shouldBeVisible = false;
                        }
                    } else if (assetType === "Printer") {
                        if (subsection.name === "assetConfigLaptop" || subsection.name === "otherConfig") {
                            shouldBeVisible = false;
                        }
                    } else if (assetType === "Others") {
                        if (subsection.name === "printerConfig" || subsection.name === "assetConfigLaptop") {
                            shouldBeVisible = false;
                        }
                    } else if (assetType !== "Laptop" || assetType !== "Printer" || assetType !== "Others") {
                        if (subsection.name === "assetConfigLaptop" || subsection.name === "printerConfig" || subsection.name === "otherConfig") {
                            shouldBeVisible = false;
                        }
                    }


                    // Set the attribute based on visibility
                    return {
                        ...subsection,
                        isFieldVisiblef: shouldBeVisible
                    };
                });
            }
            return section;
        });
    };
    const filterSectionsWarrantyType = (content, assetType) => {

        // Ensure 'content' and 'content.section' are arrays
        if (!content || !Array.isArray(content.section)) {
            return content; // Return the original content if it's not in the expected format
        }

        return content.section.map(section => {
            if (section.SectionName === "Warranty Information") {
                // Ensure section.Subsection is an array
                if (!Array.isArray(section.Subsection)) {
                    section.Subsection = []; // Initialize to an empty array or handle the error as needed
                }

                // Update subsections based on the asset type
                section.Subsection = section.Subsection.map(subsection => {
                    let shouldBeVisible = true;

                    if (assetType === false) {
                        if (subsection.name === "extendedWarrantyInfo") {
                            shouldBeVisible = false;
                        }
                    } else if (assetType === true) {
                        if (subsection.name === "extendedWarrantyInfo") {
                            shouldBeVisible = true;
                        }
                    }


                    // Set the attribute based on visibility
                    return {
                        ...subsection,
                        isFieldVisiblef: shouldBeVisible
                    };
                });
            }
            return section;
        });
    };



    const getChangessField = async (value) => {
        const type = value[0].fields[1].value.label
        const Warranty = value[0].SubsectionName
        if (type !== undefined) {
            const filteredContent = filterSectionsBasedOnAssetType(storeArray, type);

            const changeV = {
                "formType": "createAssets",
                "section": filteredContent
            }
            setAdduserContent(changeV)
        }
        if (Warranty === "Warranty Information") {
            const Warrantyinfo = value[0].fields[3].value
            const filteredContent = filterSectionsWarrantyType(AdduserContent, Warrantyinfo);
            const changeV = {
                "formType": "createAssets",
                "section": filteredContent
            }
            setAdduserContent(changeV)
        }

    };
    const getsubmitformdata = async (value) => {
        try {
            if (value) {

                

                const filteredValue = {
                    ...value,
                    section: value.section.filter(section => section.SectionName !== 'Preview' && section.SectionName !== 'Documents')
                };

                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/allocation';
                

                const response = await axiosJWT.post(apiUrl, filteredValue);

                if (response.status === 200) {

                    ToastNotification({ message: response.data.message });

                    router.push(`/allocationManagement`);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                
                ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            } else {
                ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            }
        }
    };

    const [isModalOpenRe, setIsModalOpenRe] = useState(false);
    const handleFillterChanges = async () => {
        setIsModalOpenRe(true)
    }
    const closeDetailpopupRe = async () => {
        setIsModalOpenRe(false)
    }


    const updateForm = (data) => {
        // Destructure the assetList and typeOfAsset from data
        const { assetList, typeOfAsset } = data;
        
        // Clone the current AdduserContent to avoid direct state mutation
        const updatedContent = { ...AdduserContent };
        
        // Loop through sections to find and update the relevant fields
        updatedContent.section = updatedContent.section.map(section => {
            if (section.SectionName === "Allocation Information") {
                section.Subsection = section.Subsection.map(subsection => {
                    subsection.fields = subsection.fields.map(field => {
                        if (field.name === "idAsset") {
                            field.value = assetList;
                        } 
                        if (field.name === "typeOfAsset") {
                            field.value = typeOfAsset;
                        }
                        return field;
                    });
                    return subsection;
                });
            }
            return section;
        });
        
        setAdduserContent(updatedContent);
    };

    
    return (
        <>
            <Head><title>{pageTitles.AllocateAsset}</title></Head>
            <FillterForm isOpen={isModalOpenRe} closeModal={closeDetailpopupRe} updateForm={updateForm}/>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <Breadcrumbs maintext={"Allocate Asset"} />
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="oxyem-allocate-Assets">
                                                        <div className="text-end w-100 allowcation-filter-btn">
                                                            <button className='btn btn-primary' onClick={handleFillterChanges}>Adavanced Filter Asset</button>
                                                        </div>
                                                        <SecTab
                                                            AdduserContent={AdduserContent}
                                                            getsubmitformdata={getsubmitformdata}
                                                            getChangessField={getChangessField}
                                                            pagename={"allocateAsset"}
                                                        />
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
    const payrollForm = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'allocateAssets' }, context);
    return {
        props: { payrollForm },
    }
}

