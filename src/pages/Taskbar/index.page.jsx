import React, { useContext, useEffect, useState } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Profile from '../Components/commancomponents/profile';
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Task from './Task'; // Adjust the import path if necessary
import { AnimatePresence } from 'framer-motion';
import { axiosJWT } from '../Auth/AddAuthorization';
import {SocketContext} from '../Auth/Socket';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import Viewtask from './viewtask';
import { useRouter } from 'next/router';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
export default function Taskbar() {
    const socket = useContext(SocketContext);
    const router = useRouter();
    const [headersleave, setheadersleave] = useState([]);
    const [tableDataleave, settableDataleave] = useState([]);
    const [Headtextleave, setHeadtextleave] = useState('');

    const [headersattendace, setheadersattendace] = useState([]);
    const [tableDataattendace, settableDataattendace] = useState([]);

    const [headersAlloction, setheadersallocation] = useState([]);
    const [tableDataAlloction, settableDataallocation] = useState([]);

    const [allocationavg, setallocationavg] = useState('0');
    const [attendanceavg, setattendanceavg] = useState('0');
    const [leaveavg, setleaveavg] = useState('0');
    

    const [attheadiline, setattheadiline] = useState('');
    const [alloctnheadline, setalloctnheadline] = useState('');

    const [userData, setUserData] = useState([]);

    const [approvedTasks, setApprovedTasks] = useState([]);

    const [empId, setEmpId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/employees/getLoggedInEmployee`);
                const EmployeeId = response.data.data.idEmployee;
                setEmpId(EmployeeId);
            } catch (error) {
            }
        };
        fetchData();
      }, []);


       // Function to fetch Leave data
async function fetchLeaveData() {
    try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/taskbar/LATStats`, { params: { isfor: 'leave' } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    const headersleave = fetchedData.leaveheading;
                    const leaveresp = fetchedData.leaveresp;
                    const leaveheadline = fetchedData.leaveheadline;
                    const leaveavg = fetchedData.leaveavg;
                    settableDataleave(leaveresp);
                    setheadersleave(headersleave);
                    setHeadtextleave(leaveheadline);
                    setleaveavg(leaveavg);
                }
    } catch (error) {
        // console.error('Error fetching leave data:', error);
    }
}

