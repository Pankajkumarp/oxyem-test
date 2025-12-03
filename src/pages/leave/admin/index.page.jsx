import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import { reorderColumns, reorderEntries, sortData } from '../../../common/commonFunctions';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SelectComponent from '../../Components/common/SelectOption/SelectComponent.jsx';
import { FaTimes } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';
import View from '../../Components/Popup/Leaveview';
import Recall from '../../Components/Popup/Recallmodal';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import Head from 'next/head';
import pageTitles from '../../../common/pageTitles.js';

export default function Leaveview({ }) {
    const router = useRouter();
    const [leavelisting, setLeaveListing] = useState([]);
    const [formcolumn, setFormColumn] = useState([]);
    const [leavesummary, setLeaveSummary] = useState([]);
    const [updleavelist, setUpdLeaveList] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [toplist, setToplist] = useState({});


    const desiredOrder = ["srno", "id", "employeeName", "leaveType", "fromDate", "toDate", "numberofDays", "leaveReason", "status", "action"];

    const sortColumns = (columns) => {
        return columns.sort((a, b) => {
            return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
        });
    };
    const sortAndFilterAllocationList = (allocationList) => {
        return allocationList.map(row => {
            return row.filter(item => item.name !== 'idProject')
                .sort((a, b) => {
                    return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
                });
        });
    };

    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };
    async function fetchLeaveData() {

        let responsedata = ""
        try {
            const response = await axiosJWT.get(`${apiUrl}/leave/getStats`, { params: { "isFor": "admin" } })
            if (response) {
                setToplist(response.data.data || {});
            }
        } catch (error) {


        }
    }

    useEffect(() => {
        if (activeTab === 0) {
            fetchLeaveData()
        }
    }, [activeTab])

    const [isVisible, setIsVisible] = useState(false);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };
    const handleEditClick = (id) => {
        router.push(`/addleave/${id}`);
    };
    const [isrecallId, setIsRecallId] = useState("");
    const [isModalOpenRe, setIsModalOpenRe] = useState(false);
    const handleSubmitData = async (data) => {

        try {
            if (!data.leavereason || data.leavereason.trim() === '') {
                let resparr = { type: "danger", message: "Leave reason is required", popup: "recall" }
                setResponseData(resparr)
                return;
            }


            let recallPostdata = {
                "idLeave": isrecallId,
                "status": "recalled",
                "leaveReason": data.leavereason
            }
            // console.log(recallPostdata)
            const message = 'You have successfully <strong>Recall</strong> Your Leave!';
            const errormessage = 'Error connecting to the backend. Please try after Sometime.';
            const response = await axiosJWT.post(`${apiUrl}/leave/recall`, recallPostdata)
            const apiresponse = response.data != "" ? response.data : "";
            // console.log(apiresponse)
            if (response) {
                setIsModalOpenRe(false)
                fetchLeaveData();
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <img src='/assets/img/recall.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
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
            let resparr = { type: "danger", message: error.message, popup: "recall" }
            setResponseData(resparr)
        }

    };


    const chartCategoryMap = {
        "Birthday": { leaveType: "Birthday" },
        "Earned Leave": { leaveType: "EarnedLeave" },
        "Loss of Pay": { leaveType: "LossOfPay" },
        "Maternity": { leaveType: "Maternity" },
    };

    const getMonthInYYYYMM = (category) => {
        // Agar category full month name ho like "July"
        const date = new Date(category + " 1, 2025"); // fix year or use dynamic
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`;
    };

    const formatCategoryDate = (category) => {
        // Example input: "2025-Sep-18"
        const date = new Date(category); // JS Date samajh lega
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; // Output: 2025-09-18
    };

    const getFilterFromChartCategory = (category) => {
        switch (category) {
            case "Birthday":
                return { leaveType: "Birthday" };
            case "Earned Leave":
                return { leaveType: "EarnedLeave" };
            case "Loss of Pay":
                return { leaveType: "LossOfPay" };
            case "Maternity":
                return { leaveType: "Maternity" };
            case "Paternity":
                return { leaveType: "Paternity" };
            default:
                return {};
        }
    };

    const optionsmonth = [
        { value: 'Jan', label: 'January' },
        { value: 'Feb', label: 'February' },
        { value: 'Mar', label: 'March' },
        { value: 'Apr', label: 'April' },
        { value: 'May', label: 'May' },
        { value: 'Jun', label: 'June' },
        { value: 'Jul', label: 'July' },
        { value: 'Aug', label: 'August' },
        { value: 'Sep', label: 'September' },
        { value: 'Oct', label: 'October' },
        { value: 'Nov', label: 'November' },
        { value: 'Dec', label: 'December' },
    ];
    // const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    // console.log(currentMonth,"this is month value")

    const currentYear = new Date().getFullYear().toString();
    // console.log(currentYear)
    const optionsyear = [];
    for (let year = 2000; year <= currentYear; year++) {
        optionsyear.push({ value: year.toString(), label: year.toString() });
    }
    // console.log(optionsyear,"opyear")
    const [setMouth, setMonthValue] = useState(currentMonth); // State to manage active tab index
    const [setYear, setYearValue] = useState(currentYear); // State to manage active tab index
    const onChangeMonth = (value) => {
        if (value !== null) {
            // console.log(value)
            setMonthValue(value.value); // Update active tab index when a tab is clicked
            // console.log(setMouth,"onchange")
        } else {
            setMonthValue();
        }
    };
    const onChangeYear = (value) => {
        if (value !== null) {
            setYearValue(value.value); // Update active tab index when a tab is clicked
        } else {
            setYearValue();
        }
    };
    const [isannualOpen, setIsAnnualOpen] = useState(false);
    const [mounthChartData, setMounthChartData] = useState();
    const [annualTrendData, setAnnualTrendData] = useState();
    const [monthlyTrendData, setMonthlyTrendData] = useState();
    // console.log(setMouth,"this si what month looks like")
useEffect(() => {
  if (setMouth && setYear) {
    const getgraphData = async () => {
      const apipayload = {
        month: setMouth,
        year: setYear,
        isFor: "admin",
      };

      try {
        const response = await axiosJWT.post(`${apiUrl}/leave/getLeaveChart`, apipayload);
        if (response) {
          const mounthchart = response.data.data.monthlyTotal;
          const yeartrendchart = response.data.data.anualTrend;
          const monthlytrendchart = response.data.data.monthlyTrend;

          // --- MONTH CHART (PIE) ---
          setMounthChartData({
            series: mounthchart.data,
            options: {
              chart: {
                width: 400,
                type: "pie",
                events: {
                  dataPointSelection: (event, chartContext, config) => {
                    const idx = config.dataPointIndex;
                    const category = config.w.config.labels[idx];
                    if (!category) return;

                    requestAnimationFrame(() => {
                      const filter = getFilterFromChartCategory(category);
                      setSearchfilter(filter);
                      setActiveTab(1);
                      setActiveTableTab(category);
                      setActiveStatus(category);
                    });
                  },
                },
              },
              labels: mounthchart.categories,
              colors: ["#26AF48", "#2196F3", "#FA7E12"],
              title: { text: "", align: "center" },
              legend: { position: "bottom" },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: { width: 200 },
                    legend: { position: "bottom" },
                  },
                },
              ],
            },
          });

          // --- ANNUAL TREND CHART ---
          setAnnualTrendData({
            series: [{ name: "Total Day", data: yeartrendchart.data }],
            options: {
              chart: {
                height: 350,
                type: "line",
                zoom: { enabled: false },
                events: {
                  click: (event, chartContext, config) => {
                    const pointIndex = config?.dataPointIndex;
                    if (pointIndex === undefined || pointIndex === -1) return;

                    const category = yeartrendchart.categories?.[pointIndex];
                    if (!category) return;

                    const selectedMonth = getMonthInYYYYMM(category);
                    requestAnimationFrame(() => {
                      setSearchfilter({ month: selectedMonth });
                      setActiveTab(1);
                      setActiveTableTab(category);
                      setActiveStatus(category);
                    });
                  },
                },
              },
              dataLabels: { enabled: false },
              stroke: { width: 1, curve: "straight", colors: ["#156082"] },
              markers: { colors: "#156082" },
              title: { text: "", align: "left" },
              grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
              xaxis: { categories: yeartrendchart.categories },
            },
          });

          // --- MONTHLY TREND CHART ---
          setMonthlyTrendData({
            series: [{ name: "Total Day", data: monthlytrendchart.data }],
            options: {
              chart: {
                height: 350,
                type: "line",
                zoom: { enabled: false },
                events: {
                  click: (event, chartContext, config) => {
                    const pointIndex = config?.dataPointIndex;
                    if (pointIndex === undefined || pointIndex === -1) return;

                    const category = monthlytrendchart.categories?.[pointIndex];
                    if (!category) return;

                    const formattedDate = formatCategoryDate(category);
                    requestAnimationFrame(() => {
                      setSearchfilter({ currentDate: formattedDate });
                      setActiveTab(1);
                      setActiveTableTab(category);
                      setActiveStatus(category);
                    });
                  },
                },
              },
              dataLabels: { enabled: false },
              stroke: { width: 1, curve: "straight", colors: ["#156082"] },
              markers: { colors: "#156082" },
              title: { text: "", align: "left" },
              grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
              xaxis: { categories: monthlytrendchart.categories },
            },
          });

          setIsAnnualOpen(true);
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };

    getgraphData();
  }
}, [setMouth, setYear]); // ✅ activeTab removed



    const handleApprrovereq = async (id, type, data, onSuccess) => {
        const apipayload = {
            "status": type,
            "idLeaves": id,
            "rejectReason": data
        }
        const message = type === 'approved'
            ? 'You have successfully <strong>Approved</strong> Leave!'
            : 'You have successfully <strong>Rejected</strong> Leave!';
        const errormessage = 'Error connecting to the backend. Please try after Sometime.';
        try {
            const response = await axiosJWT.post(`${apiUrl}/leave/approval`, apipayload);
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

                fetchLeaveData();
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isviewId, setIsViewId] = useState("");
    const handleHistoryClick = async (id) => {
        setIsViewId(id)
        openDetailpopup()
    }
    const openDetailpopup = async () => {
        setIsModalOpen(true)
    }
    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }
    const handlerecallvalueClick = async (id) => {
        setIsRecallId(id)
        openRecallpopup()
    }


    const openRecallpopup = async () => {
        setIsModalOpenRe(true)
    }
    const closeDetailpopupRe = async () => {
        setIsModalOpenRe(false)
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
                case "leavesOnToday":
                    const today = new Date().toISOString().split("T")[0];
                    setSearchfilter({ currentDate: today });
                    break;
                case "submitted":
                    setSearchfilter({ status: "submitted" });
                    break;
                case "LossOfPay":
                    setSearchfilter({ leaveType: "LossOfPay" });
                    break;
                case "currentMonthEmpLeaveCount":
                    // filter = { special: "monthTotal" }; 
                    break;
            }

            // setSearchfilter(filter);
            // console.log("Applied filter:", filter);
        }
    };



    return (
        <>
            <Head><title>{pageTitles.LeavesTeamDashboard}</title></Head>
            <Recall isOpen={isModalOpenRe} closeModal={closeDetailpopupRe} onSubmit={handleSubmitData} />
            <View isOpen={isModalOpen} closeModal={closeDetailpopup} isviewId={isviewId} section={"employeeLeave"} />
            <div className="main-wrapper leave_dashborad_page">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Admin Dashboard (Leaves)"} addlink={"/leave/addleave"} />


                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                    <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                        <li class={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTabClick(0)}>
                                                <div className="skolrup-profile-tab-link">Summary Overview</div>
                                            </a>
                                        </li>
                                        <li class={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTabClick(1)}>
                                                <div className="skolrup-profile-tab-link">Detailed Records</div>
                                            </a>
                                        </li>
                                    </ul>

                                </div>


                                {activeTab === 0 &&
                                    <>
                                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                            <div className="">
                                                <div>
                                                    {toplist && Object.keys(toplist).length > 0 &&
                                                        <div className="oxyem-top-box-design design-only-attendence leave-top-data-main mx-0  row stats-grid">

                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("leavesOnToday")}>
                                                                    <img src='/assets/img/leave.png' />

                                                                    <div className='ox-colored-box-1'><h4 className='all_attendence'>{toplist.leavesOnToday}</h4></div>


                                                                    <div className='ox-box-text'><h6>On Leave Today                                                        </h6></div>




                                                                </div>
                                                            </div>


                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("submitted")}>
                                                                    <img src='/assets/img/date-of-birth.png' />
                                                                    <div className='ox-colored-box-2'><h4 className='month_attendence'>{toplist.approvalPending}</h4></div>

                                                                    <div className='ox-box-text'><h6>Pending Approvals</h6></div>
                                                                </div>
                                                            </div>


                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("LossOfPay")}>
                                                                    <img src='/assets/img/money.png' />
                                                                    <div className='ox-colored-box-3'><h4 className='notsubmit_attendence'>{toplist.lopApplied}</h4></div>

                                                                    <div className='ox-box-text'><h6>LOP</h6></div>
                                                                </div>
                                                            </div>


                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus">
                                                                    <img src='/assets/img/remain-leave.png' />
                                                                    <div className='ox-colored-box-4'><h4 className='week_attendence'>{toplist.currentMonthEmpLeaveCount}</h4></div>

                                                                    <div className='ox-box-text'><h6>Employees On Leave</h6></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                                            <div className="tab-content">
                                                {isannualOpen ? (
                                                    <div className="oxyem-top-box-design design-only-attendence leave-top-data-main mx-0 d-block">

                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <SelectComponent label={"Filter Data by Year"} placeholder={"Select Year..."} options={optionsyear} onChange={onChangeYear} value={setYear} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <SelectComponent label={"Filter Data by Month"} placeholder={"Select Month..."} options={optionsmonth} onChange={onChangeMonth} value={setMouth} />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Monthly Total</h3>

                                                                    </div>
                                                                    <Chart options={mounthChartData.options} series={mounthChartData.series} type="pie" width={300} height={250} />
                                                                </div>
                                                            </div>
                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Annual Leave Trend</h3>
                                                                    </div>
                                                                    <Chart options={annualTrendData.options} series={annualTrendData.series} type="line" height={250} />
                                                                </div>
                                                            </div>
                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Monthly Leave Trend</h3>
                                                                    </div>
                                                                    <Chart options={monthlyTrendData.options} series={monthlyTrendData.series} type="line" height={250} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (<></>)}


                                            </div>

                                        </div>
                                    </>


                                }
                                {activeTab === 1 &&
                                    <div className="row">
                                        <div className="col-12 col-lg-12 col-xl-12 d-flex">

                                            <div className="card flex-fill comman-shadow oxyem-index">
                                                <div className="center-part">

                                                    <div className="card-body oxyem-mobile-card-body">

                                                        <div className="row"><div className="col-md-6">{activeStatus !== null && (
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
                                                                    data={updleavelist}
                                                                    columnsdata={formcolumn}
                                                                    ismodule={'leave'}
                                                                    dashboradApi={'/leave'}
                                                                    onEditClick={handleEditClick}
                                                                    onSubmitClick={handleSubmitData}
                                                                    responseData={responseData}
                                                                    handleApprrovereq={handleApprrovereq}
                                                                    onHistoryClick={handleHistoryClick}
                                                                    handlerecallvalueClick={handlerecallvalueClick}
                                                                    searchfilter={searchfilter}

                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
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
