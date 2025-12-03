import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablenew.jsx';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { FaTimes } from "react-icons/fa";
import View from '../../Components/Popup/AttendenceHistroy';
import ViewAssign from '../../Components/Popup/AssignmemberHistroy';
import TimesheetPopup from '../../Components/Popup/employeeTimesheet';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { Toaster, toast } from 'react-hot-toast';
import Head from 'next/head';
import pageTitles from '../../../common/pageTitles.js';

export default function adminDashboard({ }) {





    const router = useRouter();
    const [datacoloum, setDatacoloum] = useState([]);
    const [rowData, setRowData] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleEditClick = (id) => {
        router.push(`/attendance/${id}`);
    };

    const fetchData = async () => {
        try {
            const response = await axiosJWT.get(`${apiUrl}/timesheet/getPendingTimesheetDtls`);
            if (response) {

                setDatacoloum(response.data.data.formcolumns);
                //setRowData(columneeData);
                const timesheetData = response.data.data.timesheetData;

                

                setRowData(timesheetData);


            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");
    const handleHistoryClick = async (id) => {
        //setIsHistroyId(id)
       // openDetailpopup()
    }
    const openDetailpopup = async () => {
        setIsModalOpen(true)
    }
    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }

    const handleApprrovereq = async (id, type, data, onSuccess) => {

        const apipayload ={
            "status": type,
            "idTimesheet": id,
            "rejectReason":data
        }
        const message = type === 'approved' 
        ? 'You have successfully <strong>Approved</strong> timesheet!'
        : 'You have successfully <strong>Rejected</strong> timesheet!';
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
    const [isAssignModalOpen, setIAssignsModalOpen] = useState(false);
    const [isAssignMemId, setIsAssignId] = useState("");

    const openAssignpopup = async () => {
        setIAssignsModalOpen(true)
    }
    const closeAssignpopup = async () => {
        setIAssignsModalOpen(false)
    }
	
	const [isTimeSheetModal, setTimeSheetModal] = useState(false);
    const [timesheetId, settimesheetId] = useState("");
    const onViewClick = (id) => {
        settimesheetId(id)
        openTimesheetpopup();
        //router.push(`/employeeTimeSheet/${id}`);
    };

    const openTimesheetpopup = async () => {
        setTimeSheetModal(true)
    }
    const closeTimesheetpopup = async () => {
        setTimeSheetModal(false)
    }
    const closeAfterAction = async () => {
        fetchData();
        setTimeSheetModal(false)
    }

    return (
        <>
                    <Head>
        <title>{pageTitles.TimesheetPendingForApprovals}</title>
        <meta name="description" content={pageTitles.TimesheetPendingForApprovals} />
    </Head>
			<TimesheetPopup isOpen={isTimeSheetModal} closeModal={closeTimesheetpopup} isfor={"pending"} timesheetId={timesheetId} closeAfterAction={closeAfterAction} section={"pendingApprove"} sectionName={"Timesheet Approval"}/>
            <ViewAssign isOpen={isAssignModalOpen} closeModal={closeAssignpopup} isHistroyId={isAssignMemId} section={"employeeAttendance"} />
            <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"employeeAttendance"} />
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">

                        <Breadcrumbs maintext={"Pending for Approval"} />

                        <div className="row">

                            <div className="col-12 col-lg-12 col-xl-12">

                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title={""}
                                                            data={rowData}
                                                            columnsdata={datacoloum}
                                                            ismodule={'timesheet'}
                                                            onViewClick={onViewClick}
                                                            onEditClick={handleEditClick}
                                                            onHistoryClick={handleHistoryClick}
                                                            handleApprrovereq={handleApprrovereq}
                                                        />
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
