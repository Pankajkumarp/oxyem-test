import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablenew.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { FaRegClock, FaTimes } from "react-icons/fa";
import { GiCalendarHalfYear } from "react-icons/gi";
import { BsCalendarWeek } from "react-icons/bs";
import { MdCalendarMonth } from "react-icons/md";
import { FaRegCalendar } from "react-icons/fa";
import axios from 'axios';
import View from '../Components/Popup/AttendenceHistroy';
import dynamic from 'next/dynamic';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Select from 'react-select';
import SelectComponent from '../Components/common/SelectOption/SelectComponent.jsx';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import moment from 'moment-timezone';
import { Toaster, toast } from 'react-hot-toast';
import { ImUserCheck } from "react-icons/im";
import TimesheetPopup from '../Components/Popup/employeeTimesheet';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
export default function timesheetDashboard({ }) {





    const router = useRouter();
    const [datacoloum, setDatacoloum] = useState([]);
    const [rowData, setRowData] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleEditClick = (id) => {
        router.push(`/attendance/${id}`);
    };
   

    const fetchData = async () => {
        try {
            const response = await axiosJWT.get(`${apiUrl}/timesheet/myTimesheet`);
            if (response) {

               setDatacoloum(response.data.data.formcolumns);
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

    const [toplist, setToplist] = useState([]); // State to manage active tab index
    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
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
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
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
    const [ischartopen, setIsChartOpen] = useState(false);
    const [anualChartData, setAnualChartData] = useState();
    const [monthlyTrendData, setMonthlyTrend] = useState();
    const [monthlyData, setMonthlyData] = useState();
    useEffect(() => {
        if (setMouth && setYear) {
            const getgraphData = async () => {
                try {
                    const response = await axiosJWT.get(`${apiUrl}/timesheet/getChart`,
                        {
                            params: { "month": setMouth, "year": setYear, "isFor": "chats" }
                        });
                    // Handle the response if needed
                    if (response) {
                        const yearchart = response.data.data.annual
                        const monthlychart = response.data.data.monthly
                        const monthlyse = response.data.data.annualPercentage


                        setAnualChartData(
                            {
                                series: yearchart.data,
                                options: {
                                    chart: {
                                        type: 'bar',
                                        height: 350,
                                    },
                                    plotOptions: {
                                        bar: {
                                            horizontal: false,
                                            columnWidth: '55%',
                                            endingShape: 'rounded',
                                            dataLabels: {
                                                position: 'top', // Show data labels on top of each bar
                                            },
                                        },
                                    },
                                    colors: ['#26AF48', '#2196F3', '#FA7E12'],
                                    dataLabels: {
                                        enabled: false,
                                    },
                                    title: {
                                        text: '',
                                        align: 'left'
                                    },
                                    stroke: {
                                        show: true,
                                        width: 1,
                                        colors: ['transparent'],
                                    },
                                    xaxis: {
                                        categories: yearchart.months,
                                    },
                                    yaxis: {
                                        title: {
                                            text: '',
                                        },
                                    },
                                    fill: {
                                        opacity: 1,
                                    },
                                    tooltip: {
                                        y: {
                                            formatter: function (val) {
                                                return "" + val + " Days";
                                            },
                                        },
                                    },
                                },
                            }
                        )
                        setMonthlyData(
                            {
                                series: monthlychart.data,
                                options: {
                                    chart: {
                                        type: 'bar',
                                        height: 350,
                                    },
                                    plotOptions: {
                                        bar: {
                                            horizontal: false,
                                            columnWidth: '55%',
                                            endingShape: 'rounded',
                                            dataLabels: {
                                                position: 'top', // Show data labels on top of each bar
                                            },
                                        },
                                    },
                                    colors: ['#26AF48', '#2196F3', '#FA7E12'],
                                    dataLabels: {
                                        enabled: false,
                                    },
                                    title: {
                                        text: '',
                                        align: 'left'
                                    },
                                    stroke: {
                                        show: true,
                                        width: 1,
                                        colors: ['transparent'],
                                    },
                                    xaxis: {
                                        categories: monthlychart.Week,
                                    },
                                    yaxis: {
                                        title: {
                                            text: '',
                                        },
                                    },
                                    fill: {
                                        opacity: 1,
                                    },
                                    tooltip: {
                                        y: {
                                            formatter: function (val) {
                                                return "" + val + " Days";
                                            },
                                        },
                                    },
                                },
                            }
                        )
                        setMonthlyTrend(
                            {
                                series: [monthlyse.Percentage],
                                options: {
                                    chart: {
                                        height: 350,
                                        type: 'radialBar',
                                        offsetY: -10
                                    },
                                    plotOptions: {
                                        radialBar: {
                                            startAngle: -135,
                                            endAngle: 135,
                                            dataLabels: {
                                                name: {
                                                    fontSize: '16px',
                                                    color: undefined,
                                                    offsetY: 120
                                                },
                                                value: {
                                                    offsetY: 76,
                                                    fontSize: '22px',
                                                    color: undefined,
                                                    formatter: function (val) {
                                                        return val + "%";
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    fill: {
                                        type: 'gradient',
                                        gradient: {
                                            shade: 'dark',
                                            shadeIntensity: 0.15,
                                            inverseColors: false,
                                            opacityFrom: 1,
                                            opacityTo: 1,
                                            stops: [0, 50, 65, 91]
                                        },
                                    },
                                    stroke: {
                                        dashArray: 4
                                    },
                                    labels: ['Percentage'],
                                },



                            }
                        )

                        setIsChartOpen(true)
                    }

                } catch (error) {
                    // Handle the error if any
                    console.error("Error occurred:", error);
                }

            };
            const getStatsData = async () => {
                try {
                    const response = await axiosJWT.get(`${apiUrl}/timesheet/getChart`,
                        {
                            params: { "month": setMouth, "year": setYear, "isFor": "stats" }
                        });
                    // Handle the response if needed
                    if (response) {
                        setToplist(response.data.data.stats)

                    }

                } catch (error) {
                    // Handle the error if any
                    console.error("Error occurred:", error);
                }

            };
            getStatsData();
            getgraphData();

        }


    }, [setMouth, setYear]);
	
	
	
	
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
        <title>{pageTitles.TimesheetMyDashboard}</title>
        <meta name="description" content={pageTitles.TimesheetMyDashboard} />
    </Head>
            <TimesheetPopup isOpen={isTimeSheetModal} closeModal={closeTimesheetpopup} isfor={""} timesheetId={timesheetId} closeAfterAction={closeAfterAction} section={"timesubmition"} sectionName={"Timesheet Submission"}/>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">

                        <Breadcrumbs maintext={"Dashboard (Timesheet)"} />

                        <div className="row">

                            <div className="col-12 col-lg-12 col-xl-12">
								<div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                    <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                        <li class={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTabClick(0)}>
                                                <div className="skolrup-profile-tab-link">Stats</div>
                                            </a>
                                        </li>
                                        <li class={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTabClick(1)}>
                                                <div className="skolrup-profile-tab-link">Chart</div>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">

                                        {activeTab === 0 &&
                                            <div>
                                                {toplist && Object.keys(toplist).length > 0 &&
                                                    <div className="oxyem-top-box-design design-only-attendence design-only-timesheetemp">
                                                        <div className="stats-info stats-info-cus">
                                                            <img src='/assets/img/effort.png' />
                                                            <h4 className='all_attendence'>{toplist.totalEffortAllocated}</h4>

                                                            <h6>Total effort allocated</h6>
                                                        </div>
                                                        <div className="stats-info stats-info-cus">
                                                            <img src='/assets/img/challenge.png' />
                                                            <h4 className='month_attendence'>{toplist.totalEffortLogged}</h4>

                                                            <h6>Total effort Logged</h6>
                                                        </div>
                                                        <div className="stats-info stats-info-cus">
                                                            <img src='/assets/img/percentage.png' />
                                                            <h4 className='week_attendence'>{toplist.percentage}</h4>

                                                            <h6>Percentage</h6>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {activeTab === 1 &&
                                            <>
                                                {ischartopen ? (
                                                    <div>
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


                                                            <div className="col-md-4">
                                                                <div className='graph-main-box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Annual Effort Chart</h3>
                                                                    </div>
                                                                    <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={250} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className='graph-main-box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Weekly Attendance Chart</h3>
                                                                    </div>
                                                                    <Chart options={monthlyData.options} series={monthlyData.series} type="bar" height={250} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className='graph-main-box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>%age of efforts logged</h3>
                                                                    </div>
                                                                    <Chart options={monthlyTrendData.options} series={monthlyTrendData.series} type="radialBar" height={250} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ) : (<></>)}
                                            </>
                                        }
                                    </div>

                                </div>
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
