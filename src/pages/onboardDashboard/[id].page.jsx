import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import { Toaster } from 'react-hot-toast';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { axiosJWT } from '../Auth/AddAuthorization';
import { fetchWithToken } from '../Auth/fetchWithToken';

export default function onboardingProcess({ onboardForm }) {
    const router = useRouter();
    const [AdduserContent, setAdduserContent] = useState(onboardForm);
    const [applicantDetails, setApplicantDetails] = useState({});
    const [applicantid, setApplicantid] = useState(null);

    useEffect(() => {
        if (router.query.id) {
            setApplicantid(router.query.id);
            fetchApplicantDetails(router.query.id);
            fetchOnboardDetails(router.query.id);
        }
    }, [router.query.id]);

    const fetchApplicantDetails = async (id) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/jobs/applicantDetails`, {
                params: { idApplicant: id },
            });
            if (response && response.data) {
                setApplicantDetails(response.data.data);
            }
        } catch (error) {
            
        }
    };

    const fetchOnboardDetails = async (id) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/jobs/onboardDetails`, {
                params: { idApplicant: id },
            });
            if (response && response.data) {
                const onboardDetails = response.data.data[0];
                
                updateFormValuesWithDetails(onboardDetails);
            }
        } catch (error) {
            
        }
    };

    const updateFormValuesWithDetails = (details) => {
        const completeSections = details?.completeSections || '';
        const status = details?.status || '';
        const updatedForm = { ...AdduserContent, completeSections, status };
        const completedIndex = updatedForm.section.findIndex(sec => sec.SectionName === completeSections);
    
        updatedForm.section.forEach((section, index) => {
            const matchedSection = details.section.find((sec) => sec.SectionName === section.SectionName);
            if (matchedSection) {
                section.Subsection.forEach((subsection) => {
                    subsection.fields.forEach((field) => {
                        const matchedField = matchedSection.fields.find((f) => f.name === field.name);
                        if (matchedField) {
                            field.value = matchedField.attributeValue || '';
                            field.isDisabled = (status === 'rejected' || index <= completedIndex);
                        }
                    });
                });
                section.buttons = section.buttons.map(button => ({
                    ...button,
                    isVisible: (status !== 'rejected' && index > completedIndex), // Hide buttons if status is 'rejected'
                }));
            }
        });
    
        setAdduserContent(updatedForm);
    };

    const getsubmitformdata = async (formData, status ,completeSections) => {
        const transformedData = { ...formData, status,completeSections};
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/jobs/onboardingProcess`, transformedData);
            if (response) {
                router.push('/onboardDashboard');
            }
        } catch (error) {
            
        }
    };
    const cancelClickAction = () => {
        router.push(`/onboardDashboard`);
    };

    return (
        <div className="main-wrapper">
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="row">
                        <div className="col-12 col-lg-12 col-xl-12">
                            <Breadcrumbs maintext="Onboarding Process" />
                            <div className="row">
                                <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                    <div className="card flex-fill comman-shadow oxyem-index">
                                        <div className="center-part">
                                            <div className="card-body oxyem-mobile-card-body">
                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="o-onborad-process-page">
                                                    <SecTab
                                                        AdduserContent={AdduserContent}
                                                        getsubmitformdata={getsubmitformdata}
                                                        pagename="onprocessBoarding"
                                                        applicantDetails={applicantDetails}
                                                        applicantid={applicantid}
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
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
}

export async function getServerSideProps(context) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const onboardForm = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'onboardingProcess' }, context);
    return { props: { onboardForm } };
}