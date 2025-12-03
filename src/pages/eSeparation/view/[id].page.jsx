import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { ToastNotification, ToastContainer } from '../../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import axios from 'axios';
import Head from 'next/head';
const DynamicForm = dynamic(() => import('../../Components/CommanForm'), { ssr: false });
const Notes = dynamic(() => import('../../Components/Popup/Notes'), {
    ssr: false
});
export default function index({ userFormdata }) {
    const pagename = ""
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [content, setContent] = useState(userFormdata);
    const [activeTab, setActiveTab] = useState(content.section[0].SectionName);
    const [idSeparation, setIdSeparation] = useState("");
    const [stautsInfo, setStautsInfo] = useState("");


    const { id } = router.query;
    const fetchSeparationInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/separation/getInitiateDetails`, { params: { idSeparation: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    const opportunitySection = content.section.find(section => section.SectionName === "Separation Details");
                    const opportunitySubsection = opportunitySection.Subsection.find(subsection => subsection.SubsectionName === "Separation Information");
                    opportunitySubsection.fields.forEach(field => {
                        if (fetchedData[field.name]) {
                            field.value = fetchedData[field.name];
                            field.isDisabled = true;
                        }
                        if (field.name === "approvalEndDate") {
                            field.isDisabled = true;
                        }
                        if (field.name === "separationStatus") {
                            field.isDisabled = true;
                            field.value = fetchedData.status;
                        }
                        if (field.name === "remarks") {
                            field.isDisabled = true;
                        }
                        if (field.name === "withdrawalReason") {
                            field.isDisabled = true;
                        }
                    });
                    opportunitySection.buttons = [];
                    setStautsInfo(fetchedData.status)

                }
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        const { id } = router.query;
        setIdSeparation(id)
        fetchSeparationInfo(id);
    }, [id]);
    const handleTabClick = (tab) => {
        //if (tabArray.includes(tab)) {
        if (activeTab !== tab) {
            setActiveTab(tab);


            //}
        } else {
            console.log(`${tab} is not in the tabArray`);
        }

    };
    const [sectionerrors, setSectionErrors] = useState({});

    const handleChangeValue = (fieldName, value) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array
        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];
            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];
                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];
                    if (field.name === fieldName) {
                        updatedArray.section[i].Subsection[j].fields[k].value = value;
                        break;
                    }
                }
            }
        }
        setContent(updatedArray);
    };

    const submitformdata = async (formdata, fileData) => {
        const formattedData = {};
        const formattedData2 = {};
        content.section.forEach(section => {
            section.Subsection.forEach(subsection => {
                subsection.fields.forEach(field => {
                    // Skip radio objects
                    if (field.type === 'Radiot&c' || field.type === 'ClaimDoc') { return; }

                    if (typeof field.value === 'object' && 'value' in field.value) {
                        formattedData[field.name] = field.value.value;
                    } else {
                        formattedData[field.name] = field.value;
                    }
                });
            });
        });



        formattedData2["idClaim"] = cid; // Assuming 'cid' is the claim ID
        formattedData2["actionFor"] = "addnlinfo";
        formattedData2["status"] = 'infoprovided'; // Defaulting to "verified" if missing
        formattedData2["comment"] = formattedData.comment || "";

        try {

            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/manageClaims';
            const response = await axiosJWT.post(apiUrl, formattedData2);

            if (response.status === 200) {

                ToastNotification({ message: response.data.message });
                const idClaim = cid;
                handeldocfiles(fileData, idClaim);
                if (formattedData.idEmployee) {
                    router.push(`/admin/claim`);
                } else {
                    router.push(`/claim`);
                }
            }
        } catch (error) {

            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
                ToastNotification({ message: errorMessage });
            } else {
                ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            }
        }
    };


    const handeldocfiles = async (formData, id) => {
        try {
            if (formData) {
                formData.append('moduleId', id);
                const apiUrle = process.env.NEXT_PUBLIC_API_BASE_URL;
                const apiUrl = apiUrle + '/claims/uploadDocuments';
                const response = await axiosJWT.post(apiUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
        } catch (error) { }
    }

    const handleApprrovereqClaim = async (buttonType, formData) => {

        const formattedData = {};
        const formattedData2 = {};
        content.section.forEach(section => {
            section.Subsection.forEach(subsection => {
                subsection.fields.forEach(field => {
                    // Skip radio objects
                    if (field.type === 'ClaimDoc') { return; }

                    if (typeof field.value === 'object' && 'value' in field.value) {
                        formattedData[field.name] = field.value.value;
                    } else {
                        formattedData[field.name] = field.value;
                    }
                });
            });
        });

        formattedData2["idClaim"] = [cid]; // Assuming 'cid' is the claim ID
        formattedData2["action"] = "recalled";
        formattedData2["comment"] = formattedData.comment || "";

        try {

            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/claims/updateStatus`, formattedData2)

            if (response.status === 200) {

                ToastNotification({ message: response.data.message });
                if (formattedData.idEmployee) {
                    router.push(`/admin/claim`);
                } else {
                    router.push(`/claim`);
                }
            }
        } catch (error) {

            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
                ToastNotification({ message: errorMessage });
            } else {
                ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            }
        }
    };



    const onViewClick = (id) => {
        router.push(`/claim/${id}`);
    };
    const onDeleteClick = (id) => {
        // Delete action implementation
    };
    const handleHistoryClick = async (id) => {

    };
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const openNotesModal = async () => {
        setIsNotesModalOpen(true)
    }
    const closeNotesModal = async () => {
        setIsNotesModalOpen(false)
    }
    const onHistoryClick = async (id) => {
    };
    const onEditClick = (id) => {
        // router.push(`/opportunity/${id}`);
    };
    return (
        <>
            {isNotesModalOpen ? (
                <Notes isOpen={isNotesModalOpen} closeModal={closeNotesModal} id={idSeparation} type={"eSeparation"} />
            ) : (null)}
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Edit Separation"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index" id="oxyem_opportunity_page">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

                                                        <div className="center-part">
                                                            <div className="card-body -body skolrup-learning-card-body oxyem-time-managment">
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <div className="user-text skolrup-m-user-text">

                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="row top_btn_opp">
                                                                    <div className='col-md-4'>
                                                                        <span className={`oxyem-mark-${stautsInfo}`}>{stautsInfo}</span>
                                                                    </div>
                                                                    <div className='col-md-8'>
                                                                        <div className="col-12 btn-notes-section">
                                                                            <span className='btn-notes-opp' onClick={openNotesModal}>Notes</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {Array.isArray(content.section) ? (
                                                                    <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
                                                                        {content.section.map((section, index) => (
                                                                            section.isVisible && (
                                                                                <li key={index} className="nav-item">
                                                                                    <a
                                                                                        className={`nav-link ${activeTab === section.SectionName ? 'active' : ''}`}
                                                                                        onClick={() => handleTabClick(section.SectionName)}
                                                                                    >
                                                                                        <div className="skolrup-profile-tab-link">{section.SectionName}</div>
                                                                                    </a>
                                                                                </li>
                                                                            )
                                                                        ))}
                                                                    </ul>

                                                                ) : (
                                                                    null
                                                                )}


                                                                <div className="tab-content" >



                                                                    {content.section.map((section, index) => (
                                                                        activeTab === section.SectionName && (
                                                                            <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>

                                                                                {section.name === "ApprovalStatus" ? (
                                                                                    <>
                                                                                        <h5 className="mb-5 top-heading-text-tab">{section.SectionName}</h5>
                                                                                        <CustomDataTable
                                                                                            title={""}
                                                                                            onViewClick={onViewClick}
                                                                                            onHistoryClick={onHistoryClick}
                                                                                            onEditClick={onEditClick}
                                                                                            pagename={"addpayroll"}
                                                                                            dashboradApi={'/separation/getApprovalList'}
                                                                                            onDeleteClick={onDeleteClick}
                                                                                            idSeparation={idSeparation}
                                                                                            ifForvalue={"view"}
                                                                                        />
                                                                                    </>
                                                                                ) : section.name === "formalities" ? (
                                                                                    <>
                                                                                        <h5 className="mb-5 top-heading-text-tab">{section.SectionName}</h5>
                                                                                        <CustomDataTable
                                                                                            title={""}
                                                                                            onViewClick={onViewClick}
                                                                                            onHistoryClick={onHistoryClick}
                                                                                            onEditClick={onEditClick}
                                                                                            pagename={"addpayroll"}
                                                                                            dashboradApi={'/separation/getFormalitieslList'}
                                                                                            onDeleteClick={onDeleteClick}
                                                                                            idSeparation={idSeparation}
                                                                                            ifForvalue={"view"}
                                                                                        />
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {sectionerrors && Object.keys(sectionerrors).map((key) => (
                                                                                            <div key={key} className="alert alert-danger alert-dismissible fade show" role="alert">
                                                                                                {sectionerrors[key]}
                                                                                                <button type="button" className="btn-close" aria-label="Close" onClick={() => removeError(key)}></button>
                                                                                            </div>
                                                                                        ))}
                                                                                        <DynamicForm
                                                                                            fields={section}
                                                                                            content={content}
                                                                                            apiurl={apiUrl}
                                                                                            handleChangeValue={handleChangeValue}
                                                                                            Openedsection={index}
                                                                                            handleChangess={() => handleChangess(index)}

                                                                                            submitformdata={submitformdata}

                                                                                            isModule={content.formType}
                                                                                            pagename={pagename}
                                                                                        />
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    ))}
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
        </>
    )
}

export async function getServerSideProps(context) {
    const cookies = context.req.headers.cookie;
    const accessToken = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('accessToken='))?.split('=')[1] : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const response = await axios.get(`${apiUrl}/getDynamicForm`, {
            params: { formType: 'editSeparation' },
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