// Function to fetch My Task data
async function fetchMyTaskData() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/taskbar/getAllNotifications`, { params: { isfor: 'upcoming' } });

        if (response.status === 200 && response.data.data) {
            const fetchedData = response.data.data;
            // const headersleave = fetchedData.leaveheading;
            setUserData(fetchedData);
           
        }

    } catch (error) {
        // console.error('Error fetching my task data:', error);
    }
}
// Function to fetch My Task history data
async function fetchMyTaskHistoryData() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/taskbar/getAllNotifications`, { params: { isfor: 'history' } });

        if (response.status === 200 && response.data.data) {
            const fetchedData = response.data.data;
            // const headersleave = fetchedData.leaveheading;
            setApprovedTasks(fetchedData);
           
        }

    } catch (error) {
        // console.error('Error fetching my task data:', error);
    }
}
// Function to fetch Allocation data
async function fetchAllocationData() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/taskbar/LATStats`, { params: { isfor: 'allocation' } });
        if (response.status === 200 && response.data.data) {
            const fetchedData = response.data.data;
            const tableDataallocation = fetchedData.allocationresp;
            const headersallocation = fetchedData.allocatiionheading;
            const allocationavg = fetchedData.allocationavg;
            const alloctnheadline = fetchedData.alloctnheadline;
            setalloctnheadline(alloctnheadline);
            setheadersallocation(headersallocation);
            settableDataallocation(tableDataallocation);
            setallocationavg(allocationavg);
        }
    } catch (error) {
        // console.error('Error fetching allocation data:', error);
    }
}

// Function to fetch Attendance data
async function fetchAttendanceData() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/taskbar/LATStats`, { 
            params: { isfor: 'attendance' } 
        });

        if (response.status === 200 && response.data.data) {
            const fetchedData = response.data.data;
            const tableDataattendace = fetchedData.attendamceresp;
            const headersattendace = fetchedData.attendanceheading;
            const attendanceavg = fetchedData.attendanceavg;
            const attheadiline = fetchedData.attheadiline;
            setheadersattendace(headersattendace);
            settableDataattendace(tableDataattendace);
            setattendanceavg(attendanceavg);
            setattheadiline(attheadiline);
        }
    } catch (error) {
        // console.error('Error fetching attendance data:', error);
    }
}

    useEffect(() => {
        // Fetch Leave and My Task data on page load
        fetchLeaveData();
        fetchMyTaskData();
        fetchMyTaskHistoryData();
    }, []);
    


    useEffect(() => {
        let isAllocationFetched = false;
        let isAttendanceFetched = false;
    
        const handleScroll = () => {
            if (!isAllocationFetched && window.scrollY > 100) {  // Adjust scroll position as needed
                fetchAllocationData();
                isAllocationFetched = true;
            }
    
            if (!isAttendanceFetched && window.scrollY > 0) {  // Adjust scroll position as needed
                fetchAttendanceData();
                isAttendanceFetched = true;
            }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    
    const getStatusClass = (status) => {
        switch (status) {
            case 'present':
                return 'oxy_table_check'; // Class for present
            case 'absent':
                return 'oxy_table_uncheck'; // Class for absent
            case 'holiday':
                return 'oxy_table_holiday'; // Class for absent
            case 'weekend':
                return 'oxy_table_weekend'; // Class for absent

                
            default:
                return ''; // Default class (optional)
        }
    };

    // const apipayload ={
    //     "action": type,
    //     "idAttendance": id,
    //     "rejectReason":data
    // }
    // const response = await axiosJWT.post(`${apiUrl}/attendance/updateStatus`, apipayload);


    const approvestaus = (status) => {
        switch (status) {
            case 'Approve':
                return <FaCheck />; // Icon for present
            case 'Reject':
                return <IoClose />; // Icon for absent
            case 'View':
                return <IoEyeSharp />; // Icon for absent
            default:
                return null; // No icon for other statuses
        }
    };

    const [isCollapsedleave, setIsCollapsedLeave] = useState(false); // State to manage collapse

    const toggleCollapseleave = () => {
        setIsCollapsedLeave(prevState => !prevState); // Toggle collapse state
    };
    const [isCollapsedAttendance, setIsCollapsedAttendance] = useState(false); // State to manage collapse

    const toggleCollapseAttendance = () => {
        setIsCollapsedAttendance(prevState => !prevState); // Toggle collapse state
    };
    

    

    const handleApprove = async (taskData ,actionis) => {
       
    
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
        if (taskData.actionFor === "leave") {
           const apipayload = {
                status: actionis,
                idLeaves: [taskData.idAction],
                rejectReason: "",
            };

            try {
                const response = await axiosJWT.post(`${apiUrl}/leave/approval`, apipayload);
                
                if (response.status === 200) {

                    ToastNotification({ message: response.data.message });

                    socket.emit("update", {
                        idNotify: [taskData.id],
                        idEmployee: '',
                        actionFor: "leave",
                        idAction: taskData.idAction,
                        dateRange: '',
                        projectmanger: empId,
                        status:actionis
                    });
                }
            } catch (error) {
                // console.error("Error updating status:", error);
            }
        } else if (taskData.actionFor === "attendance") {
           const apipayload = {
                action: actionis,
                idAttendance: [taskData.idAction],
                rejectReason: "",
            };
            
            const response = await axiosJWT.post(`${apiUrl}/attendance/updateStatus`, apipayload);
           
            if (response.status === 200) {

            ToastNotification({ message: response.data.message });

            socket.emit("update", {
                idNotify: [taskData.id],
                idEmployee: '',
                actionFor: "attendance",
                idAction: taskData.idAction,
                dateRange: '',
                projectmanger: empId,
                status:actionis
            });
        }
        }
    
        // Move task to the approved list
        setUserData(userData.filter((t) => t.id !== taskData.id));
        setTimeout(() => {
            setApprovedTasks([taskData, ...approvedTasks]);
        }, 1200); // 1200ms = 1.2 seconds
    };
    

    const [isOpen, setIsOpen] = useState(false);
    const [taskDataId, settaskDataId] = useState({});

    

    const openModal = (taskData) => {
        
        settaskDataId(taskData);
        setIsOpen(true);
      };
    
      const closeModal = () => {
        setIsOpen(false);
      };

      const openProfile = (task) => {
        router.push(`/employeeDashboard/${task.idEmployee}`);
      };

    return (
        <>
        <Head><title>{pageTitles.TaskBar}</title></Head>
        <Viewtask isOpen={isOpen} closeModal={closeModal} taskData={taskDataId}/>
            <div className="main-wrapper">
                <div className="page-wrapper" id="sk-taskbar-page">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"TaskBar"} />

                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12" >
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index task_page_main_1">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h3 className='head_text'>My Task</h3>
                                                            <div className="taskbar-notification_section_page ox-scroll-mytask">

                                                                <div className='oxyem-react-select-custom position-relative ox-scroll-mytask'>
                                                                    <AnimatePresence>
                                                                    {userData && userData.length > 0 ? (
                                                                      userData.map((task) => (
                                                                        <Task key={task.id} task={task} handleApprove={handleApprove} position="pending" openModal={openModal} />
                                                                      ))
                                                                    ) : (
                                                                      <p>There is no action pending</p>
                                                                    )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <h3 className='head_text'>History Task</h3>
                                                            <div className="taskbar-notification_section_page ox-scroll-mytask">

                                                                <div className='oxyem-react-select-custom position-relative '>
                                                                    <AnimatePresence>
                                                                    {approvedTasks && approvedTasks.length > 0 ? (    
                                                                        approvedTasks.map((task) => (
                                                                            <Task key={task.id} task={task} handleApprove={() => { }} position="approved" />
                                                                        ))

                                                                    ) : (
                                                                      <p>No Records found</p>
                                                                    )}
                                                                 
                                                                    </AnimatePresence>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex mt-2">
                                        <div className="card flex-fill comman-shadow oxyem-index task_page_main">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body custom-card-padding-0">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border task_bar_cs_padding" >
                                                        <div className="taskbar-leave_section_page">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h3 className='head_text'>{Headtextleave}</h3> <span className='highlight_pt_txt'>{leaveavg} Days</span>
                                                                <button className="btn btn-link cs_button_task" onClick={toggleCollapseleave}>
                                                                    {isCollapsedleave ? <FaChevronDown /> : <FaChevronUp />}
                                                                </button>
                                                            </div>
                                                            {!isCollapsedleave && (
															<div className="taskbar_bottom_collapsed_section">
                                                                <table className="table table-striped custom-table table-nowrap custom-table-taskbar">
                                                                    <thead>
                                                                        <tr>
                                                                            {headersleave.map((header, index) => (
                                                                                <th key={index} className={header === 'Employee Name' ? 'tr_emp_name' : ''} dangerouslySetInnerHTML={{ __html: header }} />
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {tableDataleave.length === 0 ? (
                                                                        <tr>
                                                                            <td colSpan='' className="text-center">No records found</td>
                                                                        </tr>
                                                                    ) : (
                                                                        tableDataleave.map((row, rowIndex) => (
                                                                            <tr key={rowIndex}>
                                                                                <td className='task_bar_profile'>
                                                                                    <Profile
                                                                                        name={row.employee}
                                                                                        imageurl={row.profilePicture || ""}
                                                                                        size={"28"}
                                                                                        profilelink={`/employeeDashboard/${row.idEmployee}`}

                                                                                    />
                                                                                    <span onClick={() => openProfile(row)} className='pr_text'>{row.employee}</span>
                                                                                </td>
                                                                                {row.status.map((status, statusIndex) => (
                                                                                    <td key={statusIndex} className={getStatusClass(status)}>
                                                                                        {/* Render status content here */}
                                                                                    </td>
                                                                                ))}
                                                                            </tr>
                                                                        ))
                                                                    )}

                                                                    </tbody>
                                                                </table>
															</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex mt-2">
                                        <div className="card flex-fill comman-shadow oxyem-index task_page_main">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body custom-card-padding-0">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border task_bar_cs_padding" >
                                                        <div className="taskbar-attendance_section_page">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h3 className='head_text'>{attheadiline}</h3> <span className='highlight_pt_txt'>Avg {attendanceavg}</span>
                                                                <button className="btn btn-link cs_button_task" onClick={toggleCollapseAttendance}>
                                                                    {isCollapsedAttendance ? <FaChevronDown /> : <FaChevronUp />}
                                                                </button>
                                                            </div>
                                                            {!isCollapsedAttendance && (
															<div className="taskbar_bottom_collapsed_section">
                                                                <table className="table table-striped custom-table table-nowrap custom-table-taskbar">
                                                                    <thead>
                                                                        <tr>
                                                                            {headersattendace.map((header, index) => (
                                                                                <th key={index} className={header === 'Employee Name' ? 'tr_emp_name' : ''} dangerouslySetInnerHTML={{ __html: header }} />
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {tableDataattendace.map((row, rowIndex) => (
                                                                            <tr key={rowIndex}>
                                                                                <td className='task_bar_profile'>
                                                                                    <Profile name={row.employee} imageurl={row.profilePicture || ""} size={"28"} 
                                                                                    profilelink={`/employeeDashboard/${row.idEmployee}` || ""}
                                                                                    />
                                                                                    <span onClick={() => openProfile(row)} className='pr_text'>{row.employee}</span>
                                                                                </td>
                                                                                {row.status.map((status, statusIndex) => (
                                                                                    <td key={statusIndex} className={getStatusClass(status)}>

                                                                                    </td>
                                                                                ))}
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
															</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex mt-2">
                                        <div className="card flex-fill comman-shadow oxyem-index task_page_main">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body custom-card-padding-0">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border task_bar_cs_padding" >
                                                        <div className="taskbar-attendance_section_page">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <h3 className='head_text'>{alloctnheadline}</h3> <span className='highlight_pt_txt'>{allocationavg} Allocation</span>
                                                                <button className="btn btn-link cs_button_task" onClick={toggleCollapseAttendance}>
                                                                    {isCollapsedAttendance ? <FaChevronDown /> : <FaChevronUp />}
                                                                </button>
                                                            </div>
                                                            {!isCollapsedAttendance && (
															<div className="taskbar_bottom_collapsed_section">
                                                                <table className="table table-striped custom-table table-nowrap custom-table-taskbar">
                                                                    <thead>
                                                                        <tr>
                                                                            {headersAlloction.map((header, index) => (
                                                                                <th key={index} className={header === 'Employee Name' ? 'tr_emp_name' : ''} dangerouslySetInnerHTML={{ __html: header }} />
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {tableDataAlloction.map((row, rowIndex) => (
                                                                            <tr key={rowIndex}>
                                                                                <td className='task_bar_profile'>
                                                                                    <Profile name={row.employee} imageurl={row.profilePicture || ""} size={"28"} 
                                                                                    profilelink={`/employeeDashboard/${row.idEmployee}` || ""}
                                                                                    />
                                                                                    <span onClick={() => openProfile(row)} className='pr_text'>{row.employee}</span>
                                                                                </td>
                                                                                {row.status.map((status, statusIndex) => {
                                                                                    let className = "";
                                                                                    let displayValue = status;

                                                                                    if (status === 'holiday') {
                                                                                        className = "oxy_table_holiday";
                                                                                        displayValue = ""; // Hide the value
                                                                                    }
                                                                                   else if (status === 'weekend') {
                                                                                        className = "oxy_table_weekend";
                                                                                        displayValue = ""; // Hide the value
                                                                                    }
                                                                                    
                                                                                    else if (status === '0%') {
                                                                                        className = "oxy_table_check";
                                                                                        displayValue = ""; // Hide the value
                                                                                    } else if (status === '100%') {
                                                                                        className = "oxy_table_full";
                                                                                    } else if (/^\d+%$/.test(status) && parseInt(status) >= 0 && parseInt(status) <= 99) {
                                                                                        className = "oxy_table_added";
                                                                                    } else{
                                                                                        className = "oxy_table_uncheck";
                                                                                    }

                                                                                    return (
                                                                                        <td key={statusIndex} className={className}>
                                                                                            {displayValue}
                                                                                        </td>
                                                                                    );
                                                                                })}


                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
															</div>
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
            <ToastContainer />
        </>

    );
}