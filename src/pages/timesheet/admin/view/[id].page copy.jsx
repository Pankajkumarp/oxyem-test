import { useState, useEffect } from 'react';
import Breadcrumbs from '../../../Components/Breadcrumbs/Breadcrumbsdiscription';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { GoProject } from "react-icons/go";
import { FaUser, FaRegCheckCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FcTimeline } from "react-icons/fc";
import { format } from "date-fns";
import { countWorkingDays } from "../../../Components/Hooks/countWorkingDays";
import { MdArrowForwardIos } from "react-icons/md";
import { MdOutlineDescription } from "react-icons/md";
import GanttChart from '../add/Gannt-chart.jsx';
import { LuDot } from "react-icons/lu";
import { RiProgress2Fill } from "react-icons/ri";
export default function viewDashboard({ }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d) ? "" : format(d, "dd MMM yyyy");
    };
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [data, setData] = useState([]);
    const [subTaskData, setSubTaskData] = useState({});
    const [loadingSubTask, setLoadingSubTask] = useState(null);
    const [idProject, setidProject] = useState("");
    const [viewDetail, setViewDetails] = useState({});
    const [totalTask, settotalTask] = useState(0);
    const [totalUsers, settotalUsers] = useState(0);
    const [planHours, setplanHours] = useState(0);
    const [submitHours, setsubmitHours] = useState(0);
    const getWorkStatus = (taskPercentage, submittedPercentage) => {
        const planned = Number(taskPercentage);
        const submitted = Number(submittedPercentage);

        if (submitted === 0) return "Not Started";
        if (submitted < planned) return "In Progress";
        return "Completed";
    };
    const [showChart, setShowChart] = useState(false);
    const getSubTasks = async (idTaskProject) => {
        try {
            setLoadingSubTask(idTaskProject);

            const res = await axiosJWT.get(
                `${apiUrl}/timesheet/getSubTaskInfo`,
                {
                    params: { idTaskProject }
                }
            );

            if (res?.data?.status === 200) {
                setSubTaskData(prev => ({
                    ...prev,
                    [idTaskProject]: res.data.data.subTasks
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSubTask(null);
        }
    };

    const getProjectValue = async (id) => {
        try {

            const response = await axiosJWT.get(`${apiUrl}/timesheet/viewFullTaskInfo`, {
                params: {
                    idAssignTask: id,
                },
            });
            if (response) {
                const apiResponse = response.data.data
                setplanHours(apiResponse?.totalEffortsAllocated.toFixed(2));
                setsubmitHours(apiResponse?.totalEffortsSubmitted.toFixed(2));
                setViewDetails(apiResponse)
                setidProject(apiResponse.idProject)
                const taskList = apiResponse.taskList || [];
                setData(taskList);
                const totalTasks = taskList.length;
                settotalTask(totalTasks);
                const uniqueUserSet = new Set();

                taskList.forEach(task => {
                    task.assignedTo?.forEach(user => {
                        uniqueUserSet.add(user.idEmployee);
                    });
                });

                const totalUsers = uniqueUserSet.size;
                settotalUsers(totalUsers);
                setShowChart(true)
            }

        } catch (error) {

        }
    }
    const [openTask, setOpenTask] = useState(null);

    const toggleTask = (taskCode) => {
        setOpenTask(openTask === taskCode ? null : taskCode);
    };
    useEffect(() => {
        if (viewDetail?.taskList?.length > 0) {
            setOpenTask(viewDetail.taskList[0].taskCode);
        }
    }, [viewDetail]);
    useEffect(() => {
        const { id } = router.query;
        getProjectValue(id);
    }, [router.query.id]);


    const getSubmittedPercentage = (submittedHours, plannedHours) => {
        const submitted = Number(submittedHours);
        const planned = Number(plannedHours);

        if (!submitted || !planned || planned <= 0) return 0;

        return Math.min(100, Math.round((submitted / planned) * 100));
    };

    const getProgressPercentage = (submitted, planned) => {
        if (!planned || planned <= 0) return 0;

        return Math.min((submitted / planned) * 100, 100);
    };
    return (
        <>
            <Head>
                <title>Task Management Dashboard | Oxytal</title>
                <meta name="description" content={"Access the admin task dashboard to monitor task assignments, progress, priorities, deadlines, and team workload efficiently."} />
            </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs
                            maintext={"View Timesheet Details"}
                            discription={"View detailed information about logged tasks, working hours, and timelines for this timesheet."}
                            icon={<HiOutlineViewfinderCircle />}
                            addlink={"/TimeManagement"}
                        />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-timesheet-view-page">
                                    <div class="center-part">
                                        <div class="card-body">
                                            <div class="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

                                                <div className='timesheet-view-header'>
                                                    <div className='timesheet-head-box timesheet-head-total-task'>
                                                        <div className='head-overview-icon'>
                                                            <img src='/assets/img/total-task.png' alt='Total Task' />
                                                        </div>
                                                        <div className='head-overview-text'>
                                                            <h2 className='head-text-box'>Total Task</h2>
                                                            <p className='head-count-text'>{totalTask}</p>
                                                        </div>
                                                    </div>
                                                    <div className='timesheet-head-box timesheet-head-user'>
                                                        <div className='head-overview-icon'>
                                                            <img src='/assets/img/multi-user.png' alt='Assigned User' />
                                                        </div>
                                                        <div className='head-overview-text'>
                                                            <h2 className='head-text-box'>Assigned User</h2>
                                                            <p className='head-count-text'>{totalUsers}</p>
                                                        </div>
                                                    </div>
                                                    <div className='timesheet-head-box timesheet-head-plan'>
                                                        <div className='head-overview-icon'>
                                                            <img src='/assets/img/plan-time.png' alt='Planed Hours' />
                                                        </div>
                                                        <div className='head-overview-text'>
                                                            <h2 className='head-text-box'>Planed Hours</h2>
                                                            <p className="head-count-text">
                                                                {planHours}
                                                                <span>hrs</span>
                                                            </p>

                                                        </div>
                                                    </div>
                                                    <div className='timesheet-head-box timesheet-head-plan-submitted'>
                                                        <div className='head-overview-icon'>
                                                            <img src='/assets/img/submit-hours.png' alt='Submitted Hours' />
                                                        </div>
                                                        <div className='head-overview-text'>
                                                            <h2 className='head-text-box'>Submitted Hours</h2>
                                                            <div className='head-count-text head-count-text-with-progressbar'>{submitHours}<span>hrs</span>
                                                                <div className='progress-bar-timesheet-box'>
                                                                    <span className='progrees-top-text-s'>{submitHours} / {planHours} hrs</span>
                                                                    <div className="timesheet-progress">
                                                                        <div
                                                                            className="timesheet-progress-fill"
                                                                            style={{
                                                                                width: `${planHours > 0
                                                                                    ? Math.min((submitHours / planHours) * 100, 100)
                                                                                    : 0
                                                                                    }%`
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <span className='progrees-top-text-b'> {(getProgressPercentage(submitHours, planHours) ?? 0).toFixed(2)}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-timesheet-view-page">
                                    <div class="center-part">
                                        <div class="card-body">
                                            <div class="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                <h2 className='head-text-box'>Timesheet Details</h2>
                                                <div className='timesheet-view-datails-box-main'>
                                                    <div className='timesheet-view-datail-box'>
                                                        <div className='timesheet-view-datail-icon'><GoProject /></div>
                                                        <div className='timesheet-view-datail-content'>
                                                            <h4 className='timesheet-view-datail-head'>Project Name</h4>
                                                            <p className='timesheet-view-datail-text'>{viewDetail?.projectName}</p>
                                                        </div>
                                                    </div>
                                                    <div className='timesheet-view-datail-box'>
                                                        <div className='timesheet-view-datail-icon'><MdOutlineDescription /></div>
                                                        <div className='timesheet-view-datail-content'>
                                                            <h4 className='timesheet-view-datail-head'>Task Description</h4>
                                                            <p className='timesheet-view-datail-text'>{viewDetail?.timesheetDescription}</p>
                                                        </div>
                                                    </div>
                                                    <div className='timesheet-view-datail-box'>
                                                        <div className='timesheet-view-datail-icon'><FaUser /></div>
                                                        <div className='timesheet-view-datail-content'>
                                                            <h4 className='timesheet-view-datail-head'>Owner</h4>
                                                            <p className='timesheet-view-datail-text text-capitalize'>{viewDetail?.projectCreatedBy}</p>
                                                        </div>
                                                    </div>
                                                    <div className='timesheet-view-datail-box'>
                                                        <div className='timesheet-view-datail-icon'><FcTimeline /></div>
                                                        <div className='timesheet-view-datail-content'>
                                                            <h4 className='timesheet-view-datail-head'>Duration</h4>
                                                            <p className='timesheet-view-datail-text'>{formatDate(viewDetail?.startDate)} - {formatDate(viewDetail?.endDate)}</p>
                                                        </div>
                                                    </div>
                                                    <div className='timesheet-view-datail-box'>
                                                        <div className='timesheet-view-datail-icon'><FaRegCheckCircle /></div>
                                                        <div className='timesheet-view-datail-content'>
                                                            <h4 className='timesheet-view-datail-head'>Status</h4>
                                                            <p className='timesheet-view-datail-text'><span className={`status-view-timesheet status-view-${viewDetail?.status}`}>{
                                                                viewDetail?.status === "open" ? (
                                                                    <FaCheckCircle />
                                                                ) : viewDetail?.status === "closed" ? (
                                                                    <FaTimesCircle />
                                                                ) : (
                                                                    <RiProgress2Fill />
                                                                )
                                                            }
                                                                {viewDetail?.status}</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-timesheet-view-page">
                                    <div class="center-part">
                                        <div class="card-body oxyem-mobile-card-body">
                                            <ul
                                                className="nav nav-tabs nav-tabs-bottom nav-justified skolrup-profile-follower-tab"
                                                id="myTab"
                                                role="tablist"
                                            >
                                                <li className="nav-item" role="presentation">
                                                    <a
                                                        className="nav-link active"
                                                        id="assign-tab"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#assign"
                                                        role="tab"
                                                        aria-controls="assign"
                                                        aria-selected="true"
                                                    >
                                                        Task Assignment Details
                                                    </a>
                                                </li>

                                                <li className="nav-item" role="presentation">
                                                    <a
                                                        className="nav-link"
                                                        id="view-tab"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#view"
                                                        role="tab"
                                                        aria-controls="view"
                                                        aria-selected="false"
                                                    >
                                                        Gantt Chart
                                                    </a>
                                                </li>
                                            </ul>
                                            <div className="tab-content view-timesheet-tabs" id="myTabContent">
                                                <div
                                                    className="tab-pane fade show active"
                                                    id="assign"
                                                    role="tabpanel"
                                                    aria-labelledby="assign-tab"
                                                >

                                                    <div class="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <h3 className='head-text-box mt-3'>Task Assignment Details</h3>
                                                        <div className="table-responsive custom-made-table">
                                                            {viewDetail?.taskList?.map((task, idx) => (
                                                                <div key={task.taskCode} className="main-collapse-box-timesheet">
                                                                    <div
                                                                        className="collapse-box-timesheet-btn"
                                                                        onClick={() => toggleTask(task.taskCode)}
                                                                    >
                                                                        <div>
                                                                            <span className='tab-sn-text'>{1 + idx}.</span>
                                                                            <span className='tab-sn-text-heading-t'><strong>{task.taskName} {task.taskCode}</strong></span>
                                                                            <span className="collapse-box-timesheet-s">
                                                                                <b>({task.taskCode}) <MdArrowForwardIos /> {task.assignedTo?.length}</b> Assignees <LuDot />
                                                                                <span ><b>{(task?.totalEffortsAllocated ?? 0).toFixed(2)}</b> planned hrs</span><LuDot />
                                                                                <b>{(task?.totalEffortsSubmitted ?? 0).toFixed(2)}</b> submitted hrs</span>
                                                                        </div>

                                                                        <div className="collapse-box-timesheet-btn-icon">
                                                                            <span className={`oxyem-mark-${task.status}`}>
                                                                                {task.status}
                                                                            </span>
                                                                            {openTask === task.taskCode ? (
                                                                                <IoIosArrowUp />
                                                                            ) : (
                                                                                <IoIosArrowDown />
                                                                            )}
                                                                        </div>

                                                                    </div>

                                                                    {/* Collapse Content */}
                                                                    {openTask === task.taskCode && (
                                                                        <div className="table-responsive table-sub-task-view">
                                                                            <table className="table table-bordered mb-0">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>Sr No</th>
                                                                                        <th>Employee Name</th>
                                                                                        <th>Planned Effort (hrs)</th>
                                                                                        <th>Submitted Effort (hrs)</th>
                                                                                        <th>Duration</th>
                                                                                        <th>Work Status</th>
                                                                                        <th>Indicator</th>
                                                                                        <th>Risk</th>
                                                                                        <th></th>
                                                                                    </tr>
                                                                                </thead>

                                                                                <tbody>
                                                                                    {task.assignedTo?.map((emp, idxTask) => (
                                                                                        <>
                                                                                            <tr key={emp.idEmployee}>
                                                                                                <td>{idxTask + 1}</td>
                                                                                                <td className='text-capitalize'>{emp.employeeName}</td>
                                                                                                <td>
                                                                                                    {(emp?.totalEffortsAllocated ?? 0)}
                                                                                                </td>

                                                                                                <td>{(emp?.totalEffortsSubmitted ?? 0)}</td>
                                                                                                <td>{formatDate(task.startDate)} - {formatDate(task.endDate)}</td>
                                                                                                <td><span className='timesheet-task-check-status'>{getWorkStatus(
                                                                                                    emp.taskPercentage,
                                                                                                    emp.totalEffortsSubmitted
                                                                                                )}</span></td>
                                                                                                <td style={{ minWidth: "170px" }}>
                                                                                                    {(() => {
                                                                                                        const percentage = getSubmittedPercentage(
                                                                                                            emp.totalEffortsSubmitted,
                                                                                                            emp.totalEffortsAllocated
                                                                                                        );

                                                                                                        return (
                                                                                                            <div className="oxyem-progress-time">
                                                                                                                <div className="progress-header">
                                                                                                                    <span>{emp.totalEffortsSubmitted} / {emp.totalEffortsAllocated} hrs

                                                                                                                    </span>

                                                                                                                    <span className="progress-percent">
                                                                                                                        {percentage}%
                                                                                                                    </span>
                                                                                                                </div>

                                                                                                                {/* Progress Bar */}
                                                                                                                <div className="progress-bar-container-time">
                                                                                                                    <div
                                                                                                                        className="progress-bar-time"
                                                                                                                        role="progressbar"
                                                                                                                        style={{
                                                                                                                            width: `${percentage}%`,   // ✅ BASED ON PERCENTAGE
                                                                                                                            backgroundColor: percentage === 0
                                                                                                                                ? "#d1d5db"
                                                                                                                                : percentage < 100
                                                                                                                                    ? "#a4a2a2"
                                                                                                                                    : "#a4a2a2"
                                                                                                                        }}
                                                                                                                        aria-valuenow={percentage}
                                                                                                                        aria-valuemin="0"
                                                                                                                        aria-valuemax="100"
                                                                                                                    />
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        );
                                                                                                    })()}
                                                                                                </td>



                                                                                                <td className="text-center">
                                                                                                    <span
                                                                                                        className={`oxyem-circle oxyem-circle-mark-${emp.colour}`}
                                                                                                        title={`
                                                                                             ${emp.colour}`}
                                                                                                    ></span>
                                                                                                </td>
                                                                                                <td className="text-center">
                                                                                                    {emp.isHaveSubTask && (
                                                                                                        <button
                                                                                                            className="btn-sub-grey"
                                                                                                            onClick={() => getSubTasks(emp.idTaskProject)}
                                                                                                        >
                                                                                                            {loadingSubTask === emp.idTaskProject ? "Loading..." : "Subtask "}
                                                                                                        </button>
                                                                                                    )}

                                                                                                </td>
                                                                                            </tr>
                                                                                            {subTaskData[emp.idTaskProject] && (
                                                                                                <>
                                                                                                    {subTaskData[emp.idTaskProject].map((sub, subIdx) => {
                                                                                                        const srNo = `${idxTask + 1}.${subIdx + 1}`;

                                                                                                        return (
                                                                                                            <tr key={sub.idSubTask} className={`subtask-row subtask-${subIdx}`}>
                                                                                                                <td>{srNo}</td>
                                                                                                                <td className="text-capitalize">{sub.employeeName}</td>
                                                                                                                <td>
                                                                                                                    {(sub?.totalEffortsAllocated ?? 0)}
                                                                                                                </td>

                                                                                                                <td>{(sub?.totalEffortsSubmitted ?? 0)}</td>
                                                                                                                <td>{formatDate(sub.startDate)} - {formatDate(sub.endDate)}</td>
                                                                                                                <td><span className='timesheet-task-check-status'>{getWorkStatus(
                                                                                                                    sub.taskPercentage,
                                                                                                                    sub.totalEffortsSubmitted
                                                                                                                )}</span></td>
                                                                                                                <td style={{ minWidth: "170px" }}>
                                                                                                                    {(() => {
                                                                                                                        const subpercentage = getSubmittedPercentage(
                                                                                                                            sub.totalEffortsSubmitted,
                                                                                                                            sub.totalEffortsAllocated
                                                                                                                        );

                                                                                                                        return (
                                                                                                                            <div className="oxyem-progress-time">
                                                                                                                                <div className="progress-header">
                                                                                                                                    <span>{sub.totalEffortsSubmitted} / {sub.totalEffortsAllocated} hrs

                                                                                                                                    </span>

                                                                                                                                    <span className="progress-percent">
                                                                                                                                        {subpercentage}%
                                                                                                                                    </span>
                                                                                                                                </div>

                                                                                                                                {/* Progress Bar */}
                                                                                                                                <div className="progress-bar-container-time">
                                                                                                                                    <div
                                                                                                                                        className="progress-bar-time"
                                                                                                                                        role="progressbar"
                                                                                                                                        style={{
                                                                                                                                            width: `${subpercentage}%`,   // ✅ BASED ON PERCENTAGE
                                                                                                                                            backgroundColor: subpercentage === 0
                                                                                                                                                ? "#d1d5db"
                                                                                                                                                : subpercentage < 100
                                                                                                                                                    ? "#a4a2a2"
                                                                                                                                                    : "#a4a2a2"
                                                                                                                                        }}
                                                                                                                                        aria-valuenow={subpercentage}
                                                                                                                                        aria-valuemin="0"
                                                                                                                                        aria-valuemax="100"
                                                                                                                                    />
                                                                                                                                </div>

                                                                                                                            </div>
                                                                                                                        );
                                                                                                                    })()}
                                                                                                                </td>

                                                                                                                <td className="text-center">
                                                                                                                    <span
                                                                                                                        className={`oxyem-circle oxyem-circle-mark-${sub.colour}`}
                                                                                                                    />
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                        );
                                                                                                    })}
                                                                                                </>
                                                                                            )}
                                                                                        </>
                                                                                    ))}

                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}


                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="view"
                                                    role="tabpanel"
                                                    aria-labelledby="view-tab"
                                                >
                                                    {showChart ? (<GanttChart dataEntry={data} projectid={idProject} />) : null}
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
