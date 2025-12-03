
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import { Toaster } from 'react-hot-toast';

import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
export default function onboardingProcess({ payrollForm }) {
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    const router = useRouter();
    const data = router.query.data;
    const [storeArray, setStoreArray] = useState(payrollForm);
    const [AdduserContent, setAdduserContent] = useState(payrollForm);
    const filterSectionsBasedOnAssetType = (content, assetType) => {

        // Ensure 'content' and 'content.section' are arrays
        if (!content || !Array.isArray(content.section)) {
            console.error("Expected content.section to be an array, but got:", content);
            return content; // Return the original content if it's not in the expected format
        }

        return content.section.map(section => {
            if (section.SectionName === "Assets Information") {
                // Ensure section.Subsection is an array
                if (!Array.isArray(section.Subsection)) {
                    console.error("Expected section.Subsection to be an array, but got:", section.Subsection);
                    section.Subsection = []; // Initialize to an empty array or handle the error as needed
                }

                // Update subsections based on the asset type
                section.Subsection = section.Subsection.map(subsection => {
                    let shouldBeVisible = true;

                    if (assetType === "Laptop" || assetType === "Desktop") {
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
                    } else if (assetType !== "Laptop" || assetType !== "Desktop"  || assetType !== "Printer" || assetType !== "Others") {
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
            console.error("Expected content.section to be an array, but got:", content);
            return content; // Return the original content if it's not in the expected format
        }

        return content.section.map(section => {
            if (section.SectionName === "Warranty Information") {
                // Ensure section.Subsection is an array
                if (!Array.isArray(section.Subsection)) {
                    console.error("Expected section.Subsection to be an array, but got:", section.Subsection);
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
        const type = value[0].fields[1].value.value
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
        console.log("kfkf", value)
    };


    return (
        <>


            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <Breadcrumbs maintext={"Add Assets"} />
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="o-onborad-process-page">

                                                        <SecTab
                                                            AdduserContent={AdduserContent}
                                                            getsubmitformdata={getsubmitformdata}
                                                            getChangessField={getChangessField}
                                                            pagename={"onprocessBoarding"}
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

            <Toaster
                position="top-right"
                reverseOrder={false}

            />
        </>

    );
}
export async function getServerSideProps(context) {

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await axios.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "onboardingProcess" } })

    let payrollForm = response ? response.data.data : []
    return {
        props: { payrollForm },
    }
}

