
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { Toaster } from 'react-hot-toast';

import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function newJobpost({ payrollForm }) {
    const router = useRouter();
    const [AdduserContent, setAdduserContent] = useState(payrollForm);

    useEffect(() => {
        if (router.query.id) {
            fetchJobDetails(router.query.id);
        }
    }, [router.query.id]);
    
    const fetchJobDetails = async (isviewId) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/jobs/vacancyDetails`, {
                params: { idJob: isviewId },
            });
            if (response && response.data && response.data.data.length > 0) {
                const fetchedJobData = response.data.data[0];
                updateFormValues(fetchedJobData);
            }
        } catch (error) {
        }
    };
    
    const updateFormValues = (jobDetails) => {
        const updatedForm = { ...AdduserContent }; // Copy the current form
        updatedForm.section = updatedForm.section.map((section) => {
            section.Subsection = section.Subsection.map((subsection) => {
                subsection.fields = subsection.fields.map((field) => {
                    if (jobDetails.hasOwnProperty(field.name)) {
                        return {
                            ...field,
                            value: jobDetails[field.name], // Set value if matched
                        };
                    }
                    return field;
                });
                return subsection;
            });
            return section;
        });
    
        setAdduserContent(updatedForm); // Update the state
    };
    
    
    const transformFormData = (data) => {
        const { id } = router.query;
        const transformedData = { idJob: id || "" };
        data.section.forEach(section => {
            section.fields.forEach(field => {
                if (field.name !== "employeeName") {
                    transformedData[field.name] = field.attributeValue;
                }
            });
        });
        return transformedData;
    };
    const getsubmitformdata = async (value) => {
        const transformedData = transformFormData(value);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.post(`${apiUrl}/jobs/managejobs`, transformedData);
                if (response) {
                    router.push('/manageJob');
                }
            } catch (error) {  
            }
        };

        const cancelClickAction = () => {
            router.push(`/manageJob`);
        };


    return (
        <>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <Breadcrumbs maintext={"Edit Job"} />
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

                                                        <SecTab
                                                            AdduserContent={AdduserContent}
                                                            getsubmitformdata={getsubmitformdata}
                                                            cancelClickAction={cancelClickAction}
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
    const payrollForm = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'newJobpost' }, context);
    
    return {
        props: { payrollForm },
    }
}

