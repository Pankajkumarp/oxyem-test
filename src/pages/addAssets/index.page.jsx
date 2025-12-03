
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/AssetTab.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function addAssets({ payrollForm }) {
    const router = useRouter();
    const [AdduserContent, setAdduserContent] = useState(payrollForm);
    
    const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const getsubmitformdata = async (value ,myFile) => {
        setSubmitButtonLoading(true);
        try {
            if (value) {
                // Extract the relevant dates for validation
                let purchaseDate, startDateWarranty, startDateExtendWarranty;
    
                value.section.forEach(section => {
                    section.fields.forEach(field => {
                        if (field.name === 'purchaseDate') {
                            purchaseDate = new Date(field.attributeValue);
                        }
                        if (field.name === 'startDateWarranty') {
                            startDateWarranty = new Date(field.attributeValue);
                        }
                        if (field.name === 'startDateExtendWarranty') {
                            startDateExtendWarranty = new Date(field.attributeValue);
                        }
                    });
                });
    
                // Validate the dates
                if (purchaseDate) {
                    if (startDateWarranty && startDateWarranty < purchaseDate) {
                        // Show validation error for startDateWarranty
                        ToastNotification({ message: 'Warranty start date cannot be before the purchase date.' });
                        return;
                    }
    
                    if (startDateExtendWarranty && startDateExtendWarranty < purchaseDate) {
                        // Show validation error for startDateExtendWarranty
                        ToastNotification({ message: 'Extended warranty start date cannot be before the purchase date' });
                        return;
                    }
                }
    
                // Proceed with form submission if validation passes
                const formData = new FormData();
    
                const filteredValue = {
                    ...value,
                    section: value.section.filter(section => section.SectionName !== 'Preview' && section.SectionName !== 'Documents')
                };
    
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/add';
                formData.append('formData', JSON.stringify(filteredValue));

                

                
                if (Array.isArray(myFile)) {
                    myFile.forEach((file) => {
                      formData.append('file', file);
                    });
                  } else {
                    console.error('fileData is not an array:', fileData);
                  }
    
                const response = await axiosJWT.post(apiUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                if (response.status === 200) {
                    ToastNotification({ message: response.data.message });
                    router.push(`/assetManagement`);
                    setSubmitButtonLoading(false);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.errors || [];
                const errorMessage = errors.map(err => err.msg).join('.</br>') || 'Failed to submit the form. Please try again later.';
                
                ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            } else {
                // ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            }
            setSubmitButtonLoading(false);
        }
    };
    

    const getChangessField2 = () => {}

    return (
        <>
            <Head><title>{pageTitles.AddAsset}</title></Head>
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
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

                                                        <SecTab
                                                            AdduserContent={AdduserContent}
                                                            getsubmitformdatahitApi={getsubmitformdata}
                                                            getChangessField={getChangessField2}
                                                            pagename={"addAsset"}
                                                            loaderSubmitButton={SubmitButtonLoading}
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
    const payrollForm = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'createAssets' }, context);
    return {
        props: { payrollForm },
    }
}

