
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import SecTab from '../Components/Employee/SecTab.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { Toaster } from 'react-hot-toast';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification.jsx';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function allocateExtend({ payrollForm }) {
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    const router = useRouter();
    const data = router.query.data;
    const [storeArray, setStoreArray] = useState(payrollForm);
    const [AdduserContent, setAdduserContent] = useState(payrollForm);
    
    const getChangessField = async (value) => {};

    function extractFields(data) {
        const result = {};
        data.section.forEach(section => {
            section.fields.forEach(field => {
                result[field.name] = field.attributeValue;
            });
        });
        return result;
    }

    const getsubmitformdata = async (value) => {

        try {
            if (value) {

                const result = extractFields(value);
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/allocationExtend';
                const response = await axiosJWT.post(apiUrl, result);
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

    return (
        <>
        <Head><title>{pageTitles.AllocateExtend}</title></Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <Breadcrumbs maintext={"Allocate Extend"} />
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

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

            <Toaster
                position="top-right"
                reverseOrder={false}

            />
            <ToastContainer />
        </>

    );
}
export async function getServerSideProps(context) {

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const payrollForm = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'extendAllocate' }, context);
    return {
        props: { payrollForm },
    }
}

