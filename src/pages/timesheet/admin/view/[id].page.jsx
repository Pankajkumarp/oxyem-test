import { useState, useEffect } from 'react';
import Breadcrumbs from '../../../Components/Breadcrumbs/Breadcrumbsdiscription';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { format } from "date-fns";
import GanttChart from '../add/Gannt-chart.jsx';
import { Tooltip } from "react-tooltip";
import { Toaster, toast } from 'react-hot-toast';
import Avatar from 'react-avatar';
import { CSS } from "./pageInfostyle.jsx";
import TimesheetComment from "./timesheetComment.jsx";
import { FiInfo } from "react-icons/fi";
import KanbanBoard from './kanbanBoard';


export default function ViewDashboard() {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d) ? "" : format(d, "dd MMM yyyy");
    };
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const router = useRouter();
    const { id } = router.query;
        const idTimesheet = id;
const [mentionUser, setMentionUsers] = useState([]);
      useEffect(() => {
        const fetchProfileOptions = async () => {
          try {
            const response = await axiosJWT.get(`${apiUrl}/timesheet/getAssignees`, { params: { "idAssignTask": idTimesheet } })
            if (response) {
              const optionsData = response.data.data.map((item) => ({
                name: item.employeeName,
                id: item.idEmployee,
                image: item.profilePicPath ? item.profilePicPath : "",
                qualification: item.designation ? item.designation : "",
              }));
              setMentionUsers(optionsData);
            }
          } catch (error) {
            console.error('Error fetching options:', error);
          }
        };
        fetchProfileOptions();
      }, [apiUrl, idTimesheet]);

    const [data, setData] = useState([]);
    const [subTaskData, setSubTaskData] = useState({});
    const [loadingSubTask, setLoadingSubTask] = useState({});
    const [idProject, setidProject] = useState("");
    const [viewDetail, setViewDetails] = useState({});
    const [totalTask, settotalTask] = useState(0);
    const [totalUsers, settotalUsers] = useState(0);
    const [planHours, setplanHours] = useState(0);
    const [submitHours, setsubmitHours] = useState(0);
    const [showChart, setShowChart] = useState(false);
    const getSubTasks = async (idAssignTask, taskCode) => {
        try {
            setLoadingSubTask(prev => ({ ...prev, [taskCode]: true }));

            const res = await axiosJWT.get(
                `${apiUrl}/timesheet/getSubTaskInfo`,
                {
                    params: {
                        idAssignTask,
                        taskCode
                    }
                }
            );

            if (res?.data?.status === 200) {
                setSubTaskData(prev => ({
                    ...prev,
                    [taskCode]: res.data.data.taskList   // ✅ IMPORTANT
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSubTask(prev => ({ ...prev, [taskCode]: false }));
        }
    };



    const [showSubTaskFor, setShowSubTaskFor] = useState(null);

    useEffect(() => {
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
         console.error(error)
        }
    }
        getProjectValue(id);
    }, [apiUrl, id]);


    useEffect(() => {
        if (!showSubTaskFor) return;
        if (!viewDetail?.idAssignTask) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        getSubTasks(viewDetail.idAssignTask, showSubTaskFor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSubTaskFor, viewDetail?.idAssignTask]);
    useEffect(() => {
        if (viewDetail?.taskList?.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowSubTaskFor(null);              // hide sub tasks
        }
    }, [viewDetail]);

    const [openSubTask, setOpenSubTask] = useState(null);
    const toggleSubTask = (subTaskCode) => {
        setOpenSubTask(prev =>
            prev === subTaskCode ? null : subTaskCode
        );
    };
    const updateSubTaskStatus = async (subTaskId, newStatus) => {
        try {

            const response = await axiosJWT.post(
                `${apiUrl}/timesheet/updateStatus`,
                {
                    idSubTask: subTaskId,
                    status: newStatus
                }
            );
            if (response) {
                const message = response?.data?.message || "Successfully UpdateStatus"
                toast.success(message);
            }

        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Failed to create group. Please try again.";

            toast.error(message);
        }
    };

    const handleSubTaskToggle = (idSubTask, taskCode, subTaskCode, isChecked) => {
        const newStatus = isChecked ? "closed" : "open";
        setSubTaskData(prev => ({
            ...prev,
            [taskCode]: prev[taskCode].map(subTask =>
                subTask.generatedSubTaskCode === subTaskCode
                    ? { ...subTask, status: newStatus }
                    : subTask
            )
        }));
        updateSubTaskStatus(idSubTask, newStatus)
    };


    useEffect(() => {
        if (
            showSubTaskFor &&
            subTaskData[showSubTaskFor]?.length > 0 &&
            !openSubTask
        ) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpenSubTask(subTaskData[showSubTaskFor][0].generatedSubTaskCode);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subTaskData, showSubTaskFor]);
    const safeSubmit = Number(submitHours) || 0;
    const safePlan = Number(planHours) || 0;

    const percentage =
        safePlan > 0 ? ((safeSubmit / safePlan) * 100).toFixed(1) : "0.0";
    const [activeTab, setActiveTab] = useState("tasks");
    const [openGroups, setOpenGroups] = useState({});



    const toggleGroup = (key) => {
        setOpenGroups((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    const getRiskFromColour = (colour) => {
        const value = colour?.toLowerCase();

        if (value === "red")
            return { label: "High", className: "risk-high" };

        if (value === "amber" || value === "yellow")
            return { label: "Medium", className: "risk-medium" };

        if (value === "green")
            return { label: "Low", className: "risk-low" };

        return { label: "Medium", className: "risk-medium" };
    };
    // ================= TOTAL HOURS =================
    const totalPlanned = data.reduce(
        (sum, task) => sum + (Number(task.totalEffortsAllocated) || 0),
        0
    );

    const totalSubmitted = data.reduce(
        (sum, task) => sum + (Number(task.totalEffortsSubmitted) || 0),
        0
    );

    const percent =
        totalPlanned > 0
            ? ((totalSubmitted / totalPlanned) * 100).toFixed(1)
            : 0;

    const remaining = (totalPlanned - totalSubmitted).toFixed(1);

    // ================= DONUT =================
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const dashOffset =
        circumference - (percent / 100) * circumference;

    // ================= FLATTEN EMPLOYEES =================
    const allEmployees = data.flatMap((task) =>
        task.assignedTo.map((emp) => ({
            ...emp,
            taskName: task.taskName,
        }))
    );

    // ================= RISK COUNTS =================
    const highRisk = allEmployees.filter(
        (e) => e.colour?.toLowerCase() === "red"
    ).length;

    const mediumRisk = allEmployees.filter(
        (e) => e.colour?.toLowerCase() === "amber"
    ).length;

    const lowRisk = allEmployees.filter(
        (e) => e.colour?.toLowerCase() === "green"
    ).length;

    useEffect(() => {
        if (data.length > 0) {
            const firstKey = `tg-0`;

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpenGroups({
                [firstKey]: true
            });
        }
    }, [data]);
    const percentHH =
        totalUsers > 0
            ? (viewDetail?.activeTaskInCurrentWeek / totalUsers) * 100
            : 0;

    const total = totalTask || 0;
    const subTasks = viewDetail?.totalSubTaskCount || 0;

    const percentTh = total > 0
        ? Math.min((subTasks / total) * 100, 100)
        : 0;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubTaskValue, setIsSubTaskValue] = useState({});
    const openCommentModal = async (value) => {
        setIsSubTaskValue(value)
        setIsModalOpen(true)
    }
    const closeCommentModal = async () => {
        setIsSubTaskValue({})
        setIsModalOpen(false)
    }
    const [openInfoGroups, setOpenInfoGroups] = useState({timesheet: true});
    const toggleInfoGroup = (key) => {
        setOpenInfoGroups((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const description = viewDetail?.timesheetDescription || "";

const isLong = description.length > 150;

    return (
        <>
            <style suppressHydrationWarning>{CSS}</style>
            <Head>
                <title>Task Management Dashboard | Oxytal</title>
                <meta name="description" content={"Access the admin task dashboard to monitor task assignments, progress, priorities, deadlines, and team workload efficiently."} />
            </Head>
            <TimesheetComment isOpen={isModalOpen} closeModal={closeCommentModal} SubTaskInfo={isSubTaskValue} />
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
                            <div className="main view-timesheet-main">
                                <div className="page">
                                    {viewDetail?.projectName && (
                                        <div className="page-head">
                                            <div className="page-title-wrap">
                                                <div className="page-title">
                                                    <div className="detail-panel mb-0">
                                                        <div className="detail-panel-head" style={{ color: 'var(--blue-600)' }}>
                                                            <svg
                                                                width="26"
                                                                height="26"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            >
                                                                <circle cx="12" cy="12" r="10" />
                                                                <polyline points="12 6 12 12 16 14" />
                                                            </svg>
                                                            {viewDetail?.projectName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="stats-grid">
                                        {/* Total Tasks */}
                                        <div className="stat-card sc-blue">
                                            <div className="stat-icon-wrap sic-blue">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 11l3 3L22 4" />
                                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                                </svg>
                                            </div>
                                            <div className="stat-body">
                                                <div className="stat-label">Total Tasks</div>
                                                <div className="stat-value">{totalTask}</div>
                                                <div className="stat-sub">
                                                    <strong>{viewDetail?.totalSubTaskCount}</strong> sub-tasks assigned
                                                </div>
                                                <div className="stat-progress-track">
                                                    <div
                                                        className="stat-progress-fill"
                                                        style={{ width: `${percentTh}%`, background: "var(--blue-400)" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assigned Users */}
                                        <div className="stat-card sc-purple">
                                            <div className="stat-icon-wrap sic-purple">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                            </div>
                                            <div className="stat-body">
                                                <div className="stat-label">Assigned Users</div>
                                                <div className="stat-value">{totalUsers}</div>
                                                <div className="stat-sub">
                                                    <strong>{viewDetail?.activeTaskInCurrentWeek}</strong> active this week
                                                </div>
                                                <div className="stat-progress-track">
                                                    <div
                                                        className="stat-progress-fill"
                                                        style={{ width: `${percentHH}%`, background: "var(--purple-500)" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Planned Hours */}
                                        <div className="stat-card sc-amber">
                                            <div className="stat-icon-wrap sic-amber">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                            </div>
                                            <div className="stat-body">
                                                <div className="stat-label">Planned Hours</div>
                                                <div className="stat-value">
                                                    {planHours}
                                                    <span className="unit">hrs</span>
                                                </div>
                                                <div className="stat-sub">
                                                    Across <strong>{totalTask}</strong> tasks
                                                </div>
                                                <div className="stat-progress-track">
                                                    <div
                                                        className="stat-progress-fill"
                                                        style={{ width: "100%", background: "var(--amber-500)" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submitted Hours */}
                                        <div className="stat-card sc-green">
                                            <div className="stat-icon-wrap sic-green">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                                    <polyline points="17 6 23 6 23 12" />
                                                </svg>
                                            </div>
                                            <div className="stat-body">
                                                <div className="stat-label">Submitted Hours</div>
                                                <div className="stat-value">
                                                    {submitHours}
                                                    <span className="unit">hrs</span>
                                                </div>
                                                <div className="stat-sub">
                                                    {safeSubmit.toFixed(2)} / {safePlan.toFixed(2)} ·{" "}
                                                    <strong style={{ color: "var(--amber-600)" }}>
                                                        {percentage}%
                                                    </strong>
                                                </div>
                                                <div className="stat-progress-track">
                                                    <div
                                                        className="stat-progress-fill"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            background: "var(--green-500)",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-panel">
                                        <div className="detail-panel-head">
                                            <svg
                                                width="15"
                                                height="15"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="var(--blue-400)"
                                                strokeWidth="2"
                                            >
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                            </svg>

                                            <span className="detail-panel-title">Timesheet Details</span>

                                            <span
                                                className={`status-badge  status-${viewDetail?.status}`}
                                                style={{ fontSize: "10px", padding: "3px 9px" }}
                                            >
                                                <span className="dot"></span>
                                                {viewDetail?.status}
                                            </span>
                                            <div
                                                onClick={() => toggleInfoGroup("timesheet")}
                                                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                                            >
                                                <svg
                                                    className={`chevron ${openInfoGroups["timesheet"] ? "open" : ""}`}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    width="16"
                                                    height="16"
                                                >
                                                    <polyline points="18 15 12 9 6 15" />
                                                </svg>
                                            </div>
                                        </div>
{openInfoGroups["timesheet"] && (
                                        <div className="detail-grid">
                                            {/* Project Name */}
                                            <div className="detail-item">
                                                <div className="di-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                                        <path d="M9 9h6M9 13h4" />
                                                    </svg>
                                                </div>
                                                <div className="di-body">
                                                    <div className="di-label">Project Name</div>
                                                    <div className="di-value">
                                                        {viewDetail?.projectName}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Task Description */}
                                            <div className="detail-item">
                                                <div className="di-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                        <polyline points="14 2 14 8 20 8" />
                                                    </svg>
                                                </div>
                                                <div className="di-body">
                                                    <div className="di-label">Task Description</div>
                                                    <div className="di-value">
  {isLong ? (
    <>
      {description.slice(0, 150)}
      <span
        data-tooltip-id="desc-tooltip"
        data-tooltip-content={description}
        style={{ cursor: "pointer", color: "#888" }}
      >
        ...
      </span>
    </>
  ) : (
    description
  )}
</div>
                                                </div>
                                            </div>

                                            {/* Owner */}
                                            <div className="detail-item">
                                                <div className="di-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                        <circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                </div>
                                                <div className="di-body">
                                                    <div className="di-label">Owner</div>
                                                    <div
                                                        className="di-value"
                                                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                                    >
                                                        <Avatar name={viewDetail?.projectCreatedBy} size="25" textSizeRatio={1.5} />

                                                        {viewDetail?.projectCreatedBy}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Duration */}
                                            <div className="detail-item">
                                                <div className="di-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                </div>
                                                <div className="di-body">
                                                    <div className="di-label">Duration</div>
                                                    <div className="di-value mono">
                                                        {formatDate(viewDetail?.startDate)} - {formatDate(viewDetail?.endDate)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="detail-item">
                                                <div className="di-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="9 11 12 14 22 4" />
                                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                                    </svg>
                                                </div>
                                                <div className="di-body">
                                                    <div className="di-label">Status</div>
                                                    <div className="di-value">
                                                        <span className={`status-badge status-${viewDetail?.status}`} style={{ fontSize: "11px" }}>
                                                            <span className="dot"></span>
                                                            {viewDetail?.status}
                                                        </span>

                                                    </div>
                                                </div>
                                            </div>

                                            {/* Time Progress */}
                                            <div className="detail-item">
                                                <div className="di-icon">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                </div>
                                                <div className="di-body">
                                                    <div className="di-label">Time Progress</div>
                                                    <div className="di-value">
                                                        <div
                                                            style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontSize: "13px",
                                                                    fontWeight: 700,
                                                                    color: "var(--blue-600)",
                                                                }}
                                                            >
                                                                {safeSubmit.toFixed(2)} / {safePlan.toFixed(2)} ·{" "}
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: "11.5px",
                                                                    fontWeight: 600,
                                                                    color: "var(--amber-600)",
                                                                    background: "var(--amber-50)",
                                                                    padding: "2px 7px",
                                                                    borderRadius: "5px",
                                                                }}
                                                            >
                                                                {percentage}%
                                                            </span>
                                                        </div>

                                                        <div
                                                            className="stat-progress-track"
                                                            style={{ marginTop: "6px" }}
                                                        >
                                                            <div
                                                                className="stat-progress-fill"
                                                                style={{
                                                                    width: `${percentage}%`,
                                                                    background: "var(--blue-400)",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
)}
                                    </div>
                                    <div className="tabs-bar">
                                        <button
                                            className={`tab-btn ${activeTab === "tasks" ? "active" : ""}`}
                                            onClick={() => setActiveTab("tasks")}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg> Task Assignment Details
                                            <span className="tab-count">
                                                {viewDetail?.taskList?.length || 0}
                                            </span>
                                        </button>

                                        <button
                                            className={`tab-btn ${activeTab === "Kanban" ? "active" : ""}`}
                                            onClick={() => setActiveTab("Kanban")}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /></svg> Kanban
                                        </button>
                                        <button
                                            className={`tab-btn ${activeTab === "gantt" ? "active" : ""}`}
                                            onClick={() => setActiveTab("gantt")}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /></svg> Gantt Chart
                                        </button>

                                        <button
                                            className={`tab-btn ${activeTab === "summary" ? "active" : ""}`}
                                            onClick={() => setActiveTab("summary")}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> Productivity Summary
                                        </button>
                                    </div>

                                    {/* ================= TASKS PANEL ================= */}
                                    {activeTab === "tasks" && (
                                        <div className={`view-panel ${activeTab === "tasks" ? "active" : ""}`}>

                                            {viewDetail?.taskList?.map((task, idx) => {
                                                const groupKey = `tg-${idx}`;

                                                return (
                                                    <div className="task-group" key={task.idProject}>
                                                        <div
                                                            className="task-group-header"
                                                        >
                                                            <div className="task-num">{idx + 1}</div>

                                                            <div>
                                                                <div className="task-group-name" onClick={() => toggleGroup(groupKey)}>
                                                                    {task.taskName}
                                                                    <span className="task-group-code" style={{ marginLeft: 8 }}>
                                                                        {task.taskCode}
                                                                    </span>
                                                                </div>

                                                                <div className="task-meta-chips">
                                                                    <span className="meta-chip" onClick={() => toggleGroup(groupKey)} style={{ color: 'var(--blue-600)' }}>
                                                                        <strong>{task.assignedTo?.length || 0}</strong> Assignee
                                                                    </span>

                                                                    <span className="meta-sep">·</span>

                                                                    <span className="meta-chip">
                                                                        <strong>{task.totalEffortsAllocated || 0}</strong> Planned Hrs
                                                                    </span>

                                                                    <span className="meta-sep">·</span>

                                                                    <span
                                                                        className="meta-chip"
                                                                        style={{ color: "var(--amber-600)" }}
                                                                    >
                                                                        <strong>{task.totalEffortsSubmitted || 0}</strong> Submitted Hrs
                                                                    </span>
                                                                    <span className="meta-sep">·</span>

                                                                    <span className="meta-chip">
                                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '11px', height: '11px' }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                                        {formatDate(task.startDate)} –{" "}
                                                                        {formatDate(task.endDate)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="tg-right">
                                                                {task?.isHaveSubTask ? (
                                                                    <span
                                                                        className="sub-tasks-badge"
                                                                        onClick={() => {
                                                                            
                                                                            setShowSubTaskFor(task.taskCode);
                                                                            getSubTasks(viewDetail.idAssignTask, task.taskCode);
                                                                        }}
                                                                    >
                                                                        Sub-Tasks ▾</span>) : null}
                                                                <span className={`status-badge status-${task.status}`} style={{ fontSize: '10px', padding: '3px 8px' }}><span className="dot"></span>{task.status}</span>
                                                                <svg onClick={() => toggleGroup(groupKey)} className={`chevron ${openGroups[groupKey] ? "open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                                                            </div>
                                                        </div>
                                                        {loadingSubTask[task.taskCode] && (
                                                            <div
                                                                style={{
                                                                    padding: "20px",
                                                                    textAlign: "center",
                                                                    fontWeight: 600,
                                                                    color: "var(--gray-500)"
                                                                }}
                                                            >
                                                                Loading Subtasks...
                                                            </div>
                                                        )}
                                                        {showSubTaskFor === task.taskCode &&
                                                            subTaskData[task.taskCode]?.map((subTask, subIndex) => {
                                                                const subKey = subTask.generatedSubTaskCode;

                                                                return (
                                                                    <div className="subtask-item ms-side" key={subKey}>

                                                                        {/* ================= SUBTASK HEADER ================= */}
                                                                        <div
                                                                            className="subtask-header"

                                                                        >
                                                                            <span className="subtask-num" onClick={() => toggleSubTask(subKey)}>
                                                                                {idx + 1}.{subIndex + 1}
                                                                            </span>

                                                                            <span className="subtask-name" onClick={() => toggleSubTask(subKey)}>
                                                                                {subTask.taskName}
                                                                            </span>

                                                                            <span className="subtask-code" onClick={() => toggleSubTask(subKey)}>
                                                                                {subTask.generatedSubTaskCode}
                                                                            </span>

                                                                            <div
                                                                                style={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    gap: "6px",
                                                                                    marginLeft: "6px",
                                                                                }}
                                                                            >
                                                                                <span className="meta-chip">
                                                                                    <strong>{subTask.assignedTo?.length || 0}</strong> Assignee
                                                                                </span>

                                                                                <span className="meta-sep">·</span>

                                                                                <span className="meta-chip">
                                                                                    <strong>{subTask.totalEffortsAllocated}</strong> Planned Hrs
                                                                                </span>

                                                                                <span className="meta-sep">·</span>

                                                                                <span
                                                                                    className="meta-chip"
                                                                                    style={{ color: "var(--amber-600)" }}
                                                                                >
                                                                                    <strong>{subTask.totalEffortsSubmitted}</strong> Submitted Hrs
                                                                                </span>

                                                                                <span className="meta-sep">·</span>

                                                                                <span className="meta-chip">
                                                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '11px', height: '11px' }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg> {formatDate(subTask.startDate)} –{" "}
                                                                                    {formatDate(subTask.endDate)}
                                                                                </span>
                                                                                <span style={{
                                                                                    fontSize: '20px',
                                                                                    marginLeft: "6px",
                                                                                    marginBottom: '3px'
                                                                                }} onClick={() => openCommentModal(subTask)}>
                                                                                    <FiInfo style={{ color: '1d5fe8' }} />
                                                                                </span>
                                                                            </div>

                                                                            <div className="tg-right">
                                                                                <div className="on-off-toggle"
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                    onMouseDown={(e) => e.stopPropagation()}
                                                                                    data-tooltip-content={"Change status"}
                                                                                    data-tooltip-id={`my-tooltip-p`}>
                                                                                    <input
                                                                                        className="on-off-toggle__input"
                                                                                        checked={subTask.status === "closed"}
                                                                                        type="checkbox" id={`tg-${task.taskCode}-${subTask.generatedSubTaskCode}`}
                                                                                        onChange={(e) => {
                                                                                            e.stopPropagation();
                                                                                            const isChecked = e.target.checked; // ✅ input value
                                                                                            handleSubTaskToggle(
                                                                                                subTask.idSubTask,
                                                                                                task.taskCode,
                                                                                                subTask.generatedSubTaskCode,
                                                                                                isChecked
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                    <label htmlFor={`tg-${task.taskCode}-${subTask.generatedSubTaskCode}`} className="on-off-toggle__slider"></label>
                                                                                </div>
                                                                                <span
                                                                                    className={`status-badge status-${subTask.status}`}
                                                                                    style={{ fontSize: "10px", padding: "3px 8px" }}
                                                                                >
                                                                                    <span className="dot"></span>
                                                                                    {subTask.status}
                                                                                </span>
                                                                                <svg onClick={() => toggleSubTask(subKey)} style={{ marginRight: '10px' }} className={`chevron ${openSubTask === subKey ? "open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                                                                            </div>
                                                                        </div>

                                                                        {/* ================= EMPLOYEE TABLE ================= */}
                                                                        {openSubTask === subKey && (
                                                                            <div className="emp-table-wrap">
                                                                                <table className="emp-table">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Employee Name</th>
                                                                                            <th>Planned Effort (hrs)</th>
                                                                                            <th>Submitted Effort (hrs)</th>
                                                                                            <th>Duration</th>
                                                                                            <th>Work Status</th>
                                                                                            <th>Indicator</th>
                                                                                            <th>Risk</th>
                                                                                        </tr>
                                                                                    </thead>

                                                                                    <tbody>
                                                                                        {subTask.assignedTo?.map((emp) => {
                                                                                            const planned =
                                                                                                Number(emp.totalEffortsAllocated) || 0;
                                                                                            const submitted =
                                                                                                Number(emp.totalEffortsSubmitted) || 0;

                                                                                            const percent =
                                                                                                planned > 0
                                                                                                    ? ((submitted / planned) * 100).toFixed(0)
                                                                                                    : 0;

                                                                                            const risk = getRiskFromColour(emp.colour);

                                                                                            const workStatus =
                                                                                                submitted === 0
                                                                                                    ? "Not Started"
                                                                                                    : submitted < planned
                                                                                                        ? "In Progress"
                                                                                                        : "Completed";

                                                                                            return (
                                                                                                <tr key={emp.idEmployee}>
                                                                                                    <td>
                                                                                                        <div className="emp-name-cell">
                                                                                                            <div className="emp-avatar">
                                                                                                                <Avatar name={emp.employeeName} size="24" textSizeRatio={1.5} />

                                                                                                            </div>
                                                                                                            <span className="emp-name">
                                                                                                                {emp.employeeName}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </td>

                                                                                                    <td>
                                                                                                        <strong>{planned}</strong>
                                                                                                    </td>

                                                                                                    <td>{submitted}</td>

                                                                                                    <td>
                                                                                                        {formatDate(subTask.startDate)} –{" "}
                                                                                                        {formatDate(subTask.endDate)}
                                                                                                    </td>

                                                                                                    <td>
                                                                                                        <span
                                                                                                            className={`work-status-pill ${workStatus === "Completed"
                                                                                                                ? "ws-completed"
                                                                                                                : workStatus === "In Progress"
                                                                                                                    ? "ws-in-progress"
                                                                                                                    : "ws-not-started"
                                                                                                                }`}
                                                                                                        >
                                                                                                            {workStatus}
                                                                                                        </span>
                                                                                                    </td>

                                                                                                    <td>
                                                                                                        <div className="indicator-cell">
                                                                                                            <div className="indicator-bar">
                                                                                                                <div
                                                                                                                    className="indicator-fill"
                                                                                                                    style={{
                                                                                                                        width: `${percent}%`,
                                                                                                                    }}
                                                                                                                ></div>
                                                                                                            </div>
                                                                                                            <span className="indicator-text">
                                                                                                                {submitted} / {planned} hrs
                                                                                                            </span>
                                                                                                            <span className="indicator-pct">
                                                                                                                {percent}%
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </td>

                                                                                                    <td>
                                                                                                        <div className="risk-cell">
                                                                                                            <div
                                                                                                                className={`risk-dot ${risk.className}`}
                                                                                                            ></div>
                                                                                                            <span className="risk-label">
                                                                                                                {risk.label}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            );
                                                                                        })}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        {/* Subtask Section (Employees) */}
                                                        {openGroups[groupKey] && (
                                                            <div className="subtask-wrap">
                                                                <div className="emp-table-wrap">
                                                                    <table className="emp-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Employee Name</th>
                                                                                <th>Planned Effort</th>
                                                                                <th>Submitted Effort</th>
                                                                                <th>Duration</th>
                                                                                <th>Work Status</th>
                                                                                <th>Indicator</th>
                                                                                <th>Risk</th>
                                                                            </tr>
                                                                        </thead>

                                                                        <tbody>
                                                                            {task.assignedTo?.map((emp) => {
                                                                                const planned = Number(emp.totalEffortsAllocated) || 0;
                                                                                const submitted = Number(emp.totalEffortsSubmitted) || 0;
                                                                                const percent =
                                                                                    planned > 0 ? ((submitted / planned) * 100).toFixed(0) : 0;

                                                                                const getWorkStatus = () => {
                                                                                    if (submitted === 0) return "Not Started";
                                                                                    if (submitted < planned) return "In Progress";
                                                                                    return "Completed";
                                                                                };

                                                                                const risk = getRiskFromColour(emp.colour);

                                                                                return (
                                                                                    <tr key={emp.idEmployee}>
                                                                                        {/* Employee Name */}
                                                                                        <td>
                                                                                            <div className="emp-name-cell">
                                                                                                <div
                                                                                                    className="emp-avatar"
                                                                                                >
                                                                                                    <Avatar name={emp.employeeName} size="24" textSizeRatio={1.5} />

                                                                                                </div>
                                                                                                <span className="emp-name">
                                                                                                    {emp.employeeName}
                                                                                                </span>
                                                                                            </div>
                                                                                        </td>

                                                                                        {/* Planned Effort */}
                                                                                        <td>
                                                                                            <strong>{planned}</strong>
                                                                                        </td>

                                                                                        {/* Submitted Effort */}
                                                                                        <td>{submitted}</td>

                                                                                        {/* Duration */}
                                                                                        <td>
                                                                                            {formatDate(task?.startDate)} - {formatDate(task?.endDate)}
                                                                                        </td>

                                                                                        {/* Work Status */}
                                                                                        <td>
                                                                                            <span
                                                                                                className={`work-status-pill ${getWorkStatus() === "Completed"
                                                                                                    ? "ws-completed"
                                                                                                    : getWorkStatus() === "In Progress"
                                                                                                        ? "ws-in-progress"
                                                                                                        : "ws-not-started"
                                                                                                    }`}
                                                                                            >
                                                                                                {getWorkStatus()}
                                                                                            </span>
                                                                                        </td>

                                                                                        {/* Indicator */}
                                                                                        <td>
                                                                                            <div className="indicator-cell">
                                                                                                <div className="indicator-bar">
                                                                                                    <div
                                                                                                        className="indicator-fill"
                                                                                                        style={{ width: `${percent}%` }}
                                                                                                    ></div>
                                                                                                </div>
                                                                                                <span className="indicator-text">
                                                                                                    {submitted} / {planned} hrs
                                                                                                </span>
                                                                                                <span className="indicator-pct">
                                                                                                    {percent}%
                                                                                                </span>
                                                                                            </div>
                                                                                        </td>

                                                                                        {/* Risk */}
                                                                                        <td>
                                                                                            <div className="risk-cell">
                                                                                                <div className={`risk-dot ${risk.className}`}></div>
                                                                                                <span className="risk-label">{risk.label}</span>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                        </div>
                                    )}

                                    {/* ================= Kanban ================= */}
                                    {activeTab === "Kanban" && (
                                        <KanbanBoard idTimesheet={idTimesheet} mentionUser={mentionUser}/>
                                    )}
                                    {/* ================= GANTT PANEL ================= */}
                                    {activeTab === "gantt" && (
                                        <div className={`view-panel ${activeTab === "gantt" ? "active" : ""}`}>
                                            <div className="gantt-container p-3">
                                                <h3>Timeline View — {formatDate(viewDetail?.startDate)} - {formatDate(viewDetail?.endDate)}</h3>
                                                {showChart ? (<GanttChart dataEntry={data} projectid={idProject} />) : null}
                                            </div>
                                        </div>
                                    )}

                                    {/* ================= SUMMARY PANEL ================= */}
                                    {activeTab === "summary" && (
                                        <div className={`view-panel ${activeTab === "summary" ? "active" : ""}`}>
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr",
                                                    gap: "16px",
                                                    marginBottom: "16px",
                                                }}
                                            >
                                                {/* ================= HOURS DONUT ================= */}
                                                <div
                                                    className="detail-panel"
                                                    style={{ padding: "20px", margin: 0 }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: "13.5px",
                                                            fontWeight: 700,
                                                            color: "var(--gray-700)",
                                                            marginBottom: "16px",
                                                        }}
                                                    >
                                                        Hours Breakdown
                                                    </div>

                                                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                                        <div
                                                            style={{
                                                                position: "relative",
                                                                width: "175px",
                                                                height: "175px",
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <svg
                                                                viewBox="0 0 100 100"
                                                                width="175"
                                                                height="175"
                                                                style={{ transform: "rotate(-90deg)" }}
                                                            >
                                                                <circle
                                                                    cx="50"
                                                                    cy="50"
                                                                    r={radius}
                                                                    fill="none"
                                                                    stroke="var(--gray-100)"
                                                                    strokeWidth="14"
                                                                />
                                                                <circle
                                                                    cx="50"
                                                                    cy="50"
                                                                    r={radius}
                                                                    fill="none"
                                                                    stroke="var(--blue-400)"
                                                                    strokeWidth="14"
                                                                    strokeDasharray={circumference}
                                                                    strokeDashoffset={dashOffset}
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>

                                                            <div
                                                                style={{
                                                                    position: "absolute",
                                                                    inset: 0,
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontSize: "20px",
                                                                        fontWeight: 800,
                                                                        color: "var(--gray-900)",
                                                                    }}
                                                                >
                                                                    {percent}%
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        fontSize: "9px",
                                                                        color: "var(--gray-400)",
                                                                        textTransform: "uppercase",
                                                                        letterSpacing: ".5px",
                                                                    }}
                                                                >
                                                                    Submitted
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ marginBottom: "12px" }}>
                                                                <div
                                                                    style={{
                                                                        fontSize: "11px",
                                                                        color: "var(--gray-500)",
                                                                        fontWeight: 600,
                                                                        textTransform: "uppercase",
                                                                    }}
                                                                >
                                                                    Planned
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize: "24px",
                                                                        fontWeight: 800,
                                                                        color: "var(--gray-900)",
                                                                    }}
                                                                >
                                                                    {totalPlanned}
                                                                    <span
                                                                        style={{
                                                                            fontSize: "14px",
                                                                            fontWeight: 500,
                                                                            color: "var(--gray-400)",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        hrs
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div
                                                                    style={{
                                                                        fontSize: "11px",
                                                                        color: "var(--gray-500)",
                                                                        fontWeight: 600,
                                                                        textTransform: "uppercase",
                                                                    }}
                                                                >
                                                                    Submitted
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        fontSize: "24px",
                                                                        fontWeight: 800,
                                                                        color: "var(--blue-500)",
                                                                    }}
                                                                >
                                                                    {totalSubmitted}
                                                                    <span
                                                                        style={{
                                                                            fontSize: "14px",
                                                                            fontWeight: 500,
                                                                            color: "var(--gray-400)",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        hrs
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            marginTop: "16px",
                                                            padding: "10px 12px",
                                                            background: "var(--amber-50)",
                                                            border: "1px solid var(--amber-100)",
                                                            borderRadius: "9px",
                                                            fontSize: "12.5px",
                                                            color: "var(--amber-600)",
                                                        }}
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg> At current pace, <strong>{remaining} hrs</strong> remaining.
                                                    </div>
                                                </div>

                                                {/* ================= MEMBER PRODUCTIVITY ================= */}
                                                <div
                                                    className="detail-panel box-min-height"
                                                    style={{ margin: 0, }}
                                                >
                                                    <div className="detail-panel-head">
                                                        <span className="detail-panel-title">
                                                            Member Productivity
                                                        </span>
                                                    </div>
                                                    {allEmployees.map((emp) => {
                                                        const planned = Number(emp.totalEffortsAllocated) || 0;
                                                        const submitted = Number(emp.totalEffortsSubmitted) || 0;
                                                        const pct =
                                                            planned > 0 ? ((submitted / planned) * 100).toFixed(0) : 0;

                                                        return (
                                                            <div
                                                                key={emp.idEmployee + emp.idTaskProject}
                                                                style={{
                                                                    padding: "12px 18px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "14px",
                                                                    borderBottom: "1px solid var(--gray-100)",
                                                                }}

                                                            >
                                                                <div className="emp-avatar">
                                                                    <Avatar name={emp.employeeName} size="32" textSizeRatio={1.5} />
                                                                </div>

                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ fontWeight: 600 }}>
                                                                        {emp.employeeName}
                                                                    </div>
                                                                    <div style={{ fontSize: "11px", color: "gray" }}>
                                                                        {emp.taskName}
                                                                    </div>
                                                                </div>

                                                                <div style={{ width: 120 }}>
                                                                    <div className="indicator-bar">
                                                                        <div
                                                                            className="indicator-fill"
                                                                            style={{ width: `${pct}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <div style={{ fontSize: 11 }}>
                                                                        {submitted} / {planned} hrs · {pct}%
                                                                    </div>
                                                                </div>

                                                                <div className="risk-cell">
                                                                    <div
                                                                        className={`risk-dot ${emp.colour?.toLowerCase() === "red"
                                                                            ? "risk-high"
                                                                            : emp.colour?.toLowerCase() === "green"
                                                                                ? "risk-low"
                                                                                : "risk-medium"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                </div>
                                            </div>

                                            {/* ================= RISK SUMMARY ================= */}
                                            <div className="detail-panel" style={{ margin: 0 }}>
                                                <div className="detail-panel-head">
                                                    <span className="detail-panel-title">
                                                        Risk Overview
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns: "repeat(3,1fr)",
                                                        padding: "20px",
                                                        gap: "14px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            textAlign: "center",
                                                            padding: "16px",
                                                            background: "var(--red-50)",
                                                            borderRadius: "12px",
                                                            border: "1px solid var(--red-100)",
                                                            color: 'var(--red-600)'
                                                        }}
                                                    >
                                                        <div style={{ fontSize: "28px", fontWeight: 800 }}>
                                                            {highRisk}
                                                        </div>
                                                        <div>High Risk Tasks</div>
                                                    </div>

                                                    <div style={{
                                                        textAlign: "center",
                                                        padding: "16px",
                                                        background: "var(--amber-50)",
                                                        borderRadius: "12px",
                                                        border: "1px solid var(--amber-100)",
                                                        color: 'var(--amber-500)'
                                                    }}>
                                                        <div style={{ fontSize: "28px", fontWeight: 800 }}>
                                                            {mediumRisk}
                                                        </div>
                                                        <div>Medium Risk</div>
                                                    </div>

                                                    <div
                                                        style={{
                                                            textAlign: "center",
                                                            padding: "16px",
                                                            background: "var(--green-50)",
                                                            borderRadius: "12px",
                                                            border: "1px solid var(--green-100)",
                                                            color: 'var(--green-500)'
                                                        }}>
                                                        <div style={{ fontSize: "28px", fontWeight: 800 }}>
                                                            {lowRisk}
                                                        </div>
                                                        <div>Low Risk Tasks</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tooltip id="my-tooltip-p" place="top" />
            <Tooltip id="desc-tooltip" className="custom-tooltip" />
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </>
    );
}
