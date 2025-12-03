import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router'
import Head from 'next/head';
import axios from 'axios';
import AddPerformance from '../Components/Popup/AddPerformance';
import FieldRenderer from './FieldRenderer.jsx';
import StatusComponent from './StatusInput.jsx';
import { FaCircleChevronUp, FaCircleChevronDown } from "react-icons/fa6";
import { IoAddCircleOutline } from "react-icons/io5";
import { Tooltip } from 'react-tooltip'
import CryptoJS from 'crypto-js';
import { FaTimes } from 'react-icons/fa';
import { FaInfoCircle } from "react-icons/fa";
const Notes = dynamic(() => import('../Components/Popup/Notes'), {
    ssr: false
});
import SummaryRender from './SummaryRender.jsx';
import DeleteGoal from './deleteGoal.jsx';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
import { FaAward } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
export default function opportunity({ userFormdata }) {
    const [goalCount, setGoalCount] = useState({});

    const [listheader, setListHeaders] = useState([]);
    const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const router = useRouter();
    const [formvalue, setFormvalue] = useState(userFormdata);
    const [activeTab, setActiveTab] = useState(formvalue.section[0].SectionName);
    const handleNext = async () => {
        const currentIndex = formvalue.section.findIndex(section => section.SectionName === activeTab);
        if (currentIndex !== -1 && currentIndex < formvalue.section.length - 1) {
            setActiveTab(formvalue.section[currentIndex + 1].SectionName);
        }
    };
    const [tabArray, setTabArray] = useState([]);
    const [performanceId, setPerformanceId] = useState("");
    useEffect(() => {
        const { id } = router.query;
        if (id) {
            setPerformanceId(id);
        }
    }, [router.query.id]);
    useEffect(() => {
        if (!tabArray.includes(activeTab) && activeTab !== null) {
            setTabArray((prevTabArray) => [...prevTabArray, activeTab]);
        }
    }, [activeTab]);



    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const handleTabClick = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const openNotesModal = async () => {
        setIsNotesModalOpen(true)
    }
    const closeNotesModal = async () => {
        setIsNotesModalOpen(false)
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const getAllGoalNames = (data) => {
        let goalNames = [];

        data.section.forEach((section) => {
            section.Subsection.forEach((subsection) => {
                subsection.fields.forEach((field) => {
                    if (field.goalName && field.goalName.value) {
                        goalNames.push(field.goalName.value);
                    }
                });
            });
        });
        return [...new Set(goalNames)];
    };


    const handleAddRowData = async (sectionName) => {
        setIsModalOpen(true)
    };


    const [activeMainTab, setActiveMainTab] = useState("active");
    const handleMainTabClick = (index) => {
        setActiveMainTab(index);
    };
    const [isFormShow, setisFormShow] = useState(false);
    const [statusValue, setstatusValue] = useState("");
    const [formRenderValue, setFormRenderValue] = useState("");
    const [userType, setUserType] = useState("");
    const [renderLength, setRenderLength] = useState({});
    const fetchInitiatePerformData = async () => {
        const { id } = router.query;
        try {

            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/performance/viewReviews`, {
                params: { idReview: id }
            });
            if (response) {
                const responseData = response.data.data
                setstatusValue(responseData.status)
                setFormRenderValue(responseData)
                setUserType(responseData.userType)
                setisFormShow(true)
                if (responseData && responseData.goalCount) {
                    setRenderLength(responseData.goalCount)
                }
            }
        } catch (error) {
        }
    };
    const [userName, setUserName] = useState("");
    useEffect(() => {
        const secretKey = process.env.NEXT_PUBLIC_ENCRYPT_DECRYPTING;
        const encryptedEmployeeNameg = sessionStorage.getItem('empN');
        if (encryptedEmployeeNameg) {
            const bytes = CryptoJS.AES.decrypt(encryptedEmployeeNameg, secretKey);
            const decryptedEmployeeName = bytes.toString(CryptoJS.enc.Utf8);
            setUserName(decryptedEmployeeName)
        }
    }, []);
    const fetchGoalUseData = async () => {
        const { id } = router.query;
        try {

            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/performance/getAllTotalGoalScores`, {
                params: { idReview: id }
            });
            if (response) {
                const responseData = response.data.data
                setGoalCount(responseData)
            }
        } catch (error) {
        }
    };
    useEffect(() => {
        fetchInitiatePerformData();
        fetchGoalUseData()
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'performance-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);
    const [isVisible, setIsVisible] = useState(true);
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };
    const [isVisibleBottom, setIsVisibleBottom] = useState(true);
    const toggleVisibilityBottom = () => {
        setIsVisibleBottom(!isVisibleBottom);
    };
    const [isFormShowIs, setisFormShowIs] = useState(false);
    const [summaryValue, setSummaryvalue] = useState();
    const [usedGoalName, setUsedGoalName] = useState([]);
    const fetchgoalData = async (activeTab) => {
        const { id } = router.query;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            let response;
            if (activeTab === "Summary") {
                response = await axiosJWT.get(`${apiUrl}/performance/getPerformanceSummary`, {
                    params: { idReview: id }
                });
            } else {
                response = await axiosJWT.get(`${apiUrl}/performance/getGoals`, {
                    params: { isFor: activeTab, idReview: id }
                });
            }
            if (response) {
                const responseData = response.data.data
                if (activeTab === "Summary") {
                    setSummaryvalue(responseData)
                    setisFormShowIs(true)
                } else {
                    const section = formvalue.section.find(s => s.SectionName.toLowerCase() === activeTab.toLowerCase());
                    if (section) {
                        section.Subsection.forEach(subsection => {
                            subsection.fields = responseData.map(goal => ({
                                filePaths: {
                                    attribute: goal.filePaths?.attribute || "",
                                    value: goal.filePaths?.value || [],
                                    loader: "" // You might want to check if there's a value for `loader` in the response
                                },
                                goalName: {
                                    attribute: goal.goalName?.attribute || "",
                                    value: goal.goalName?.value || ""
                                },
                                idGoal: {
                                    attribute: goal.idGoal?.attribute || "",
                                    value: goal.idGoal?.value || ""
                                },
                                markAsClosed: {
                                    attribute: goal.markAsClosed?.attribute || "",
                                    value: goal.markAsClosed?.value || false
                                },
                                noOrPercentage: {
                                    attribute: goal.noOrPercentage?.attribute || "",
                                    value: goal.noOrPercentage?.value || ""
                                },
                                selfRating: {
                                    attribute: goal.selfRating?.attribute || "",
                                    value: goal.selfRating?.value || ""
                                },
                                status: {
                                    attribute: goal.status?.attribute || "",
                                    value: goal.status?.value || ""
                                },
                                target: {
                                    attribute: goal.target?.attribute || "",
                                    type: goal.target?.value || "",
                                    value: (goal.target?.value === "number" || goal.target?.value === "percentage") ? "" : goal.target?.value || ""
                                },
                                typeOfLevel: {
                                    attribute: goal.typeOfLevel?.attribute || "",
                                    value: goal.typeOfLevel?.value || ""
                                },
                                comments: {
                                    attribute: goal.comments?.attribute || "",
                                    value: goal.comments?.value || "",
                                    changeValue: ""
                                },
                                selfComments: {
                                    attribute: goal.selfComments?.attribute || "",
                                    value: goal.selfComments?.value || ""
                                },
                                noOrPercentageUpdated: {
                                    attribute: goal.noOrPercentageUpdated?.attribute || "",
                                    value: goal.noOrPercentageUpdated?.value || ""
                                },
                                goalDetails: {
                                    attribute: goal.goalDetails?.attribute || "",
                                    value: goal.goalDetails?.value || ""
                                },
                                isAdmin: {
                                    attribute: goal.isAdmin?.attribute || "",
                                    value: goal.isAdmin?.value || false
                                },
                                refreshUrl: {
                                    attribute: goal.refreshUrl?.attribute || "",
                                    value: goal.refreshUrl?.value || false
                                },
                                goalScore: {
                                    attribute: goal.goalScore?.attribute || "",
                                    value: goal.goalScore?.value || false
                                },
                                isSave: {
                                    attribute: goal.isSave?.attribute || "",
                                    value: goal.isSave?.value || false
                                },
                                isSelfRatingDone: {
                                    attribute: goal.isSelfRatingDone?.attribute || "",
                                    value: goal.isSelfRatingDone?.value
                                },
                                isAsignReviewerRatingDone: {
                                    attribute: goal.isAsignReviewerRatingDone?.attribute || "",
                                    value: goal.isAsignReviewerRatingDone?.value
                                },
                                isReviewerRatingDone: {
                                    attribute: goal.isReviewerRatingDone?.attribute || "",
                                    value: goal.isReviewerRatingDone?.value
                                },
                                isApproverRatingDone: {
                                    attribute: goal.isApproverRatingDone?.attribute || "",
                                    value: goal.isApproverRatingDone?.value
                                },
                                isDeleted: {
                                    attribute: goal.isDeleted?.attribute || "",
                                    value: goal.isDeleted?.value
                                }
                            }));
                        });
                    }
                    const goalNames = getAllGoalNames(formvalue);
                    const newGoalNames = goalNames.filter(goal => !usedGoalName.includes(goal));

                    setUsedGoalName([...usedGoalName, ...newGoalNames]);

                    setFormvalue(formvalue)
                    setisFormShowIs(true)
                }
            }
        } catch (error) {
        }
    };
    useEffect(() => {
        setisFormShowIs(false)
        fetchgoalData(activeTab)
    }, [activeTab]);
    const refreshData = (value) => {
        setActiveTab(value)
        fetchInitiatePerformData()
        setisFormShowIs(false)
        fetchgoalData(activeTab)
        fetchGoalUseData()
    };
    const refreshSummaryData = () => {
        setisFormShowIs(false)
        fetchgoalData(activeTab)
        if (activeTab === "Summary") {
            fetchInitiatePerformData();
        }
    };
    const handleAddRowDataClose = async (sectionName) => {
        fetchgoalData(activeTab)
        setIsModalOpen(false)
    };
    const handleFieldChange = (sectionIndex, subsectionIndex, fieldIndex, e, fieldName) => {
        const newValue = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormvalue(prevFormValue => {
            const updatedFormValue = { ...prevFormValue };
            const field = updatedFormValue.section[sectionIndex]
                .Subsection[subsectionIndex]
                .fields[fieldIndex];
            if (fieldName === 'target' && field.target) {
                field.target.value = newValue;
                field.target.error = "";
            } else if (fieldName === 'selfRating' && field.selfRating) {
                field.selfRating.value = newValue;
                field.selfRating.error = "";
            } else if (fieldName === 'markAsClosed' && field.markAsClosed) {
                field.markAsClosed.value = newValue;
            } else if (fieldName === 'comments' && field.comments) {
                field.comments.changeValue = newValue;
                field.comments.error = "";
            } else if (fieldName === 'refreshUrl' && field.refreshUrl) {
                field.refreshUrl.value = newValue;
                field.refreshUrl.error = "";
            } else if (fieldName === 'noOrPercentageUpdated' && field.noOrPercentageUpdated) {
                field.noOrPercentageUpdated.value = newValue;
                field.target.error = "";
            }
            return updatedFormValue;
        });
    };
    const handleFileChange = async (updatedFiles, goalId, sectionIndex, subsectionIndex, fieldIndex, fieldName) => {
        setFormvalue(prevFormValue => {
            const updatedFormValue = { ...prevFormValue };
            const field = updatedFormValue.section[sectionIndex]
                .Subsection[subsectionIndex]
                .fields[fieldIndex];
            if (fieldName === 'filePaths' && field.filePaths) {
                field.filePaths.loader = "uploading"
            }
            return updatedFormValue;
        });
        const formData = new FormData();
        updatedFiles.forEach(file => {
            formData.append('files', file);
        });
        formData.append('id', goalId);
        formData.append('isFor', "goal");
        try {
            const response = await axiosJWT.post(`${apiUrl}/performance/uploadFiles`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response) {
                const responseData = response.data.filePaths
                setFormvalue(prevFormValue => {
                    const updatedFormValue = { ...prevFormValue };
                    const field = updatedFormValue.section[sectionIndex]
                        .Subsection[subsectionIndex]
                        .fields[fieldIndex];
                    if (fieldName === 'filePaths' && field.filePaths) {
                        field.filePaths.value = [...responseData, ...field.filePaths.value],
                            field.filePaths.loader = "uploaded"

                    }
                    return updatedFormValue;
                });
                setTimeout(() => {
                    setFormvalue(prevFormValue => {
                        const updatedFormValue = { ...prevFormValue };
                        const field = updatedFormValue.section[sectionIndex]
                            .Subsection[subsectionIndex]
                            .fields[fieldIndex];
                        if (fieldName === 'filePaths' && field.filePaths) {
                            field.filePaths.loader = ""

                        }
                        return updatedFormValue;
                    });
                }, 2500);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const transformData = (data) => {
        return {
            filePaths: data.filePaths.value.map(file => ({
                fileExtenstion: file.fileExtenstion,
                fileName: file.fileName,
                filePath: file.filePath,
                fileSize: file.fileSize,
                idFile: file.idFile,
                submitDate: file.submitDate
            })),
            loader: data.filePaths.loader,
            goalName: data.goalName.value,
            idGoal: data.idGoal.value,
            markAsClosed: data.markAsClosed.value,
            isAdmin: data.isAdmin.value,
            noOrPercentage: data.noOrPercentage.value,
            rating: data.selfRating.value,
            status: data.status.value,
            target: data.noOrPercentageUpdated.value,
            typeOfLevel: data.typeOfLevel.value,
            comment: data.comments.changeValue,
            goalDetails: data.goalDetails.value,
            refreshUrl: data.refreshUrl.value
        };
    };
    const validatePerformFields = (payload) => {
        const errors = {};
        if (payload.isAdmin === false) {
            if (payload.markAsClosed === false) {
                if (!payload.comment || payload.comment.trim() === "") {
                    errors.comment = "Comment is required";
                }
            }
            if (payload.markAsClosed === true) {
                if (activeTab !== "Learning") {
                    if (payload.target === undefined || payload.target === null || (typeof payload.target === 'string' && payload.target.trim() === "")) {
                        errors.target = "Target cannot be empty";
                    }
                }
                if (!payload.comment || payload.comment.trim() === "") {
                    errors.comment = "Comment is required";
                }
                if (payload.rating === "" || payload.rating === undefined || payload.rating === null || isNaN(payload.rating)) {
                    errors.rating = "Rating is required";
                }
            }
        } else if (payload.isAdmin === true) {
            if (!payload.comment || payload.comment.trim() === "") {
                errors.comment = "Comment is required";
            }
            if (payload.rating === "" || payload.rating === undefined || payload.rating === null || isNaN(payload.rating)) {
                errors.rating = "Reviewer Rating is required";
            }
        }

        return errors;
    };

    const handleGoalSubmit = async (sectionIndex, subsectionIndex, fieldIndex) => {
        try {
            const fieldValue = formvalue.section[sectionIndex]
                .Subsection[subsectionIndex]
                .fields[fieldIndex];
            const formattedData = transformData(fieldValue);

            const needValue = ['idGoal', 'comment', 'target', 'noOrPercentage', 'rating', 'markAsClosed', 'isAdmin', 'refreshUrl']
            const payload = Object.keys(formattedData)
                .filter(key => needValue.includes(key))
                .reduce((obj, key) => {
                    obj[key] = formattedData[key];
                    return obj;
                }, {});

            const errors = validatePerformFields(payload);
            if (Object.keys(errors).length > 0) {
                setFormvalue(prevFormValue => {
                    const updatedFormValue = { ...prevFormValue };
                    const field = updatedFormValue.section[sectionIndex]
                        .Subsection[subsectionIndex]
                        .fields[fieldIndex];
                    if (errors.target) {
                        field.target.error = errors.target;
                    }
                    if (errors.comment) {
                        field.comments.error = errors.comment;
                    }
                    if (errors.rating) {
                        field.selfRating.error = errors.rating;
                    }
                    return updatedFormValue;
                });
                return;
            }
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/performance/updateGoal`, payload);

            if (response) {
                const updatedFormvalue = { ...formvalue };
                updatedFormvalue.section.forEach(section => {
                    section.Subsection.forEach(subsection => {
                        subsection.fields.forEach(field => {
                            if (field.idGoal?.value === payload.idGoal) {
                                field.comments.changeValue = "";
                                field.markAsClosed.value = payload.markAsClosed;
                                field.status.value = payload.markAsClosed ? "closed" : "open";
                                if (userType === "self") {
                                    field.isSelfRatingDone.value = payload.markAsClosed ? "closed" : "open";
                                } else if (userType === "reviewer") {
                                    field.isReviewerRatingDone.value = payload.markAsClosed ? "closed" : "open";
                                } else if (userType === "approver") {
                                    field.isApproverRatingDone.value = payload.markAsClosed ? "closed" : "open";
                                }
                                field.noOrPercentageUpdated.value = payload.target;
                                field.rating = { attribute: "rating", value: payload.rating };
                                const newComment = {
                                    comment: payload.comment,
                                    postBy: userName,
                                    rating: payload.rating,
                                    postOn: new Date().toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                };
                                field.selfComments.value.unshift(newComment);
                            }
                        });
                    });
                });
                setFormvalue(updatedFormvalue);
                const message = "Goal updated successfully."
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <FaRegCheckCircle style={{
                            fontSize: '35px',
                            marginRight: '10px',
                            color: '#4caf50'
                        }} />
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                        <button
                            onClick={() => toast.dismiss(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
                                marginLeft: 'auto',
                                cursor: 'pointer',
                                fontSize: '20px',
                            }}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ), {
                    icon: null,
                    duration: 7000,
                    style: {
                        border: '1px solid #4caf50',
                        padding: '8px',
                        color: '#4caf50',
                    },
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleCancel = async () => {

    };
    const handleCycleInitiate = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const { id } = router.query;
        const payloadInitiate ={
             "idReview":id,
            "status":"initiate"
        }
        const response = await axiosJWT.post(`${apiUrl}/performance/initiateCycle`, payloadInitiate);
        if (response) {
                const message = response.data.message
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <FaRegCheckCircle style={{
                            fontSize: '35px',
                            marginRight: '10px',
                            color: '#4caf50'
                        }} />
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                        <button
                            onClick={() => toast.dismiss(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
                                marginLeft: 'auto',
                                cursor: 'pointer',
                                fontSize: '20px',
                            }}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ), {
                    icon: null,
                    duration: 7000,
                    style: {
                        border: '1px solid #4caf50',
                        padding: '8px',
                        color: '#4caf50',
                    },
                });
                setActiveTab(formvalue.section[0].SectionName)
                setStatusLabel(formvalue.section[0].SectionName)
                setstatusValue("8641f749-5601-45c2-bce0-1f34b2e262d2")
            }
    };
    const [statusLabel, setStatusLabel] = useState("");
    const getStautLabel = async (value) => {
        setStatusLabel(value)
    };
    const fetchData = async (id) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/performance/getgoalcounts`, { params: { idReview: id } });
            if(response){
            const listheader = response.data.data || {};
            setListHeaders(listheader);
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        const { id } = router.query;
        fetchData(id);
    }, []);

    const [deleteRecordValue, setDeleteRecordValue] = useState({});
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const onDeleteClick = async (value) => {
        setDeleteRecordValue(value)
        setIsModalDeleteOpen(true)
    };
    const handleDeleteClose = () => {
        setIsModalDeleteOpen(false)
    };
    const handleDelete = async (value) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/performance/deleteGoal`, { params: { idGoal: value } });
            if (response) {
                fetchGoalUseData()
                fetchgoalData()
                setIsModalDeleteOpen(false)
                const updatedFormValue = JSON.parse(JSON.stringify(formvalue));
                updatedFormValue.section.forEach(section => {
                    section.Subsection.forEach(sub => {
                        if (Array.isArray(sub.fields)) {
                            sub.fields = sub.fields.filter(field => {
                                const idGoal = field?.idGoal?.value;
                                return idGoal !== value;
                            });
                        }
                    });
                });
                setFormvalue(updatedFormValue)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <>
            <Head>
                <title>Submit and Monitor Your Performance Evaluation Cycle</title>
                <meta name="description" content={"Submit and Monitor Your Performance Evaluation Cycle"} />
            </Head>
            <DeleteGoal isOpen={isModalDeleteOpen} closeModal={handleDeleteClose} value={deleteRecordValue} handleDelete={handleDelete} />
            <AddPerformance isOpen={isModalOpen} closeModal={handleAddRowDataClose} id={performanceId} isAFor={activeTab} refreshData={refreshData} usedGoalName={usedGoalName} />
            {isNotesModalOpen ? (
                <Notes isOpen={isNotesModalOpen} closeModal={closeNotesModal} id={performanceId} type={"opportunity"} />
            ) : (null)}
            <div className="main-wrapper">
                <div className="page-wrapper" id="oxyem_peformacr_id_page">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Initiate Performance"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index" id="oxyem_opportunity_page">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body custum_space_perfprom">
                                                    <h3 className='performance_head_text performance_head_text_id'><FaAward /> Empowering Performance Excellence</h3>
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        {activeMainTab === "active" &&
                                                            <div className={`performace_search_input performace_form_visible`}>
                                                                {isFormShow ? (
                                                                    <>
                                                                        <div className="form_btn_status d-flex align-items-center justify-content-end perform_notes_btn_status">
                                                                            <div className="btn-notes-section">
                                                                                <span className='btn-notes-opp' onClick={openNotesModal}>Notes</span>
                                                                            </div>
                                                                            <StatusComponent pagename={"initiate"} value={statusValue} getStautLabel={getStautLabel} />
                                                                        </div>
                                                                        <div className="w-100 form_btn_arrow">
                                                                            <button onClick={toggleVisibility} className='toggle-button'>
                                                                                <span>Performance Cycle Information</span>{isVisible ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                                                            </button>
                                                                        </div>
                                                                        {isVisible && (
                                                                            <div className='box_initiate_form_v'>
                                                                                <div className='row'>
                                                                                    <div className='col-lg-4 col-md-6'>
                                                                                        <p><span>Name : </span>{formRenderValue.employeeName}</p>
                                                                                    </div>
                                                                                    <div className='col-lg-4 col-md-6'>
                                                                                        <p><span>Cycle Rating : </span>{formRenderValue.cycleRating}</p>
                                                                                    </div>
                                                                                    <div className='col-lg-4 col-md-6'>
                                                                                        <p><span>Financial Year : </span>{formRenderValue.financialYear}</p>
                                                                                    </div>
                                                                                    <div className='col-lg-4 col-md-6'>
                                                                                        <p><span>Closing Date : </span>{formRenderValue.submissionClosingDate}</p>
                                                                                    </div>
                                                                                    <div className='col-lg-4 col-md-6'>
                                                                                        <p><span>Reviewer :  </span>{formRenderValue.reviewerName}</p>
                                                                                    </div>
                                                                                    <div className='col-lg-4 col-md-6'>
                                                                                        <p><span>Approver :  </span>{formRenderValue.approverName}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ) : (null)}
                                                            </div>
                                                        }

                                                        <div className="tab-content perfomace_id_page">
                                                            {activeMainTab === "active" &&
                                                                <div className="center-part">
                                                                    <div className="card-body -body skolrup-learning-card-body oxyem-time-managment">
                                                                        {Array.isArray(formvalue.section) ? (
                                                                            <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
                                                                                {formvalue.section.map((section, index) => (
                                                                                    section.isVisible && (
                                                                                        <li key={index} className="nav-item">
                                                                                            <a
                                                                                                className={`nav-link ${activeTab === section.SectionName ? 'active' : ''}`}
                                                                                                onClick={() => handleTabClick(section.SectionName)}
                                                                                            >
                                                                                                <div className="skolrup-profile-tab-link">
                                                                                                    {section.SectionName}
                                                                                                    {section.SectionName === "Learning" && renderLength?.Learning > 0 &&
                                                                                                        <span className='tab_count_text'>{renderLength.Learning}</span>
                                                                                                    }

                                                                                                    {section.SectionName === "Performance" && renderLength?.Performance > 0 &&
                                                                                                        <span className='tab_count_text'>{renderLength.Performance}</span>
                                                                                                    }

                                                                                                    {section.SectionName === "Behavior" && renderLength?.Behavior > 0 &&
                                                                                                        <span className='tab_count_text'>{renderLength.Behavior}</span>
                                                                                                    }


                                                                                                </div>
                                                                                            </a>
                                                                                        </li>
                                                                                    )
                                                                                ))}
                                                                            </ul>

                                                                        ) : (
                                                                            null
                                                                        )}
                                                                        <div className="tab-content" >
                                                                            {formvalue.section.map((section, index) => (
                                                                                activeTab === section.SectionName && (
                                                                                    <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>                                                                                       
                                                                                            <div className="w-100 form_btn_arrow_bottom">
                                                                            <button onClick={toggleVisibilityBottom} className='toggle-button'>
                                                                                {isVisible ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                                                            </button>
                                                                        </div>
                                                                                            {isVisibleBottom && (
                                                                                            <div className='row'>
                                                                                                {activeTab !== "Summary" && (
                                                                                                    <>
                                                                                                    {statusLabel === "Open" && (
                                                                                                    <div className='col-md-12 col-lg-2'>
                                                                                                        <div className='add_line_performance'>
                                                                                                            <span className='btn btn-performance' onClick={() => handleAddRowData(activeTab)}>
                                                                                                                <IoAddCircleOutline /> Add Goal
                                                                                                            </span>
                                                                                                        </div>
                                                                                                        </div>
                                                                                                        )}
                                                                                                        </>
                                                                                                )}
                                                                                                {activeTab == "Summary" && (
                                                                                                    <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                                                                                        {listheader && Object.keys(listheader).length > 0 &&
                                                                                                            <table className="table">
                                                                                                                <thead>
                                                                                                                    <tr>
                                                                                                                        <th className="summay-table summay-table-bold">Category</th>
                                                                                                                        <th className="summay-table summay-table-bold">Open</th>
                                                                                                                        <th className="summay-table summay-table-bold">Close</th>
                                                                                                                    </tr>
                                                                                                                </thead>
                                                                                                                <tbody>
                                                                                                                    {["Performance", "Behavior", "Learning"].map((category) => (
                                                                                                                        <tr key={category}>
                                                                                                                            <td className="summay-table">{category}</td>
                                                                                                                            <td>{listheader?.[category]?.open ?? 0}</td>
                                                                                                                            <td>{listheader?.[category]?.closed ?? 0}</td>
                                                                                                                        </tr>
                                                                                                                    ))}
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        }
                                                                                                    </div>
                                                                                                )}



                                                                                                {activeTab == "Summary" && (
                                                                                                    <>
                                                                                                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                                                                                                            <div className='welcome_content_box'>
                                                                                                                <div className='icon_box_perform'>
                                                                                                                    <FaInfoCircle />
                                                                                                                </div>
                                                                                                                <div className='icon_box_perform_txt'>
                                                                                                                    <p><span>Welcome!</span> You have initiated the performance cycle.</p>
                                                                                                                    <p>As the next step, please follow the instructions below:</p>
                                                                                                                    <ul>
                                                                                                                        <li>Discuss and align your goals with your Reporting Manager.</li>
                                                                                                                        <li>Add goals under the <span>Performance</span>, <span>Behavior</span>, and <span>Learning</span> sections.</li>
                                                                                                                        <li> Ensure that the <span>total score for each section adds up to 100.</span></li>
                                                                                                                    </ul>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                                                            <div className="welcome-content-box-status">
                                                                                                                {Object.keys(goalCount).map((goal) => (
                                                                                                                    <div key={goal} className={`goal-progress-container`}>
                                                                                                                        <div className="goal-label">
                                                                                                                            <span>{goal}: </span>
                                                                                                                        </div>
                                                                                                                        <div className={`progress-bar-container mark_for_${goal}`}>
                                                                                                                            <div
                                                                                                                                className="progress-bar"
                                                                                                                                style={{ width: `${goalCount[goal]}%` }}
                                                                                                                            ></div>
                                                                                                                        </div>
                                                                                                                        <div className="goal-label-end">
                                                                                                                            <span>{goalCount[goal]}%</span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div></>
                                                                                                )}
                                                                                                {activeTab !== "Summary" && (
                                                                                                    <>
                                                                                                        <div className={`col-md-7 ${statusLabel !== "Open" ? "col-lg-7" : "col-lg-6"}`}>
                                                                                                            <div className='welcome_content_box'>
                                                                                                                <div className='icon_box_perform'>
                                                                                                                    <FaInfoCircle />
                                                                                                                </div>
                                                                                                                <div className='icon_box_perform_txt'>
                                                                                                                    <p><span>Welcome!</span> You have initiated the performance cycle.</p>
                                                                                                                    <p>As the next step, please follow the instructions below:</p>
                                                                                                                    <ul>
                                                                                                                        <li>Discuss and align your goals with your Reporting Manager.</li>
                                                                                                                        <li>Add goals under the <span>Performance</span>, <span>Behavior</span>, and <span>Learning</span> sections.</li>
                                                                                                                        <li> Ensure that the <span>total score for each section adds up to 100.</span></li>
                                                                                                                    </ul>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className={`col-md-5 ${statusLabel !== "Open" ? "col-lg-5" : "col-lg-4"}`}>
                                                                                                            <div className="welcome-content-box-status">
                                                                                                                {Object.keys(goalCount).map((goal) => (
                                                                                                                    <div key={goal} className={`goal-progress-container`}>
                                                                                                                        <div className="goal-label">
                                                                                                                            <span>{goal}: </span>
                                                                                                                        </div>
                                                                                                                        <div className={`progress-bar-container mark_for_${goal}`}>
                                                                                                                            <div
                                                                                                                                className="progress-bar"
                                                                                                                                style={{ width: `${goalCount[goal]}%` }}
                                                                                                                            ></div>
                                                                                                                        </div>
                                                                                                                        <div className="goal-label-end">
                                                                                                                            <span>{goalCount[goal]}%</span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </>
                                                                                                )}
                                                                                            </div>
                                                                                           )}
                                                                                        {isFormShowIs ? (
                                                                                            <>
                                                                                                {activeTab === "Summary" ? (
                                                                                                    <SummaryRender
                                                                                                        summaryValue={summaryValue}
                                                                                                        id={performanceId}
                                                                                                        refreshSummaryData={refreshSummaryData}
                                                                                                        buttonArray={section.buttons}
                                                                                                        handleCancel={handleCancel}
                                                                                                        handleNext={handleNext}
                                                                                                        handleCycleInitiate={handleCycleInitiate}
                                                                                                        renderLength={renderLength}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <>
                                                                                                        {section.Subsection.map((subsection, subsectionIndex) => (
                                                                                                            <div key={subsectionIndex}>
                                                                                                                {subsection.fields.length > 0 ? (
                                                                                                                    subsection.fields.map((field, fieldIndex) => (
                                                                                                                        <FieldRenderer
                                                                                                                            key={fieldIndex}
                                                                                                                            field={field}
                                                                                                                            index={index}
                                                                                                                            subsectionIndex={subsectionIndex}
                                                                                                                            fieldIndex={fieldIndex}
                                                                                                                            buttonArray={section.buttons}
                                                                                                                            handleFieldChange={handleFieldChange}
                                                                                                                            handleFileChange={handleFileChange}
                                                                                                                            handleGoalSubmit={handleGoalSubmit}
                                                                                                                            handleCancel={handleCancel}
                                                                                                                            handleNext={handleNext}
                                                                                                                            onDeleteClick={onDeleteClick}
                                                                                                                        />
                                                                                                                    ))
                                                                                                                ) : null}
                                                                                                            </div>
                                                                                                        ))}
                                                                                                        <div className="text-end w-100 mt-3">
                                                                                                            {section.buttons.map((buttonssection, buttonsIndex) => (
                                                                                                                buttonssection.buttontype === 'cancel' ? (
                                                                                                                    <button
                                                                                                                        key={buttonsIndex}
                                                                                                                        type="button"
                                                                                                                        className={`btn ${buttonssection.class}`}
                                                                                                                        disabled={buttonssection.isDisabled}
                                                                                                                        onClick={handleCancel}>
                                                                                                                        {buttonssection.label}
                                                                                                                    </button>
                                                                                                                ) : buttonssection.buttontype === 'next' ? (
                                                                                                                    <button
                                                                                                                        key={buttonsIndex}
                                                                                                                        type="submit"
                                                                                                                        className={`btn ${buttonssection.class}`}
                                                                                                                        disabled={buttonssection.isDisabled}
                                                                                                                        onClick={handleNext}>
                                                                                                                        {buttonssection.label}
                                                                                                                    </button>
                                                                                                                ) : null
                                                                                                            ))}

                                                                                                        </div>

                                                                                                    </>
                                                                                                )}



                                                                                            </>
                                                                                        ) : (
                                                                                            <span className="loader-oxyem"></span>
                                                                                        )}
                                                                                    </div>
                                                                                )
                                                                            ))}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
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
            </div >
            <Tooltip id="my-tooltip" style={{ maxWidth: "300px", backgroundColor: "#7030a0", background: "#7030a0" }} />
            <Toaster
                position="top-right"
                reverseOrder={false}

            />
        </>
    );
}

export async function getServerSideProps(context) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'initiatePerformance' }, context);
    return {
        props: { userFormdata },
    }
}