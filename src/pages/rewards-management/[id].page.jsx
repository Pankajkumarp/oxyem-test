import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import { Toaster } from 'react-hot-toast';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { axiosJWT } from '../Auth/AddAuthorization';
import Preview from './Preview';
import RealTimePreview from './RealTimePreview';
import { fetchWithToken } from '../Auth/fetchWithToken';

export default function onboardingProcess({ onboardForm }) {
    const router = useRouter();
    const [AdduserContent, setAdduserContent] = useState(onboardForm);
    
    const [id, setId] = useState(null);
    const [title, setTitle] = useState("");
    const [path, setPath] = useState("");
    
    const [isOpen, setIsOpen] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const [showButton, setShowButton] = useState(false);
    const [loaderSubmitButton, setLoaderSubmitButton] = useState(false);
    const [empName, setEmpName] = useState("");
    const [description, setDescription] = useState("");
    const [nominationType, setNominationType] = useState("");

    

    useEffect(() => {
        if (!router.isReady) return; // Wait until the router is ready

        if (router.query.id) {
            setId(router.query.id);
        }
        if (router.query.title){
             setTitle(router.query.title); 
        }
        if (router.query.path){
            setPath(router.query.path);  
        } 
        if (router.query.nominationType) {
            setNominationType(router.query.nominationType);            
        }
        if (!router.query.title && !router.query.path) {
            router.push('/rewards-management');
        }
    }, [router.isReady, router.query.id, router.query.title, router.query.path]);

const transformFormData = (data ,isFor) => {
    const transformedData = {};
    transformedData["id"] = id;
    transformedData["isFor"] = isFor;
    transformedData["nominationForTeam"] = nominationType === "team";
    
    data.section.forEach(section => {
        section.fields.forEach(field => {
            if (field.name !== "employeeName") {
                if (Array.isArray(field.attributeValue)) {
                    transformedData[field.name] = field.attributeValue.map(item => item.value);
                } else if (typeof field.attributeValue === "object" && field.attributeValue !== null) {
                    transformedData[field.name] = field.attributeValue.value ?? field.attributeValue;
                } else {
                    transformedData[field.name] = field.attributeValue;
                }
            }
        });
    });

    return transformedData;
};

    const getsubmitformdata = async (formData) => {
        setLoaderSubmitButton(true);
        var isFor = "submitReward"
        const transformedData = transformFormData(formData ,isFor);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/reward/generateCertificate`, transformedData);
            if (response) {
                router.push('/rewards');
                setLoaderSubmitButton(false);
            }
        } catch (error) {
            
        }
    };

    const cancelClickAction = () => {
        router.push(`/rewards`);
    };

    const handelClose = () => {
        setIsOpen(false);
    };


    const handelPreviewPdf = async (btn ,data) => {    
    if(btn === "PreviewPDF") {
        setShowButton(true);
        var isFor = "previewReward"
    const transformedData = transformFormData(data ,isFor);
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.post(`${apiUrl}/reward/generateCertificate`, transformedData, {
            responseType: "blob", 
        });

        if (response?.data) {
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setPdfData(url + "#toolbar=0&navpanes=0&scrollbar=0&zoom=100"); 
            setIsOpen(true);
            setShowButton(false);
        }
        
    } catch (error) {
    }
    }
    };

    const handleGetEmpDetail = async (formData) => {
        setEmpName(formData?.label);   
    }

    const handleDescriptionDetail = async (formData) => {
        setDescription(formData);   
    }

     useEffect(() => {
            const mainElement = document.querySelector('body');
            if (mainElement) {
                mainElement.setAttribute('id', 'reward-module');
            }
            return () => {
                if (mainElement) {
                    mainElement.removeAttribute('id');
                }
            };
        }, []);

    return (
        <>
        <Preview isOpen={isOpen} closeModal={handelClose} pdfData={pdfData}/>
        <div className="main-wrapper">
            <div className="page-wrapper" id='reward-dashboard'>
                <div className="content container-fluid">
                    <div className="row">
                        <div className="col-12 col-lg-12 col-xl-12">
                        <Breadcrumbs maintext={`Appreciation Award ${title ? `(${title})` : ''}`} />
                            <div className="row">
                                <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                    <div className="card flex-fill comman-shadow oxyem-index">
                                        <div className="center-part">
                                            <div className="card-body oxyem-mobile-card-body">
                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="o-onborad-process-page">
                                                    <SecTab
                                                        AdduserContent={AdduserContent}
                                                        getsubmitformdata={getsubmitformdata}
                                                        pagename={"addReward"}
                                                        getRewardData={nominationType === 'team' ?  "addReward" : ''}
                                                        cancelClickAction={cancelClickAction}
                                                        handelPreviewPdf={handelPreviewPdf}
                                                        showButton={showButton}
                                                        loaderSubmitButton={loaderSubmitButton}
                                                        handleGetEmpDetail={handleGetEmpDetail}
                                                        handleDescriptionDetail={handleDescriptionDetail}
                                                    />
                                                    <div className="form-group row">
                                                        <div className="col-sm-12">
                                                            <RealTimePreview path={path} empName={empName} description={description}/>
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
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const onboardForm = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'addReward' }, context);
    return { props: { onboardForm } };
}