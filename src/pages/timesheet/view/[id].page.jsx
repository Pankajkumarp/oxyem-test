import { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbsdiscription';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
export default function viewDashboard({ }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [viewDetail, setViewDetails] = useState({ "endDate": "2025-12-28", "idAssignTask": "45308472-bbb1-42e8-b9c1-2e4ba6765ebe", "idProject": "a0ecf9a0-6fc2-42fb-97e3-68544da6ec6b", "startDate": "2025-12-09", "timesheetDescription": "Test:654321", "status": "inProgress", "taskList": [{ "employeeName": "pankaj kumar", "endDate": "2025-12-28", "idProject": "a0ecf9a0-6fc2-42fb-97e3-68544da6ec6b", "projectCode": "1161", "projectName": "Test Rja", "startDate": "2025-12-09", "status": "open", "taskCode": "CDRV", "taskName": "test", "assignedTo": [{ "idEmployee": "6b3e92b2-a81f-4537-8272-19aa679a1cca", "taskPercentage": "20", "employeeName": "Rajashekhar Reddy", "submittedPercentage": 15, "colour": "Amber" }, { "idEmployee": "da3cb07d-3dfe-420e-b24d-d0cca3e8a334", "taskPercentage": "20", "employeeName": "pankaj kumar", "submittedPercentage": 0, "colour": "Red" }] }, { "employeeName": "pankaj kumar", "endDate": "2025-12-25", "idProject": "a0ecf9a0-6fc2-42fb-97e3-68544da6ec6b", "projectCode": "1161", "projectName": "Test Rja", "startDate": "2025-12-17", "status": "open", "taskCode": "PMCOM", "taskName": "Test task 2", "assignedTo": [{ "idEmployee": "6b3e92b2-a81f-4537-8272-19aa679a1cca", "taskPercentage": "23", "employeeName": "Rajashekhar Reddy", "submittedPercentage": 0, "colour": "Red" }, { "idEmployee": "da3cb07d-3dfe-420e-b24d-d0cca3e8a334", "taskPercentage": "22", "employeeName": "pankaj kumar", "submittedPercentage": 0, "colour": "Red" }] }, { "employeeName": "Rajashekhar Reddy", "endDate": "2025-12-28", "idProject": "a0ecf9a0-6fc2-42fb-97e3-68544da6ec6b", "projectCode": "1161", "projectName": "Test Rja", "startDate": "2025-12-26", "status": "open", "taskCode": "GOLV", "taskName": "Test task 3", "assignedTo": [{ "idEmployee": "da3cb07d-3dfe-420e-b24d-d0cca3e8a334", "taskPercentage": "26", "employeeName": "pankaj kumar", "submittedPercentage": 0, "colour": "Red" }, { "idEmployee": "6b3e92b2-a81f-4537-8272-19aa679a1cca", "taskPercentage": "27", "employeeName": "Rajashekhar Reddy", "submittedPercentage": 0, "colour": "Red" }] }] });
    const getProjectValue = async (id) => {
        try {

            const response = await axiosJWT.get(`${apiUrl}/timesheet/viewFullTaskInfo`, {
                params: {
                    idAssignTask: id,
                },
            });
            if (response) {
                const apiResponse = response.data.data
                console.log("apiResponse", apiResponse)
                setViewDetails(apiResponse)
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
    }, [router.query.id]);;

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
                                        <div class="card-body oxyem-mobile-card-body">

                                            <div class="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                <h2 className='head-text-box'>Timesheet Details</h2>
                                                <div className='timesheet-view-datail'>
                                                    <p><strong>Project Name: </strong> {viewDetail?.projectName}</p>
                                                    <p><strong>Start Date:</strong> {viewDetail?.startDate}</p>
                                                    <p><strong>End Date:</strong> {viewDetail?.endDate}</p>
                                                    <p><strong>Description:</strong> {viewDetail?.timesheetDescription}</p>
                                                    <p><strong>Status:</strong> <span className={`ms-2 oxyem-mark-${viewDetail?.status}`}>{viewDetail?.status}</span></p>
                                                </div>
                                                <h3 className='head-text-box mt-3'>Task Assignment Details</h3>
                                                <div className="table-responsive custom-made-table">
                                                    {viewDetail?.taskList?.map((task) => (
                                                        <div key={task.taskCode} className="main-collapse-box-timesheet">
                                                            <div
                                                                className="collapse-box-timesheet-btn"
                                                                onClick={() => toggleTask(task.taskCode)}
                                                            >
                                                                <div>
  <strong>{task.taskName}</strong> <span className="collapse-box-timesheet-s">({task.taskCode}) – {task.assignedTo?.length} Persons</span>
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
                                                                <div className="table-responsive">
                                                                    <table className="table table-bordered mb-0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Employee Name</th>
                                                                                <th>Planned Effort (hrs)</th>
                                                                                <th>Submitted Effort (hrs)</th>
                                                                                <th>Work Status</th>
                                                                            </tr>
                                                                        </thead>

                                                                        <tbody>
                                                                            {task.assignedTo?.map((emp) => (
                                                                                <tr key={emp.idEmployee}>
                                                                                    <td>{emp.employeeName}</td>
                                                                                    <td>{emp.taskPercentage}</td>
                                                                                    <td>{emp.submittedPercentage}</td>
                                                                                    <td>
                                                                                        <span
                                                                                            className={`oxyem-circle oxyem-circle-mark-${emp.colour}`}
                                                                                        ></span>
                                                                                    </td>
                                                                                </tr>
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
