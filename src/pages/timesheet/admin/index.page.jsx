import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbsdiscription';
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { FaTimes } from "react-icons/fa";
import View from '../../Components/Popup/AssignmemberHistroy';
import FilterBar from './FilterBar';
import dynamic from 'next/dynamic';
import { MdNotStarted } from "react-icons/md";
import { Toaster, toast } from 'react-hot-toast';
import Head from 'next/head';
import { MdTaskAlt, MdArrowForwardIos } from "react-icons/md";
import { RiProgress3Line } from "react-icons/ri";
import { CgCalendarDue } from "react-icons/cg";
import { FaRegCheckSquare } from "react-icons/fa";
import { CiNoWaitingSign } from "react-icons/ci";
export default function adminDashboard({ }) {

    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleEditClick = (id) => {
        router.push(`/timesheet/admin/${id}`);
    };
    const [isModalViewOpen, setIsModalViewOpen] = useState(false);
    const [isAssignViewMemId, setIsAssignViewId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignMemId, setIsAssignId] = useState("");
    const onViewClick = async (id) => {
        router.push(`/timesheet/admin/view/${id}`);
    }
    const handleViewAssignReq = async (id) => {
        setIsAssignId(id)
        openAssignpopup()
    }
    const openAssignpopup = async () => {
        setIsModalOpen(true)
    }
    const openAssignViewpopup = async () => {
        setIsModalViewOpen(true)
    }
    const closeAssignViewpopup = async () => {
        setIsModalViewOpen(false)
    }
    const closeAssignpopup = async () => {
        setIsModalOpen(false)
    }

    const handleApprrovereq = async (id, type, data, onSuccess) => {

        const apipayload = {
            "status": type,
            "idTimesheet": id,
            "rejectReason": data
        }
        const message = type === 'approved'
            ? 'You have successfully <strong>Approved</strong> attendance!'
            : 'You have successfully <strong>Rejected</strong> attendance!';
        const errormessage = 'Error connecting to the backend. Please try after Sometime.';
        try {
            const response = await axiosJWT.post(`${apiUrl}/timesheet/approval`, apipayload);
            // Handle the response if needed
            if (response) {
                onSuccess("clear");
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <img src='/assets/img/proposal-icon.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                        <button
                            onClick={() => toast.dismiss(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
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
                        border: '1px solid #4caf50',
                        padding: '8px',
                        color: '#4caf50',
                    },
                });

                fetchData();
            }

        } catch (error) {
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
            // Handle the error if any
            console.error("Error occurred:", error);
        }
    }
    const handletaskInfoReq = (id) => {
        router.push(`/TimeManagement/${id}`);
    };
    const [activeTab, setActiveTab] = useState("needAttention"); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };
    const [pickstatus, setPickStatus] = useState("All");
    const [filterValue, setFilterValue] = useState({});
    const GetFilterValue = (value) => {
        if (value.status === "completed") {
            setActiveTab("completed")
        }
        if (value.status === "overdue") {
            setActiveTab("needAttention")
        }
        setPickStatus(value.status)
        setFilterValue(value)
    };
    const [STATUS_API, setStatus] = useState([]);
    const GetStatusValue = (value) => {
        setStatus(value)
    };

    const getStatusIcon = (statusId) => {
        switch (statusId) {
            case "open":
                return <MdNotStarted />;

            case "inProgress":
                return <RiProgress3Line />;

            case "overdue":
                return <CgCalendarDue />;

            case "completed":
                return <FaRegCheckSquare />;

            case "onHold":
                return <CiNoWaitingSign />;

            default:
                return null;
        }
    };
    const [statData, setStatData] = useState("");
    const fetchApiText = async () => {
        let cleanedtabParamsInObj = {};
        if (filterValue && typeof filterValue === 'object') {
            cleanedtabParamsInObj = Object.fromEntries(
                Object.entries(filterValue).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
            );
        }
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/timesheet/getAdminChart`, { params: {"isStatusFor":activeTab, ...cleanedtabParamsInObj } });
            if (response) {
                setStatData(response.data.data)
            }
        } catch (err) {
            ;
        }
    };
    useEffect(() => {
        fetchApiText();

    }, [filterValue, activeTab]);
    const direction = statData?.effortsAllocated?.wowDirection;
    const directionLogged = statData?.effortsLogged?.direction;
    return (
        <>
            <Head>
                <title>Task Management Dashboard | Oxytal</title>
                <meta name="description" content={"Access the admin task dashboard to monitor task assignments, progress, priorities, deadlines, and team workload efficiently."} />
            </Head>
            <View isOpen={isModalOpen} closeModal={closeAssignpopup} isHistroyId={isAssignMemId} section={"employeeAttendance"} />
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row oxyem-tasks-dashboard-header">
                            <div className="col-12">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-timesheet-status-section mt-4">
                                    <div className="center-part">
                                        <div className="card-body">
                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border">
                                                <Breadcrumbs
                                                    maintext={"Task & Workload Dashboard"}
                                                    discription={"Monitor all tasks across teams, notions from admin, dashborad."}
                                                    icon={<MdTaskAlt />}
                                                    addlink={"/timesheet/admin/add"}
                                                    bottomLink={"hide"}
                                                />
                                                <FilterBar GetFilterValue={GetFilterValue} GetStatusValue={GetStatusValue} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="main-timesheet-dashboard">
                            <div className="table-stats-wrapper">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-timesheet-status-section">
                                    <div className="center-part">
                                        <div className="card-body">
                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border">
                                                <div class="row g-3">
                                                    <div class="col-md-6 col-lg-6 col-xxl-3">
                                                        <div class="oxyem-stat-card oxyem-stat-success">
                                                            <div class="d-flex justify-content-between">
                                                                <h6>Allocated Effort</h6>
                                                            </div>
                                                            <div className='d-flex align-items-end my-2'>
                                                                <h2>{Math.trunc(statData?.effortsAllocated?.totalEffortAllocated ?? 0)} <small>hrs</small></h2>

                                                                <p
                                                                    className={`mb-0 ${direction === "DOWN" ? "text-danger" : "text-success"
                                                                        }`}
                                                                >
                                                                    {direction === "UP" && "▲"}
                                                                    {direction === "DOWN" && "▼"}
                                                                    {direction === "NO_CHANGE" && " "}
                                                                    {statData?.effortsAllocated?.wowPercentage || 0}% WoW
                                                                </p>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6 col-lg-6 col-xxl-3">
                                                        <div class="oxyem-stat-card oxyem-stat-warning">
                                                            <div class="d-flex justify-content-between">
                                                                <h6>Logged Effort</h6>
                                                            </div>
                                                            <div className='d-flex align-items-center my-2'>
                                                                <h2>{Math.trunc(statData?.effortsLogged?.totalEffortsLogged ?? 0)} <small>hrs</small></h2>
                                                               
                                                               <p
                                                                    className={`mb-0 ${directionLogged === "DOWN" ? "text-danger" : "text-success"
                                                                        }`}
                                                                >
                                                                    {direction === "UP" && "▲"}
                                                                    {direction === "DOWN" && "▼"}
                                                                    {direction === "NO_CHANGE" && " "}
                                                                    {statData?.effortsLogged?.percentage || 0}% vs plan
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="col-md-6 col-lg-6 col-xxl-3">
                                                        <div class="oxyem-stat-card oxyem-stat-danger">
                                                            <div class="d-flex justify-content-between">
                                                                <h6>Utilization</h6>
                                                                <span class="badge bg-danger">!</span>
                                                            </div>
                                                            <div className='d-flex align-items-center my-2'>
                                                                <h2>{Math.trunc(statData?.utilization?.utilization ?? 0)}%</h2>
                                                                <p class="mb-0 text-danger">
                                                                    ⚠ Action Needed!
                                                                </p>
                                                            </div>
                                                            <small>Below target {statData?.utilization?.target || 0}%</small>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6 col-lg-6 col-xxl-3">
                                                        <div class="oxyem-stat-card oxyem-stat-orange">
                                                            <div class="d-flex justify-content-between">
                                                                <h6>Overdue Tasks</h6>
                                                            </div>
                                                            <h2>{statData?.overdueTasks || 0} <small>Tasks</small></h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec oxyem-timesheet-dashboard-table">
                                    <ul className="nav-tabs nav nav-tabs-bottom justify-content-start oxyem-graph-tab">
                                        <li class={`nav-item ${activeTab === "needAttention" ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTabClick("needAttention")}>
                                                <div className="skolrup-profile-tab-link">Needs Attention</div>
                                            </a>
                                        </li>
                                        <li class={`nav-item ${activeTab === "allTask" ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTabClick("allTask")}>
                                                <div className="skolrup-profile-tab-link"> All Tasks</div>
                                            </a>
                                        </li>
                                        <li class={`nav-item ${activeTab === "completed" ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTabClick("completed")}>
                                                <div className="skolrup-profile-tab-link"> Completed</div>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        {activeTab === "needAttention" &&
                                            <div>
                                                <CustomDataTable
                                                    title={""}
                                                    ismodule={'timesheet'}
                                                    onEditClick={handleEditClick}
                                                    onViewClick={onViewClick}
                                                    //onHistoryClick={handleHistoryClick}
                                                    handleApprrovereq={handleApprrovereq}
                                                    handleViewAssignReq={handleViewAssignReq}
                                                    handletaskInfoReq={handletaskInfoReq}
                                                    dashboradApi={'/timesheet/list'}
                                                    isStatusFor={activeTab}
                                                    tabParamsInObj={filterValue}
                                                />
                                            </div>
                                        }
                                        {activeTab === "allTask" &&
                                            <div>
                                                <CustomDataTable
                                                    title={""}
                                                    ismodule={'timesheet'}
                                                    onEditClick={handleEditClick}
                                                    onViewClick={onViewClick}
                                                    //onHistoryClick={handleHistoryClick}
                                                    handleApprrovereq={handleApprrovereq}
                                                    handleViewAssignReq={handleViewAssignReq}
                                                    handletaskInfoReq={handletaskInfoReq}
                                                    dashboradApi={'/timesheet/list'}
                                                    isStatusFor={activeTab}
                                                    tabParamsInObj={filterValue}
                                                />
                                            </div>
                                        }
                                        {activeTab === "completed" &&
                                            <div>
                                                <CustomDataTable
                                                    title={""}
                                                    ismodule={'timesheet'}
                                                    onEditClick={handleEditClick}
                                                    onViewClick={onViewClick}
                                                    //onHistoryClick={handleHistoryClick}
                                                    handleApprrovereq={handleApprrovereq}
                                                    handleViewAssignReq={handleViewAssignReq}
                                                    handletaskInfoReq={handletaskInfoReq}
                                                    dashboradApi={'/timesheet/list'}
                                                    isStatusFor={activeTab}
                                                    tabParamsInObj={filterValue}
                                                />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="oxyem-info-sidebar">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-timesheet-status-section">
                                    <div className="center-part">
                                        <div className="card-body">
                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border">
                                                <div class="attention-card">
                                                    <div class="card-header-oxyem d-flex justify-content-between align-items-center bg-white">
                                                        <div class="d-flex align-items-center gap-2">
                                                            <span class="badge bg-danger">{Math.trunc(statData?.utilization?.action ?? 0)}</span>
                                                            <strong>Needs Attention</strong>
                                                        </div>
                                                    </div>

                                                    <div class="card-body-oxyem">
                                                        <div class="attention-row">
                                                            <div>
                                                                <span class="text-danger fw-bold">{statData?.overdueTasks || 0}</span> Overdue Tasks
                                                            </div>
                                                        </div>
                                                        <div class="attention-row">
                                                            <div className='attention-row-flex'>
                                                                <span class="text-primary fw-bold"></span> Task Logging {Math.trunc(statData?.effortsLogged?.totalEffortsLogged ?? 0)} Hours
                                                            </div>
                                                        </div>

                                                        <hr />

                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <div className='attention-row-flex-bottom'>
                                                                <h6 class="mb-1">Team Utilization</h6>
                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                    <div class="oxyem-progress-ring-container">
                                                                        <h2 class="mb-0">{Math.trunc(statData?.utilization?.utilization ?? 0)}%</h2>
                                                                        <small class="text-muted">(Below Target)</small>
                                                                        <div class="mt-2 text-danger small">
                                                                            Utilized – <span>{Math.trunc(statData?.utilization?.target ?? 0)}%</span>
                                                                        </div>
                                                                    </div>
                                                                   <div
  className="oxyem-progress-ring"
  style={{
    "--value": Math.trunc(statData?.utilization?.utilization ?? 0),
  }}
>
  <span>
    {Math.trunc(statData?.utilization?.utilization ?? 0)}%
  </span>
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
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-timesheet-status-section-b0ttom">
                                    <div className="center-part">
                                        <div className="card-body">
                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border">
                                                <div class="status-wrapper-oxyem">
                                                    <div class="status-header-oxyem">
                                                        <i class="bi bi-sliders"></i>
                                                        <span>Quick Filter</span>
                                                        <i class="bi bi-chevron-down ms-auto"></i>
                                                    </div>
                                                    <div class="status-list">
                                                        {STATUS_API.filter(s => s.id !== "ALL").map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className={`status-item ${item.id === "overdue" ? "status-danger" : ""
                                                                    } ${pickstatus === item.id ? "active" : "c"}`}
                                                                onClick={() =>
                                                                    GetFilterValue({
                                                                        ...filterValue,
                                                                        status: item.id,
                                                                    })
                                                                }
                                                            >
                                                                <div className="status-item-icon">
                                                                    {getStatusIcon(item.id)}
                                                                    <span className="mx-1">{item.name}</span>
                                                                    {item.id === "overdue" && <span className="fire">🔥</span>}
                                                                </div>
                                                                <MdArrowForwardIos />
                                                            </div>
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
            <Toaster
                position="top-right"
                reverseOrder={false}

            />
        </>
    );
}
