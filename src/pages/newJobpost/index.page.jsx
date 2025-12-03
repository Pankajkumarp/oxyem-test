
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { Toaster } from 'react-hot-toast';

import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function newJobpost({ payrollForm }) {
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    const router = useRouter();
    const data = router.query.data;
    const [storeArray, setStoreArray] = useState(payrollForm);
    const [AdduserContent, setAdduserContent] = useState(payrollForm);
    
    const transformFormData = (data) => {
        const transformedData = {};
        data.section.forEach(section => {
            section.fields.forEach(field => {
                if (field.name !== "employeeName") {
                    transformedData[field.name] = field.attributeValue;
                }
            });
        });
        
        return transformedData;
    };
    const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const getsubmitformdata = async (value) => {
        setSubmitButtonLoading(true);
        const transformedData = transformFormData(value);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.post(`${apiUrl}/jobs/managejobs`, transformedData);
                if (response) {
                    router.push('/manageJob');
                    setSubmitButtonLoading(false);
                }
            } catch (error) {
                setSubmitButtonLoading(false);
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
                                <Breadcrumbs maintext={"Post New Job"} />
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

