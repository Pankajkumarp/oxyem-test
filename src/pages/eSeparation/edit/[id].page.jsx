import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { ToastNotification, ToastContainer } from '../../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import axios from 'axios';
import Head from 'next/head';
import FormalitiesView from '../../Components/Popup/FormalitiesView';
const DynamicForm = dynamic(() => import('../../Components/CommanForm'), { ssr: false });
const Notes = dynamic(() => import('../../Components/Popup/Notes'), {
    ssr: false
});
import { FaTimes } from "react-icons/fa";
export default function index({ userFormdata }) {
    const pagename = "timeManagement"
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [content, setContent] = useState(userFormdata);
    const [activeTab, setActiveTab] = useState(content.section[0].SectionName);
    const [idSeparation, setIdSeparation] = useState("");
    const [stautsInfo, setStautsInfo] = useState("");
    const [approvalLevel, setApprovalLevel] = useState("");


    const { id } = router.query;
    const fetchSeparationInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/separation/getInitiateDetails`, { params: { idSeparation: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    setApprovalLevel(fetchedData.approvalLevel)
                    const opportunitySection = content.section.find(section => section.SectionName === "Separation Details");
                    const opportunitySubsection = opportunitySection.Subsection.find(subsection => subsection.SubsectionName === "Separation Information");
                    opportunitySubsection.fields.forEach(field => {
                        if (fetchedData[field.name]) {
                            field.value = fetchedData[field.name];
                            field.isDisabled = true;
                        }
                        if (fetchedData.approvalLevel === "1") {
                            if (field.name === "separationStatus") {
                                field.options = [
                                    {
                                        "label": "Approved",
                                        "value": "approved"
                                    },
                                    {
                                        "label": "Reject",
                                        "value": "reject"
                                    }
                                ]
                            }
                        } else {
                            if (field.name === "separationStatus") {
                                field.options = [
                                    {
                                        "label": "Approved",
                                        "value": "approved"
                                    },
                                    {
                                        "label": "Withdraw",
                                        "value": "withdraw"
                                    },
                                    {
                                        "label": "Reject",
                                        "value": "reject"
                                    }
                                ]
                            }
                        }
                    });
                    if (fetchedData.isSubmitRequired === false) {
                        opportunitySection.buttons = [];
                    }
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
        if (fieldName === "separationStatus") {
            const opportunitySection = content.section.find(section => section.SectionName === "Separation Details");
            const btnSubsection = opportunitySection.buttons.find(btsection => btsection.buttontype === "submit");
            const opportunitySubsection = opportunitySection.Subsection.find(subsection => subsection.SubsectionName === "Separation Information");
            const fields = opportunitySubsection.fields;

            const approvedDateField = fields.find(field => field.name === "approvalEndDate");
            const withdrawalReasonField = fields.find(field => field.name === "withdrawalReason");
            const rejectReasonField = fields.find(field => field.name === "rejectReason");
            const remarkReasonField = fields.find(field => field.name === "remarks");

            const updateFields = (value) => {
                if (value === "withdraw") {
                    withdrawalReasonField.isVisible = true;
                    withdrawalReasonField.validations = [{
                        "message": "Withdrawal Reason is required",
                        "type": "required"
                    }]
                    rejectReasonField.isVisible = false;
                    rejectReasonField.validations = [];
                    approvedDateField.isVisible = false;
                    approvedDateField.validations = [];
                    remarkReasonField.isVisible = false;
                    remarkReasonField.validations = [];
                    btnSubsection.label = "Withdraw"
                    btnSubsection.class = "btn btn-primary"
                } else if (value === "reject") {
                    rejectReasonField.isVisible = true;
                    rejectReasonField.validations = [{
                        "message": "Reject Reason is required",
                        "type": "required"
                    }]
                    withdrawalReasonField.isVisible = false;
                    withdrawalReasonField.validations = [];
                    approvedDateField.isVisible = false;
                    approvedDateField.validations = [];
                    remarkReasonField.isVisible = false;
                    remarkReasonField.validations = [];
                    btnSubsection.label = "Reject"
                    btnSubsection.class = "btn btn-danger"
                } else {
                    approvedDateField.isVisible = true;
                    approvedDateField.validations = [{
                        "message": "Approved End Date is required",
                        "type": "required"
                    }];
                    withdrawalReasonField.isVisible = false;
                    withdrawalReasonField.validations = [];
                    rejectReasonField.isVisible = false;
                    rejectReasonField.validations = [];
                    remarkReasonField.isVisible = true;
                    remarkReasonField.validations = [{
                        "message": "Remarks is required",
                        "type": "required"
                    }];
                    btnSubsection.label = "Approved"
                    btnSubsection.class = "btn btn-success"
                }
            }

            updateFields(value.value);
        }
        const updatedArray = JSON.parse(JSON.stringify(content));

        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];
            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];

                // Ensure that 'fields' exists before proceeding
                if (subsection.fields && Array.isArray(subsection.fields)) {
                    for (let k = 0; k < subsection.fields.length; k++) {
                        const field = subsection.fields[k];
                        if (field.name === fieldName) {
                            updatedArray.section[i].Subsection[j].fields[k].value = value;
                            break;
                        }
                    }
                } else {
                    console.warn(`No 'fields' property in subsection ${j} of section ${i}`);
                }
            }
        }
        setContent(updatedArray);
    };

    const submitformdata = async (formdata) => {
        const formattedData = {};
        content.section.forEach(section => {
            if (section.SectionName === 'Separation Details') {
                section.Subsection.forEach(subsection => {
                    subsection.fields.forEach(field => {
                        if (typeof field.value === 'object' && 'value' in field.value) {
                            formattedData[field.name] = field.value.value;
                        } else {
                            formattedData[field.name] = field.value;
                        }
                    });
                });
            }
        });
        let payload = {};

        if (formattedData.separationStatus === 'reject') {
            payload = {
                idSeparation: idSeparation,
                status: formattedData.separationStatus,
                rejectReason: formattedData.rejectReason
            };
        } else if (formattedData.separationStatus === 'withdraw') {
            payload = {
                idSeparation: idSeparation,
                status: formattedData.separationStatus,
                withdrawalReason: formattedData.withdrawalReason
            };
        } else if (formattedData.separationStatus === 'approved') {
            payload = {
                idSeparation: idSeparation,
                status: formattedData.separationStatus,
                approvalEndDate: formattedData.approvalEndDate,
                remarks: formattedData.remarks
            };
        }
        try {

            const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/separation/updateApproval`;
            const response = await axiosJWT.post(apiUrl, payload);

            if (response.status === 200) {
                const message = "Successfully update separation status."
                ToastNotification({ message: message });
                router.push(`/eSeparation/admin`);
            } else {

                ToastNotification({ message: response.errorMessage });
            }
        } catch (error) {
            const errormessagel = error.response.data.errorMessage
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessagel }}></span>
                    <button
                        onClick={() => toast.dismiss(id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#FF000F',
                            marginLeft: 'auto',
                            cursor: 'pointer'
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
            ), {
                icon: null, // Disable default icon
                duration: 7000,
                style: {
                    border: '1px solid #FF000F',
                    padding: '8px',
                    color: '#FF000F',
                },
            });
        }
    };

    const onViewClick = (id) => {
        //router.push(`/claim/${id}`);
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
    const [idFormalities, setIdFormalities] = useState("");
    const [isFormalitiesOpen, setIsFormalitiesOpen] = useState(false);
    const onViewFormClick = (id) => {
        setIdFormalities(id)
        onFormalitesModal();
    };
    const onFormalitesModal = (id) => {
        setIsFormalitiesOpen(true)
    };
    const closeFormalitesModal = (id) => {
        setIsFormalitiesOpen(false)
    };

    const [isrefreshform, setRefreshForm] = useState(true);
    const handleApproveSubmit = async (value) => {

        let payload = {};
        if (value.selectvalue === 'submitted') {
            payload = {
                idSeparationFormality: value.id,
                status: value.selectvalue
            };
        } else {
            payload = {
                idSeparationFormality: value.id,
                status: value.selectvalue,
                remarks: value.remarks
            };
        }
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/separation/updateFormality`;
            const response = await axiosJWT.post(apiUrl, payload);
            if (response.status === 200) {
                setIsFormalitiesOpen(false)
                const message = "Successfully update formalities status."
                ToastNotification({ message: message });
                setRefreshForm(false)
                setTimeout(() => {
                    setRefreshForm(true);
                }, 300);
            } else {
                ToastNotification({ message: 'Failed to update approval. Please try again later.' });
            }
        } catch (error) {
        }

    };
    return (
        <>
            <FormalitiesView isOpen={isFormalitiesOpen} closeModal={closeFormalitesModal} id={idFormalities} type={"eSeparation"} handleApproveSubmit={handleApproveSubmit} approvalLevel={approvalLevel}/>
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
                                                                                        />
                                                                                    </>
                                                                                ) : section.name === "formalities" ? (
                                                                                    <>
                                                                                        <h5 className="mb-5 top-heading-text-tab">{section.SectionName}</h5>
                                                                                        {isrefreshform && (
                                                                                            <CustomDataTable
                                                                                                title={""}
                                                                                                onViewClick={onViewFormClick}
                                                                                                pagename={"addpayroll"}
                                                                                                dashboradApi={'/separation/getFormalitieslList'}
                                                                                                idSeparation={idSeparation}
                                                                                            />
                                                                                        )}
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
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
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
