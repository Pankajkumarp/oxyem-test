import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import HistroyView from '../Components/Popup/assetHistroy';
import EditAllocation from '../Components/Popup/EditAllocation';
import { axiosJWT } from '../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegClock, FaTimes } from "react-icons/fa";
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import View from './history';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import pageTitles from '../../common/pageTitles.js';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AllocationManagement() {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isviewId, setIsViewId] = useState("");
    const [isModalOpenEditAllocation, setIsModalOpenEditAllocation] = useState(false);
    const [AllocationId, setAllocationId] = useState("");
    const [tableRefresh, setTableRefresh] = useState(false); // State to trigger table refresh
    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };

    const onViewClick = (id) => {
        // router.push(`/payrollPreview`);
    };

    const onHistoryClick = async (id) => {
        setIsViewId(id);
        openDetailpopup();
    };

    const openDetailpopup = async () => {
        setIsModalOpen(true);
    };

    const closeDetailpopup = async () => {
        setIsModalOpen(false);
        setIsViewId("")
    };

    const onEditClick = (id) => {
        setAllocationId(id);
        setIsModalOpenEditAllocation(true);
    };

    const closeAllocationDetailpopup = async () => {
        setIsModalOpenEditAllocation(false);
        setAllocationId("");
        setTimeout(() => {
            setTableRefresh(true); // Refresh the table after 2 seconds
        }, 2000); // 2000ms = 2 seconds

    };

    const onSubmit = async (data) => {
        const { idEmployee, section } = data;
        const idAssetAllocation = idEmployee;

        let allocationEndDate = null;
        section.forEach((sec) => {
            if (sec.SectionName === 'EditAllocation') {
                sec.fields.forEach((field) => {
                    if (field.name === 'allocationEndDate') {
                        allocationEndDate = field.attributeValue;
                    }
                });
            }
        });

        const transformedData = {
            idAssetAllocation,
            allocationEndDate
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/allocationExtend';
            const response = await axiosJWT.post(apiUrl, transformedData);

            if (response.status === 200) {
                ToastNotification({ message: response.data.message });
                closeAllocationDetailpopup();
                setTableRefresh(true);
                setTimeout(() => {
                    setTableRefresh(false); // Refresh the table after 2 seconds
                }, 2000); // 2000ms = 2 seconds
            }
        } catch (error) {
            // Handle error
        }
    };

    const handleApprrovereq = async (id, type, data, onSuccess) => {
        const apipayload = {
            "status": type,
            "idAssetAllocations": id,
            "rejectReason": data
        }

        const message = type === 'approved'
            ? 'You have successfully <strong>Approved</strong>!'
            : 'You have successfully <strong>Rejected</strong>!';
        const errormessage = 'Error connecting to the backend. Please try after Sometime.';
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/asset/approveOrReject`, apipayload);
            // Handle the response if needed
            if (response) {
                onSuccess("clear");
                setTableRefresh(true);
                setTimeout(() => {
                    setTableRefresh(false); // Refresh the table after 2 seconds
                }, 2000); // 2000ms = 2 seconds
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

        }
    }





    const handleDeallocationreq = async (value) => {
        try {
            if (value) {
                const formData = new FormData();
                const filteredValue = {
                    ...value,
                    section: value.section.filter(section => section.SectionName !== 'Preview' && section.SectionName !== 'Documents')
                };

                // Change key from idEmployee to idAssetAllocation
                if (filteredValue.idEmployee) {
                    filteredValue.idAssetAllocation = filteredValue.idEmployee;
                    delete filteredValue.idEmployee;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/deallocateAsset';
                formData.append('formData', JSON.stringify(filteredValue));

                // Append the document file (assuming you have the file to append)
                // formData.append('uploadDocument', value.section[0].fields.find(field => field.name === 'uploadDocument').attributeValue);

                const response = await axiosJWT.post(apiUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (response.status === 200) {
                    // Uncomment the following line if you want to show a toast notification
                    ToastNotification({ message: response.data.message });

                    // Uncomment the following line if you want to navigate to asset management page
                    // Router.push('/asset-management');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.errors || [];
                const errorMessage = errors.map(err => err.msg).join('.</br>') || 'Failed to submit the form. Please try again later.';

                // Uncomment the following line if you want to show a toast notification
                // ToastNotification({ message: errorMessage });

                console.log(errorMessage);
            } else {
                console.error('Error:', error);
                // Uncomment the following line if you want to show a toast notification
                // ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            }
        }
    };

    const [assetAllocationStats, setAssetAllocationStats] = useState({});

    const fetchAssetAllocationStats = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/asset/allocationstats`);
            const responsedata = response.data.data || {};

            // ✅ Dummy stats data (based on allocation table)
            // const responsedata = {
            //     totalAllocated: 0,        // total allocated assets
            //     totalAllocatedHardware: 0, // allocated hardware assets
            //     totalAllocatedSoftware: 0, // allocated software assets
            //     totalDeallocated: 1,       // total deallocated assets
            // };

            setAssetAllocationStats(responsedata);
        } catch (error) {
            console.error("Error fetching asset allocation stats:", error);
        }
    };

    useEffect(() => {
        fetchAssetAllocationStats();
    }, []);


    const [isAssetAllocationChartOpen, setIsAssetAllocationChartOpen] = useState(false);

    const [allocationStatusBarChartData, setAllocationStatusBarChartData] = useState();
    const [allocationCategoryBarChartData, setAllocationCategoryBarChartData] = useState();
    const [allocationMonthlyBarChartData, setAllocationMonthlyBarChartData] = useState();
    const [allocationDeptBarChartData, setAllocationDeptBarChartData] = useState();

    useEffect(() => {
        const getAssetAllocationCharts = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/asset/allocationgraph`);
                const allocationChartResponse = response.data.data || {};

                // 🚀 Dummy API Response
                //   const allocationChartResponse = {
                //     status: {
                //       categories: ["Allocated", "Deallocated"],
                //       data: [0, 1]
                //     },
                //     category: {
                //       categories: ["Hardware", "Software"],
                //       data: [0, 0]
                //     },
                //     monthly: {
                //       categories: [
                //         "Sep-2025", "Oct-2025", "Nov-2025", "Dec-2025",
                //         "Jan-2026", "Feb-2026", "Mar-2026", "Apr-2026", "May-2026"
                //       ],
                //       allocated: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                //       deallocated: [1, 0, 0, 0, 0, 0, 0, 0, 0]
                //     },
                //     department: {
                //       categories: ["Tech", "HR", "Finance", "Operations"],
                //       data: [10, 4, 3, 2]
                //     }
                //   };

                // 📊 Chart 1 - Status (Allocated / Deallocated)
                setAllocationStatusBarChartData({
                    series: [{ name: "Assets", data: allocationChartResponse.status.data }],
                    options: {
                        chart: {
                            type: "bar",
                            height: 350,
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const category =
                                        chartContext.w.config.labels?.[config.dataPointIndex] ||
                                        chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                                    if (!category) return;
                                    requestAnimationFrame(() => {
                                        setSearchfilter({ status: category });
                                        setActiveTab(1);
                                        setActiveStatus(category);
                                    });
                                },
                            },
                        },
                        xaxis: { categories: allocationChartResponse.status.categories },
                        colors: ["#1e88e5"],
                        legend: { position: "bottom" },
                        dataLabels: { enabled: true },
                    },
                });

                // 📊 Chart 2 - Category (Hardware / Software)
                setAllocationCategoryBarChartData({
                    series: [{ name: "Assets", data: allocationChartResponse.category.data }],
                    options: {
                        chart: {
                            type: "bar",
                            height: 350,
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const category =
                                        chartContext.w.config.labels?.[config.dataPointIndex] ||
                                        chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                                    if (!category) return;
                                    requestAnimationFrame(() => {
                                        setSearchfilter({ assetsCategories: category });
                                        setActiveTab(1);
                                        setActiveStatus(category);
                                    });
                                },
                            },
                        },
                        xaxis: { categories: allocationChartResponse.category.categories },
                        colors: ["#43a047"],
                        legend: { position: "bottom" },
                        dataLabels: { enabled: true },
                    },
                });

                // 📊 Chart 3 - Monthly Allocation (Allocated / Deallocated)
                setAllocationMonthlyBarChartData({
                    series: [
                        { name: "Allocated", data: allocationChartResponse.monthly.allocated },
                        { name: "Deallocated", data: allocationChartResponse.monthly.deallocated },
                    ],
                    options: {
                        chart: {
                            type: "bar",
                            height: 350,
                            stacked: true,
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const category =
                                        chartContext.w.config.labels?.[config.dataPointIndex] ||
                                        chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                                    if (!category) return;
                                    requestAnimationFrame(() => {
                                        setSearchfilter({ allocationStartDate1: category });
                                        setActiveTab(1);
                                        setActiveStatus(category);
                                    });
                                },
                            },
                        },
                        xaxis: { categories: allocationChartResponse.monthly.categories },
                        colors: ["#43a047", "#e53935"],
                        legend: { position: "bottom" },
                    },
                });

                // 📊 Chart 4 - Department Wise Allocation
                setAllocationDeptBarChartData({
                    series: [{ name: "Assets", data: allocationChartResponse.department.data }],
                    options: {
                        chart: {
                            type: "bar",
                            height: 350,
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const category =
                                        chartContext.w.config.labels?.[config.dataPointIndex] ||
                                        chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                                    if (!category) return;
                                    requestAnimationFrame(() => {
                                        setSearchfilter({ allocationDepartment: category });
                                        setActiveTab(1);
                                        setActiveStatus(category);
                                    });
                                },
                            },
                        },
                        xaxis: { categories: allocationChartResponse.department.categories },
                        colors: ["#ff9800"],
                        legend: { position: "bottom" },
                        dataLabels: { enabled: true },
                    },
                });

                setIsAssetAllocationChartOpen(true);
            } catch (error) {
                console.error("Error fetching allocation chart data:", error);
            }
        };

        getAssetAllocationCharts();
    }, []);


    const [searchfilter, setSearchfilter] = useState({});
    const [activeStatus, setActiveStatus] = useState(null);
    const [activeTableTab, setActiveTableTab] = useState("");

    const handleShowDataForStatus = (filterKey) => {
        setActiveTab(1); // switch to table tab
        setActiveTableTab(filterKey);
        setActiveStatus(filterKey);

        if (filterKey === "clr") {
            setSearchfilter({});
            setActiveStatus(null);
        } else {
            let filter = {};

            switch (filterKey) {
                case "Deallocated":
                    setSearchfilter({ status: "deallocated" });
                    break;
                case "Hardware":
                    setSearchfilter({ assetsCategories: "Hardware" });
                    break;
                case "Software":
                    setSearchfilter({ assetsCategories: "Software" });
                    break;
                case "Allocated":
                    setSearchfilter({ status: "allocated" });
                    break;
            }
        }
    };


    return (
        <>
            <Head><title>{pageTitles.Manageasset}</title></Head>
            <EditAllocation isOpen={isModalOpenEditAllocation} closeModal={closeAllocationDetailpopup} AllocationId={AllocationId} section={"employeeLeave"} onSubmit={onSubmit} />
            <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isviewId} section={"adminAttendance"} datafor={'groups'} />
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Dashboard (Allocation Management)"} addlink={"/allocateAssets"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                    <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                        <li className={`nav-item ${activeTab === 0 ? 'active' : ''}`}>   {/* ✅ className */}
                                            <a className="nav-link" onClick={() => handleTabClick(0)}>   {/* ✅ className */}
                                                <div className="skolrup-profile-tab-link">Summary Overview</div>
                                            </a>
                                        </li>
                                        <li className={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                                            <a className="nav-link" onClick={() => handleTabClick(1)}>
                                                <div className="skolrup-profile-tab-link">Detailed Records</div>
                                            </a>
                                        </li>
                                    </ul>


                                </div>

                                {activeTab === 0 && (

                                    <>
                                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                            <div className="">
                                                <div>
                                                    {assetAllocationStats && Object.keys(assetAllocationStats)?.length > 0 &&
                                                        <div className="oxyem-top-box-design design-only-attendence leave-top-data-main mx-0 row stats-grid">

                                                            {/* 🔹 Total Allocated Assets */}
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Allocated")}>
                                                                    <img src='/assets/img/available.png' alt="allocated" />
                                                                    <div className='ox-colored-box-1'>
                                                                        <h4 className='all_attendence'>
                                                                            {assetAllocationStats.totalAllocated}<br />
                                                                        </h4>
                                                                    </div>
                                                                    <div className='ox-box-text'><h6>Allocated</h6></div>
                                                                </div>
                                                            </div>

                                                            {/* 🔹 Total Allocated Hardware Assets */}
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Hardware")}>
                                                                    <img src='/assets/img/hardware.png' alt="allocated hardware" />
                                                                    <div className='ox-colored-box-2'>
                                                                        <h4 className='month_attendence'>
                                                                            {assetAllocationStats.totalAllocatedHardware}<br />
                                                                        </h4>
                                                                    </div>
                                                                    <div className='ox-box-text'><h6>Hardware</h6></div>
                                                                </div>
                                                            </div>

                                                            {/* 🔹 Total Allocated Software Assets */}
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Software")}>
                                                                    <img src='/assets/img/software.png' alt="allocated software" />
                                                                    <div className='ox-colored-box-3'>
                                                                        <h4 className='notsubmit_attendence'>
                                                                            {assetAllocationStats.totalAllocatedSoftware}<br />
                                                                        </h4>
                                                                    </div>
                                                                    <div className='ox-box-text'><h6>Software</h6></div>
                                                                </div>
                                                            </div>

                                                            {/* 🔹 Total Deallocated Assets */}
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Deallocated")}>
                                                                    <img src='/assets/img/deallocated.png' alt="deallocated" />
                                                                    <div className='ox-colored-box-4 '>
                                                                        <h4 className='week_attendence'>
                                                                            {assetAllocationStats.totalDeallocated}<br />
                                                                        </h4>
                                                                    </div>
                                                                    <div className='ox-box-text'><h6>Deallocated</h6></div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                        </div>
                                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                            <div className="tab-content">
                                                {isAssetAllocationChartOpen && (
                                                    <div>
                                                        <div className="row">

                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">


                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Allocation Status</h3>
                                                                    </div>
                                                                    {allocationStatusBarChartData && (
                                                                        <Chart
                                                                            options={allocationStatusBarChartData.options}
                                                                            series={allocationStatusBarChartData.series}
                                                                            type="bar"
                                                                            height={330}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* 📊 Chart 2: Allocation Category (Bar) */}
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">


                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Allocation Category</h3>
                                                                    </div>
                                                                    {allocationCategoryBarChartData && (
                                                                        <Chart
                                                                            options={allocationCategoryBarChartData.options}
                                                                            series={allocationCategoryBarChartData.series}
                                                                            type="bar"
                                                                            height={330}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="row mt-4">

                                                            {/* 📊 Chart 3: Monthly Allocation in FY (Bar) */}
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">


                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Monthly Allocation in FY</h3>
                                                                    </div>
                                                                    {allocationMonthlyBarChartData && (
                                                                        <Chart
                                                                            options={allocationMonthlyBarChartData.options}
                                                                            series={allocationMonthlyBarChartData.series}
                                                                            type="bar"
                                                                            height={330}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* 📊 Chart 3: Monthly Allocation in FY (Bar) */}
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">


                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Department Wise Allocation</h3>
                                                                    </div>
                                                                    {allocationDeptBarChartData && (
                                                                        <Chart
                                                                            options={allocationDeptBarChartData.options}
                                                                            series={allocationDeptBarChartData.series}
                                                                            type="bar"
                                                                            height={330}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                        </div></>
                                )}

                                {activeTab === 1 && (
                                    <div className="row">
                                        <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                            <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                                                <div className="center-part">
                                                    <div className="card-body oxyem-mobile-card-body">
                                                        <div className="col-md-6">{activeStatus !== null && (
                                                            <div className="active-filter-tag">
                                                                <span> {typeof activeStatus === "string"
                                                                    ? activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)
                                                                    : activeStatus}</span>
                                                                <button onClick={() => handleShowDataForStatus('clr')} className="remove-filter-btn">×</button>
                                                            </div>
                                                        )}</div>
                                                        <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                            <CustomDataTable
                                                                title={""}
                                                                onViewClick={onViewClick}
                                                                onHistoryClick={onHistoryClick}
                                                                onEditClick={onEditClick}
                                                                handleApprrovereq={handleApprrovereq}
                                                                handleDeallocationreq={handleDeallocationreq}
                                                                pagename={"addpayroll"}
                                                                dashboradApi={'/asset/viewAssetAllocationList'}
                                                                refreshAfterEdit={tableRefresh} // Pass the refresh state as a prop
                                                                checkboxbuttonName={"Allocate"}
                                                                searchfilter={searchfilter}

                                                            />
                                                        </div>
                                                    </div>
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
            <ToastContainer />
        </>
    );
}
