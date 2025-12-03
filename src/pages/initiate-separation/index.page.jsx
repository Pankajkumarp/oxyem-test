import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { axiosJWT } from '../Auth/AddAuthorization';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
const DynamicForm = dynamic(() => import('../Components/CommanForm'), {
    ssr: false
});

export default function AddClaim({ userFormdata }) {
    const router = useRouter();
    const [content, setContent] = useState(userFormdata
    );


    const handleChangeValue = (fieldName, value) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array

        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];

            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];

                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];

                    if (field.name === fieldName) {
                        // Update the value of the field with matching fieldName
                        updatedArray.section[i].Subsection[j].fields[k].value = value;
                        break;
                    }
                }
            }
        }
        setContent(updatedArray);
    };

    const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const submitformdata = async () => {
        setSubmitButtonLoading(true);
        const formattedData = {};
        content.section.forEach(section => {
            section.Subsection.forEach(subsection => {
                subsection.fields.forEach(field => {

                    if (typeof field.value === 'object' && 'value' in field.value) {
                        formattedData[field.name] = field.value.value;
                    } else {
                        formattedData[field.name] = field.value;
                    }
                });
            });
        });
        try {

            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/separation/initiate';
            const response = await axiosJWT.post(apiUrl, formattedData);

            if (response.status === 200) {
                console.log(response)
                if(response.data.message){
                ToastNotification({ message: response.data.message });
                router.push(`/eSeparation`);
                setSubmitButtonLoading(false);
            }else{
			ToastNotification({ message: response.data.errorMessage });
                setSubmitButtonLoading(false);
			}
            }
        } catch (error) {
            setSubmitButtonLoading(false);
            const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
        }
    };

    return (
        <>
            <Head>
                <title>Initiate Separation</title>
                <meta name="description" content={"Initiate Separation"} />
            </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Initiate Separation"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className="center-part">
                                                            <div className="card-body -body skolrup-learning-card-body oxyem-time-managment">
                                                                <div className="tab-content" >
                                                                    {content && content.section && Array.isArray(content.section) ? (
                                                                        content.section.map((section, index) => (
                                                                            <div key={index} >
                                                                                <DynamicForm
                                                                                    fields={section}
                                                                                    submitformdata={submitformdata}
                                                                                    handleChangeValue={handleChangeValue}
                                                                                    handleChangess={() => handleChangess(index)}
                                                                                    pagename={'timeManagement'}
                                                                                    isModule={content.formType}
                                                                                    loaderSubmitButton={SubmitButtonLoading}
                                                                                />
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div></div>
                                                                    )}
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
                </div>
            </div>
            <ToastContainer />
        </>
    );
}


export async function getServerSideProps(context) {
    const cookies = context.req.headers.cookie;
    const accessToken = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('accessToken='))?.split('=')[1] : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const response = await axios.get(`${apiUrl}/getDynamicForm`, {
            params: { formType: 'Eseparation' },
            headers: {
                Authorization: accessToken,
            },
        });
        console.log(response.data)

        return {

            props: { userFormdata: response.data.data },
        };

    } catch (error) {
        return {
            redirect: {
                destination: context.req.headers.referer || '/',
                permanent: false,
            },
        };
    }
}
