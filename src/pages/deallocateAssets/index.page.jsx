
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { Toaster } from 'react-hot-toast';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function deallocateAssets({ payrollForm }) {
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    const router = useRouter();
    const data = router.query.data;
    const [AdduserContent, setAdduserContent] = useState(payrollForm);
    

    const getsubmitformdata = async (value) => {
        try {
            if (value) {
                const formData = new FormData();
                const filteredValue = {
                    ...value,
                    section: value.section.filter(section => section.SectionName !== 'Preview' && section.SectionName !== 'Documents')
                };
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/deallocateAsset';
                
                formData.append('formData', JSON.stringify(filteredValue));
    
                // Append the document file
    
                const response = await axiosJWT.post(apiUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
    
                if (response.status === 200) {
                    // Uncomment the following line if you want to show a toast notification
                    // ToastNotification({ message: response.data.message });
                    
                    // Uncomment the following line if you want to navigate to asset management page
                    router.push(`/allocationManagement`);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.errors || [];
                const errorMessage = errors.map(err => err.msg).join('.</br>') || 'Failed to submit the form. Please try again later.';
    
                // Uncomment the following line if you want to show a toast notification
                // ToastNotification({ message: errorMessage });
    
                console.log(errorMessage);
            } else {
                console.error('Error:', error);
                // Uncomment the following line if you want to show a toast notification
                // ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            }
        }
    };


    return (
        <>
            <Head><title>{pageTitles.DeallocateAsset}</title></Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <Breadcrumbs maintext={"Deallocate Asset"} />
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

                                                        <SecTab
                                                            AdduserContent={AdduserContent}
                                                            getsubmitformdata={getsubmitformdata}
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

            <Toaster
                position="top-right"
                reverseOrder={false}

            />
        </>

    );
}
export async function getServerSideProps(context) {

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const payrollForm = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'deallocateAssets' }, context);
    return {
        props: { payrollForm },
    }
}



