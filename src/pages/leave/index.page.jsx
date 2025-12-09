import React, { useState, useEffect } from 'react';
import LeaveList from '../Components/Leave/LeaveListings';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import Recall from '../Components/Popup/Recallmodal';
import { reorderColumns, reorderEntries, sortData } from '../../common/commonFunctions';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SelectComponent from '../Components/common/SelectOption/SelectComponent.jsx';
import View from '../Components/Popup/Leaveview';
import { FaTimes } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';

export default function Leaveview({ showOnlylist, empId }) {
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

    const desiredOrder = ["srno", "id", "leaveType", "fromDate", "toDate", "numberofDays", "leaveReason", "status", "action"];

    const sortColumns = (columns) => {
        return columns.sort((a, b) => {
            return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
        });
    };
    async function fetchLeaveData() {

        let responsedata = ""
        try {
            const response = await axiosJWT.get(`${apiUrl}/leave/getStats`, { params: { "isFor": "self", 'idEmployee': empId } })
            if (response) {
                setToplist(response.data.data || {});
            }
        } catch (error) {


        }
    }
    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };
    useEffect(() => {
        if (activeTab === 0) {
            // setSearchfilter({});
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
    const [refreshtable, setRefreshtable] = useState("");
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

            const response = await axiosJWT.post(`${apiUrl}/leave/recall`, recallPostdata)
            const apiresponse = response.data != "" ? response.data : "";

            if (response) {
                setIsModalOpenRe(false)
                setRefreshtable("refresh");

                // Clear the refresh action after 2 seconds
                setTimeout(() => {
                    setRefreshtable("");
                }, 2000);
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
            const errormessagel = 'Error connecting to the backend. Please try after Sometime.';
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessagel }}></span>
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
    const optionsyear = [];
    for (let year = 2000; year <= currentYear; year++) {
        optionsyear.push({ value: year.toString(), label: year.toString() });
    }

    const [setMouth, setMonthValue] = useState(currentMonth); // State to manage active tab index
    const [setYear, setYearValue] = useState(currentYear); // State to manage active tab index
    const onChangeMonth = (value) => {
        if (value !== null) {
            setMonthValue(value.value); // Update active tab index when a tab is clicked
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
    const [anualChartData, setAnualChartData] = useState();
    const [annualTrendData, setAnnualTrendData] = useState();
    const [monthlyTrendData, setMonthlyTrendData] = useState();
useEffect(() => {
  if (setMouth && setYear) {
    const getgraphData = async () => {
      const apipayload = {
        month: setMouth,
        year: setYear,
        isFor: "self",
        idEmployee: empId,
      };

      try {
        const response = await axiosJWT.post(`${apiUrl}/leave/getLeaveChart`, apipayload);
        if (response) {
          const yearchart = response.data.data.anual;
          const yeartrendchart = response.data.data.anualTrend;
          const monthlytrendchart = response.data.data.monthlyTrend;

          // --- ANNUAL CHART ---
          setAnualChartData({
            series: yearchart.data,
            options: {
              chart: {
                type: "bar",
                height: 350,
                events: {
                  dataPointSelection: (event, chartContext, config) => {
                    const category = config.w.config.xaxis.categories[config.dataPointIndex];
                    if (!category) return;

                    const filter = getFilterFromChartCategory(category);
                    requestAnimationFrame(() => {
                      setSearchfilter(filter);
                      setActiveTab(1);
                      setActiveTableTab(category);
                      setActiveStatus(category);
                    });
                  },
                },
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "55%",
                  endingShape: "rounded",
                  dataLabels: { position: "top" },
                },
              },
              colors: ["#156082", "#e97132", "#196b24"],
              dataLabels: { enabled: true },
              stroke: { show: true, width: 1, colors: ["transparent"] },
              xaxis: { categories: yearchart.categories },
              yaxis: { title: { text: "" } },
              fill: { opacity: 1 },
              tooltip: { y: { formatter: (val) => `${val} Days` } },
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

    const handleShowDataForStatus = (leaveTypeId) => {
        setActiveTab(1);
        setActiveTableTab(leaveTypeId);
        setActiveStatus(leaveTypeId);

        if (leaveTypeId === "clr") {
            setSearchfilter({});
            setActiveStatus(null);
        } else {
            // Here "leaveTypeId" comes from API like "Birthday", "EarnedLeave", etc.
            setSearchfilter({ leaveType: leaveTypeId });
            // console.log("this is ", searchfilter)
        }
    };



    const handleApplyClick = () => {
        router.push("/addleave");
    };

    return (
        <>
            <Head><title>{pageTitles.Leaves}</title></Head>
            <Recall isOpen={isModalOpenRe} closeModal={closeDetailpopupRe} onSubmit={handleSubmitData} />
            <View isOpen={isModalOpen} closeModal={closeDetailpopup} isviewId={isviewId} section={"employeeLeave"} />

            {showOnlylist !== 'showOnlylist' ? (
                <div className="main-wrapper leave_dashborad_page">
                    <div className="page-wrapper">
                        <div className="content container-fluid">
                            <Breadcrumbs maintext={"Dashboard (Leaves)"} addlink={"/leave/addleave"} />


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

                                                    <div className="row">
                                                        {toplist && Object.keys(toplist).length > 0 &&
                                                            <div className="oxyem-top-box-design design-only-attendence leave-top-data-main mx-0  row stats-grid">
                                                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                    <div className={`stats-info stats-info-cus text-center ${activeStatus === 'EarnedLeave' ? 'active' : ''}`}
                                                                        onClick={() => handleShowDataForStatus('EarnedLeave')}>
                                                                        <img src='/assets/img/leave.png' />
                                                                        <div className='ox-colored-box-1'><h4 className='all_attendence'>{toplist.TotalRemainingLeave}<br />
                                                                            <span className="leave-days-label">DAYS</span></h4></div>
                                                                        <div className='ox-box-text'><h6>Available Leaves</h6></div>

                                                                        <div className='stats-box-btn'><button type="submit" className="btn btn-oxyem box-btn" onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleApplyClick();
                                                                        }} >Apply</button></div>

                                                                    </div>

                                                                </div>
                                                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                    <div className={`stats-info stats-info-cus text-center ${activeStatus === 'Birthday' ? 'active' : ''}`}
                                                                        onClick={() => handleShowDataForStatus('Birthday')}>
                                                                        <img src='/assets/img/date-of-birth.png' />
                                                                        <div className='ox-colored-box-2'><h4 className='month_attendence'>{toplist.BirthDayLeaves}<br />
                                                                            <span className="leave-days-label">DAYS</span></h4></div>
                                                                        <div className='ox-box-text'><h6>Available Birthday Leave</h6></div>

                                                                        <div className='stats-box-btn'><button type="submit" className="btn btn-oxyem box-btn" onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleApplyClick();
                                                                        }} >Apply</button></div>

                                                                    </div>

                                                                </div>
                                                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                    <div className={`stats-info stats-info-cus text-center ${activeStatus === 'LossOfPay' ? 'active' : ''}`}
                                                                        onClick={() => handleShowDataForStatus('LossOfPay')} >
                                                                        <img src='/assets/img/money.png' />
                                                                        <div className='ox-colored-box-3'><h4 className='notsubmit_attendence'>{toplist.LossOfPayLeaves}<br />
                                                                            <span className="leave-days-label">DAYS</span></h4></div>
                                                                        <div className='ox-box-text'><h6>LOP</h6></div>
                                                                    </div>
                                                                </div>
                                                                {toplist.TotalMaternityLeaves !== undefined && (
                                                                    <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                        <div className={`stats-info stats-info-cus text-center ${activeStatus === 'Maternity' ? 'active' : ''}`}
                                                                            onClick={() => handleShowDataForStatus('Maternity')}>
                                                                            <img src='/assets/img/maternity.png' />
                                                                            <div className='ox-colored-box-4'><h4 className='week_attendence'>{toplist.TotalMaternityLeaves}<br />
                                                                                <span className="leave-days-label">DAYS</span></h4></div>
                                                                            <div className='ox-box-text'><h6>Maternity Leave Taken</h6></div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {toplist.TotalPaternityLeaves !== undefined && (
                                                                    <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                        <div className={`stats-info stats-info-cus text-center ${activeStatus === 'Paternity' ? 'active' : ''}`}
                                                                            onClick={() => handleShowDataForStatus('Paternity')}>
                                                                            <img src='/assets/img/maternity.png' />
                                                                            <div className='ox-colored-box-4'><h4 className='week_attendence'>{toplist.TotalPaternityLeaves}<br />
                                                                                <span className="leave-days-label">DAYS</span></h4></div>
                                                                            <div className='ox-box-text'><h6>Paternity Leave Taken</h6></div>
                                                                        </div>
                                                                    </div>
                                                                )}


                                                            </div>
                                                        }
                                                    </div >
                                                </div>
                                            </div>
                                            <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                                                <div className="tab-content">

                                                    {isannualOpen ? (
                                                        <div className="oxyem-top-box-design design-only-attendence leave-top-data-main mx-0 d-block" >

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
                                                                            <h3>Annual Leave Chart</h3>
                                                                        </div>
                                                                        <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={330} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className='oxy_chat_box'>
                                                                        <div className='graph-top-head'>
                                                                            <h3>Annual Leave Trend</h3>
                                                                        </div>
                                                                        <Chart options={annualTrendData.options} series={annualTrendData.series} type="line" height={330} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className='oxy_chat_box'>
                                                                        <div className='graph-top-head'>
                                                                            <h3>Monthly Leave Trend</h3>
                                                                        </div>
                                                                        <Chart options={monthlyTrendData.options} series={monthlyTrendData.series} type="line" height={330} />
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

                                                            <div className="row">
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
                                                                        data={updleavelist}
                                                                        columnsdata={formcolumn}
                                                                        ismodule={'leave'}
                                                                        refreshtable={refreshtable}
                                                                        dashboradApi={'/leave/getMyLeaves'}
                                                                        onEditClick={handleEditClick}
                                                                        onSubmitClick={handleSubmitData}
                                                                        responseData={responseData}
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

            ) : (
                <div className="row">
                    <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                            <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                <li class={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                                    <a class={`nav-link`} onClick={() => handleTabClick(0)}>
                                        <div className="skolrup-profile-tab-link">Dashboard</div>
                                    </a>
                                </li>
                                <li class={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                                    <a class={`nav-link`} onClick={() => handleTabClick(1)}>
                                        <div className="skolrup-profile-tab-link">Leave</div>
                                    </a>
                                </li>
                            </ul>
                            <div className="">

                                {activeTab === 0 &&
                                    <>
                                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                            <div className="">

                                                <div className="row">
                                                    {toplist && Object.keys(toplist).length > 0 &&
                                                        <div className="oxyem-top-box-design design-only-attendence leave-top-data-main mx-0  row stats-grid">
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                <div className={`stats-info stats-info-cus text-center ${activeStatus === 'EarnedLeave' ? 'active' : ''}`}
                                                                    onClick={() => handleShowDataForStatus('EarnedLeave')}>
                                                                    <img src='/assets/img/leave.png' />
                                                                    <div className='ox-colored-box-1'><h4 className='all_attendence'>{toplist.TotalRemainingLeave}<br />
                                                                        <span className="leave-days-label">DAYS</span></h4></div>
                                                                    <div className='ox-box-text'><h6>Available Leaves</h6></div>

                                                                    <div className='stats-box-btn'><button type="submit" className="btn btn-oxyem box-btn" onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleApplyClick();
                                                                    }} >Apply</button></div>

                                                                </div>

                                                            </div>
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                <div className={`stats-info stats-info-cus text-center ${activeStatus === 'Birthday' ? 'active' : ''}`}
                                                                    onClick={() => handleShowDataForStatus('Birthday')}>
                                                                    <img src='/assets/img/date-of-birth.png' />
                                                                    <div className='ox-colored-box-2'><h4 className='month_attendence'>{toplist.BirthDayLeaves}<br />
                                                                        <span className="leave-days-label">DAYS</span></h4></div>
                                                                    <div className='ox-box-text'><h6>Available Birthday Leave</h6></div>

                                                                    <div className='stats-box-btn'><button type="submit" className="btn btn-oxyem box-btn" onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleApplyClick();
                                                                    }} >Apply</button></div>

                                                                </div>

                                                            </div>
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                <div className={`stats-info stats-info-cus text-center ${activeStatus === 'LossOfPay' ? 'active' : ''}`}
                                                                    onClick={() => handleShowDataForStatus('LossOfPay')} >
                                                                    <img src='/assets/img/money.png' />
                                                                    <div className='ox-colored-box-3'><h4 className='notsubmit_attendence'>{toplist.LossOfPayLeaves}<br />
                                                                        <span className="leave-days-label">DAYS</span></h4></div>
                                                                    <div className='ox-box-text'><h6>LOP</h6></div>
                                                                </div>
                                                            </div>
                                                            {toplist.TotalMaternityLeaves !== undefined && (
                                                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                    <div className={`stats-info stats-info-cus text-center ${activeStatus === 'Maternity' ? 'active' : ''}`}
                                                                        onClick={() => handleShowDataForStatus('Maternity')}>
                                                                        <img src='/assets/img/maternity.png' />
                                                                        <div className='ox-colored-box-4'><h4 className='week_attendence'>{toplist.TotalMaternityLeaves}<br />
                                                                            <span className="leave-days-label">DAYS</span></h4></div>
                                                                        <div className='ox-box-text'><h6>Maternity Leave Taken</h6></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {toplist.TotalPaternityLeaves !== undefined && (
                                                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>

                                                                    <div className={`stats-info stats-info-cus text-center ${activeStatus === 'Paternity' ? 'active' : ''}`}
                                                                        onClick={() => handleShowDataForStatus('Paternity')}>
                                                                        <img src='/assets/img/maternity.png' />
                                                                        <div className='ox-colored-box-4'><h4 className='week_attendence'>{toplist.TotalPaternityLeaves}<br />
                                                                            <span className="leave-days-label">DAYS</span></h4></div>
                                                                        <div className='ox-box-text'><h6>Paternity Leave Taken</h6></div>
                                                                    </div>
                                                                </div>
                                                            )}


                                                        </div>
                                                    }
                                                </div >
                                            </div>
                                        </div>
                                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                                            <div className="tab-content">

                                                {isannualOpen ? (
                                                    <div className="oxyem-top-box-design design-only-attendence leave-top-data-main mx-0 d-block" >

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
                                                                        <h3>Annual Leave Chart</h3>
                                                                    </div>
                                                                    <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={330} />
                                                                </div>
                                                            </div>
                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Annual Leave Trend</h3>
                                                                    </div>
                                                                    <Chart options={annualTrendData.options} series={annualTrendData.series} type="line" height={330} />
                                                                </div>
                                                            </div>
                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Monthly Leave Trend</h3>
                                                                    </div>
                                                                    <Chart options={monthlyTrendData.options} series={monthlyTrendData.series} type="line" height={330} />
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
                                                                data={updleavelist}
                                                                columnsdata={formcolumn}
                                                                dashboradApi={'/leave/getMyLeaves'}
                                                                ismodule={'leave'}
                                                                refreshtable={refreshtable}
                                                                onEditClick={handleEditClick}
                                                                onSubmitClick={handleSubmitData}
                                                                responseData={responseData}
                                                                onHistoryClick={handleHistoryClick}
                                                                handlerecallvalueClick={handlerecallvalueClick}
                                                                searchfilter={searchfilter}
                                                                empId={empId}
                                                            />

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

            )}
            <Toaster
                position="top-right"
                reverseOrder={false}

            />

        </>

    );
}
