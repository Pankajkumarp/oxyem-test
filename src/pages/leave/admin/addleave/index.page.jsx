import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import Apialert from '../../../Components/Errorcomponents/Apierror'
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
import { fetchWithToken } from '../../../Auth/fetchWithToken.jsx';
import Head from 'next/head';
import pageTitles from '../../../../common/pageTitles.js';
import { FaRegCheckCircle } from "react-icons/fa";
import Breadcrumbs from '../../../Components/Breadcrumbs/Breadcrumbsdiscription.jsx';
import FormRenderer from "../../../Components/FormRender/TemplateOne/FormRenderer";
import { MdAssignmentInd } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Profile from '../../../Components/commancomponents/profile.jsx';
export default function addleave() {
    const [formShow, setFormShow] = useState(false);
    const [leaveFormdata, setLeaveFormdata] = useState({});
    useEffect(() => {
        fetchForm();
    }, []);

    const fetchForm = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, {
                params: { formType: "applyAdminLeave" },
            });

            if (response.status === 200 && response.data.data) {
                setLeaveFormdata(response.data.data);
                setFormShow(true)
            }
        } catch (error) {
        }
    };
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };
    const [toplist, setToplist] = useState({});
    const [fromDate, setFromDate] = useState(getToday());
    const [toDate, setToDate] = useState();
    const [empLeaveInfo, setEmpLeaveInfo] = useState([]);
    const fetchLeaveEmp = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/leave/myTeamLeaveInfo`, {
                params: { fromDate: fromDate, toDate: toDate },
            });
            if (response) {
                setEmpLeaveInfo(response.data.data || {});
            }
        } catch (error) {
        }
    };
    useEffect(() => {
        fetchLeaveEmp()
    }, [fromDate, toDate]);
    const fetchstatForm = async (empId) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/leave/getStats`, {
                params: { isFor: "self", idEmployee: empId },
            });
            if (response) {
                setToplist(response.data.data || {});
            }
        } catch (error) {
        }
    };
    const [alert, setAlert] = useState({
        message: '',
        type: '',
        show: false
    });

    const showAlert = (errtype, msg) => {
        setAlert({ show: true, type: errtype, message: msg });
    };

    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [errorMessage, seterrorMessage] = useState("");

    const [SubmitLoading, setSubmitLoading] = useState(false);
    const getEmployeeID = (empId) => {
        fetchstatForm(empId);
    }
    const transformLeavePayload = (values) => {
        return {
            feature: "Admin_Leave",
            section: [
                {
                    SectionName: "leave",
                    fields: Object.entries(values)
                        .filter(([_, value]) => value !== "" && value !== null)
                        .map(([key, value]) => ({
                            name: key,
                            attributeValue: value
                        }))
                }
            ]
        };
    };

    const submitformdata = async (payloadValue) => {
        setSubmitLoading(true)
        const payload = transformLeavePayload(payloadValue);
        try {
            const response = await axiosJWT.post(`${apiUrl}/leave`, payload)
            const apiresponse = response.data != "" ? response.data : "";
            const message = 'You have successfully <strong>Added </strong> Leave!';
            const errormessage = 'Error connecting to the backend. Please try after Sometime.';
            if (apiresponse.success == true) {
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
                    icon: null, // Disable default icon
                    duration: 7000,
                    style: {
                        border: '1px solid #4caf50',
                        padding: '8px',
                        color: '#4caf50',
                    },
                });
                router.push('/leave/admin')
                setSubmitLoading(false)


            } else {
                setSubmitLoading(false);
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                        <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
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
                showAlert('danger', apiresponse.errors)
                setTimeout(() => {
                    showAlert('', '');
                }, 10000);
            }
        } catch (error) {
            setSubmitLoading(false);
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
            let errorMessage = "Something went wrong";

            if (error?.response?.data?.errors) {
                errorMessage = error.response.data.errors;
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data) {
                errorMessage = error.response?.data;
            }

            showAlert("danger", errorMessage);
            setTimeout(() => {
                showAlert('', '');
            }, 10000);
        } finally {
            setSubmitLoading(false);
        }
    }
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'leave-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);
    const handleCancelClick = async () => {
        router.push(`/leave/admin`);
    };
    const onClickGetDateInfo = async (fromDate, toDate) => {
        if (fromDate !== "" && fromDate !== undefined) {
            setFromDate(fromDate)
        }
        if (toDate !== "" && toDate !== undefined) {
            setToDate(toDate)
        }
    };
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [day, month] = dateStr.split("-");
        return `${day} ${month}`;
    };
    return (
        <>
            <Head><title>{pageTitles.LeavesApplyLeave}</title></Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid oxyem-custom-breadcrumb">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="col">
                                    <Breadcrumbs
                                        maintext={"Apply Leave on Behalf of Employee"}
                                        discription={"Submit a leave request for an employee by selecting the leave type, leave dates, and reason for approval."}
                                        icon={<MdAssignmentInd />}
                                    />
                                </div>
                                <div className="row d-flex align-items-stretch">
                                    <div className="col-12 col-lg-7 col-xl-8">
                                        {formShow ? (
                                            <div className="w-100 h-100">
                                                <Apialert
                                                    type={alert.type}
                                                    message={alert.message}
                                                    show={alert.show} />
                                                {errorMessage !== "" ? (<div className="alert alert-danger alert-dismissible fade show" role="alert">{errorMessage}  <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></div>) : (null)}
                                                <FormRenderer schema={leaveFormdata} handeSubmit={submitformdata} sumbitStart={SubmitLoading} isFor={"applyLeave"} isPage={"admin"} onClickGetEmployeeId={getEmployeeID} handleCancelClick={handleCancelClick} onClickGetDateInfo={onClickGetDateInfo} />
                                            </div>) : (
                                            <div className="w-100 h-100 comman-form-loader-wrapper">
                                                <div className="form-loader">
                                                    <div className="spinner"></div>
                                                    <p>Loading form…</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-12 col-lg-5 col-xl-4">
                                        <div className="sidebar-info-section h-100 w-100">
                                            <h5 className="info-main-text">Quick Info</h5>
                                            <div className="leave-cards">
                                                <div className="leave-card earned">
                                                    <div className="card-left">
                                                        <span className="icon success">✔</span>
                                                        <div>
                                                            <div className="title">Earned Leaves</div>
                                                            <div className="value">You have <span className="big">{toplist?.TotalRemainingLeave}</span> days of earned leave available.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="leave-card">
                                                    <div className="card-left">
                                                        <span className="icon calendar">📅</span>
                                                        <div>
                                                            <div className="title">Birthday Leave</div>

                                                            {toplist?.BirthDayLeaves > 0 ? (
                                                                <div className="status available">
                                                                    Your birthday leave is ready to use 🎉
                                                                </div>
                                                            ) : (
                                                                <div className="status not-available">
                                                                    You’ve already taken your birthday leave this year 🎂
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="leave-card">
                                                    <div className="card-left">
                                                        <span className="icon warning">⚠</span>
                                                        <div>
                                                            <div className="title">Unpaid Leave</div>
                                                            <div className="value">
                                                                {toplist?.LossOfPayLeaves > 0 ? (<>You’ve taken <span className="big warning-text">{toplist?.LossOfPayLeaves}</span> days of unpaid leave</>) : (<>Great job! No unpaid leave taken so far.</>)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="badge-lop">LOP</span>
                                                </div>
                                                {toplist?.TotalPaternityLeaves !== undefined ? (
                                                    <div className="leave-card">
                                                        <div className="card-left">
                                                            <span className="icon calendar">👶</span>
                                                            <div>
                                                                <div className="title">Paternity Leaves</div>
                                                                <div className="value">
                                                                    {toplist?.TotalPaternityLeaves > 0 ? (<>You’ve taken <span className="big warning-text">{toplist?.TotalPaternityLeaves}</span> days of Paternity leave</>) : (<>You haven’t used your paternity leave yet.</>)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (null)}
                                                {toplist?.TotalMaternityLeaves !== undefined ? (
                                                    <div className="leave-card">
                                                        <div className="card-left">
                                                            <span className="icon calendar">🤱</span>
                                                            <div>
                                                                <div className="title">Maternity Leaves</div>
                                                                <div className="value">
                                                                    {toplist?.TotalMaternityLeaves > 0 ? (<>You’ve taken <span className="big warning-text">{toplist?.TotalMaternityLeaves}</span> days of Maternity leave</>) : (<>You haven’t used your Maternity leave yet.</>)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (null)}
                                                <div className="leave-card-team leave-card">
                                                    <h4><FaUserFriends />Team availability</h4>
                                                    <div className='inner-data-l'>
                                                        {empLeaveInfo?.length !== 0 ? (<p>These teammates are on leave during your select dates:</p>) : null}
                                                        {empLeaveInfo?.length === 0 ? (
                                                            <div className="empty-msg">
                                                                Your team is fully available during this period🎉
                                                            </div>
                                                        ) : (
                                                            empLeaveInfo.map((leave) => (
                                                                <div key={leave.fromDate} className="leave-card-info">
                                                                    <Profile name={leave?.employeeName} imageurl={leave?.profilePicPath} size={28} />
                                                                    <div className='name-emp-list'>
                                                                        {leave?.employeeName}
                                                                    </div>
                                                                    <div className='name-type-list'>{leave?.leaveType}</div>
                                                                    <div className='name-date-list'>{formatDate(leave?.fromDate)} {leave?.toDate && ` → ${formatDate(leave.toDate)}`}</div>
                                                                </div>
                                                            ))
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
        </>
    );
}
