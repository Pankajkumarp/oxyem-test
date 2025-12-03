import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { FaTimes } from "react-icons/fa";
import axios from 'axios';
import View from '../../Components/Popup/AttendenceHistroy';
import dynamic from 'next/dynamic';
import SelectComponent from '../../Components/common/SelectOption/SelectComponent.jsx';
import { Toaster, toast } from 'react-hot-toast';
import Head from 'next/head';
import pageTitles from '../../../common/pageTitles.js';
import SearchFilter from '../../Components/SearchFilter/SearchFilter.jsx';
import Loader from '../../Components/loader/loader.jsx';


const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Leaveview({ }) {

    const router = useRouter();
    const [toplist, setToplist] = useState({});
    const [Isaddress, setAddress] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get('https://ipinfo.io/json');
                const city = response.data.city;
                const region = response.data.region;
                const country = response.data.country;
                setAddress(`${city}, ${region}, ${country}`);
            } catch (error) {
                console.error("Error fetching location", error);
            }
        };

        fetchLocation();
    }, []);

    const handleEditClick = (id) => {
        router.push(`/attendance/${id}`);
    };

    const fetchData = async () => {
        try {
            // const response = await axiosJWT.get(`${apiUrl}/attendance`, { params: {isFor: 'stats' } });
            const response = await axiosJWT.get(`${apiUrl}/attendance`, { params: {statsFor: 'admin' ,isFor:'stats'} });
            setToplist(response.data.data.attendancesummary || {});

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
        setIsHistroyId(id)
        openDetailpopup()
    }
    const openDetailpopup = async () => {
        setIsModalOpen(true)
    }
    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }



    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };

    const [activeTableTab, setActiveTableTab] = useState(0); // State to manage active tab index
    const handleTableTabClick = (index) => {
        setActiveTableTab(index); // Update active tab index when a tab is clicked
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

    const currentYear = new Date().getFullYear().toString();
    const optionsyear = [];
    for (let year = 2021; year <= currentYear; year++) {
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
		const [isLoadingGraph, setIsLoadingGraph] = useState(false);
    useEffect(() => {
		setIsLoadingGraph(true);
        // if (setMouth && setYear) {
            if (setMouth && setYear && activeTab === 0) {
            const getgraphData = async () => {
                try {
                    const response = await axiosJWT.get(`${apiUrl}/graphstats`, 
                        { params: { "month": setMouth, "year": setYear, "isFor":"admin"} 
                    });
                    // Handle the response if needed
                    if (response) {
                        const yearchart = response.data.data.annual
                        const monthchart = response.data.data.month
                        const monthlytrendchart = response.data.data.monthlyTrend

                        setMonthlyData(
                            {
                                series: monthchart.data,
                                options: {
                                    chart: {
                                        width: 450,
                                        type: 'pie',
                                    },
                                    labels: monthchart.label,
                                    colors: ['#26AF48', '#2196F3', '#FA7E12'],
                                    title: {
                                        text: '',
                                        align: 'center'
                                    },
                                    legend: {
                                        position: 'bottom', // This line positions the legend at the bottom
                                    },
                                    responsive: [{
                                        breakpoint: 480,
                                        options: {
                                            chart: {
                                                width: 200,
                                            },
                                            legend: {
                                                position: 'bottom', // Ensure it's also set for smaller screens
                                            },
                                        },
                                    }],
                                },
                            }
                        )
                        setMonthlyTrend(
                            {
                                series: [{
                                    name: "Total Attendance",
                                    data: monthlytrendchart.data
                                }],
                                options: {
                                    chart: {
                                        height: 350,
                                        type: 'line',
                                        zoom: {
                                            enabled: false
                                        }
                                    },
                                    dataLabels: {
                                        enabled: false
                                    },
                                    stroke: {
										width: 1,
                                        curve: 'straight',
                                        colors: ['#156082']  // Specify the line color you want here
                                    },
                                    markers: {
                                        colors: '#156082'  // Specify the hover pointer color here
                                    },
                                    title: {
                                        text: '',
                                        align: 'left'
                                    },
                                    grid: {
                                        row: {
                                            colors: ['#f3f3f3', 'transparent'],
                                            opacity: 0.5
                                        },
                                    },
                                    xaxis: {
                                        categories: monthlytrendchart.days
                                    }
                                },
                            }
                        )
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
                        setIsChartOpen(true)
						setIsLoadingGraph(false);
                    }

                } catch (error) {
                    // Handle the error if any
                    console.error("Error occurred:", error);
                }

            };
			setTimeout(function() {
				getgraphData();
			}, 0);
        }
    }, [setMouth, setYear ,activeTab]);

    const handleUpadateClick = async (id) => {
        router.push(`/attendance/${id}`);
    }
    const handleApprrovereq = async (id, type, data, onSuccess) => {
        const apipayload ={
            "action": type,
            "idAttendance": id,
            "rejectReason":data
        }
        const message = type === 'approved' 
        ? 'You have successfully <strong>Approved</strong> attendance!'
        : 'You have successfully <strong>Rejected</strong> attendance!';
        const errormessage = 'Error connecting to the backend. Please try after Sometime.';
        try {
            const response = await axiosJWT.post(`${apiUrl}/attendance/updateStatus`, apipayload);
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
            // console.error("Error occurred:", error);
        }
    }

    
const [searchfilter, setSearchfilter] = useState({});
    const searchFilterData = async (value) => {
        setSearchfilter(value);
    }
	  useEffect(() => {
    const mainElement = document.querySelector('body');
    if (mainElement) {
      mainElement.setAttribute('id', 'attendance-module');
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute('id');
      }
    };
  }, []);


      const [activeStatus, setActiveStatus] = useState(null);
      const [activeTableTabStatus, setActiveTableTabStatus] = useState(null);
  
      const handleShowDataForStatus = (filterKey) => {
          setActiveTab(1); // switch to table tab
          setActiveTableTabStatus(filterKey);
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
                  case "submit":
                      setSearchfilter({ status:  "submit" });
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
        <Head><title>{pageTitles.AttendanceTeamDashboard}</title></Head>
            <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} handleUpadateClick={handleUpadateClick} />
            
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Dashboard (Attendance)"} addlink={"/addattendance"} tooltipcontent={"Add Attendance"} />
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
                                                <div className="skolrup-profile-tab-link">Attendance</div>
                                            </a>
                                        </li>
                                    </ul>

                                     </div>
                                   

                                        {activeTab === 0 && (
                                        
                                            <><div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                        <div className="">
                                            <div>
                                                {toplist && Object.keys(toplist).length > 0 &&
                                                    <div className="oxyem-top-box-design design-only-attendence attendence-top-data-main leave-top-data-main mx-0 row stats-grid">

                                                        <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                            <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("submit")}>
                                                                <img src='/assets/img/proposal-icon.png' />
                                                                <div className='ox-colored-box-1'><h4 className='all_attendence'>{toplist.totalattendance}<br />
                                                                        <span className="leave-days-label">DAYS</span></h4></div>

                                                                <div className='ox-box-text'><h6>Attendance Recorded</h6></div>
                                                            </div>
                                                        </div>

                                                        <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                            <div className="stats-info stats-info-cus text-center ">
                                                                <img src='/assets/img/reservation-icon.png' />
                                                                <div className='ox-colored-box-2'><h4 className='month_attendence'>{toplist.monthlycount}<br />
                                                                        <span className="leave-days-label">DAYS</span></h4></div>

                                                                <div className='ox-box-text'><h6>Current Month Attendance</h6></div>
                                                            </div>
                                                        </div>

                                                        <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                            <div className="stats-info stats-info-cus text-center ">
                                                                <img src='/assets/img/reservation-icon.png' />
                                                                <div className='ox-colored-box-3'><h4 className='notsubmit_attendence'>{toplist.weeklycount}<br />
                                                                        <span className="leave-days-label">DAYS</span></h4></div>

                                                                <div className='ox-box-text'><h6>Current Week Attendance</h6></div>
                                                            </div>
                                                        </div>

                                                        <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                            <div className="stats-info stats-info-cus text-center ">
                                                                <img src='/assets/img/booking-cancel-icon.png' />
                                                                <div className='ox-colored-box-4'><h4 className=' week_attendence'>{toplist.notsubmitted ? toplist.notsubmitted : 0}<br />
                                                                        <span className="leave-days-label">DAYS</span></h4></div>

                                                                <div className='ox-box-text'><h6>Attendance Pending</h6></div>
                                                            </div>
                                                        </div>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div><div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                                            <div className="tab-content">
											{isLoadingGraph?(
                                                    <Loader text={"Please wait while we load the attendance graph."}/>
                                                    ):(
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

                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Monthly Status - {setMouth}</h3>

                                                                    </div>
                                                                    <Chart options={monthlyData.options} series={monthlyData.series} type="pie" width="100%" height={250} />
                                                                </div>
                                                            </div>
                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Monthly Trend - {setMouth}</h3>
                                                                    </div>
                                                                    <Chart options={monthlyTrendData.options} series={monthlyTrendData.series} type="line" height={250} />
                                                                </div>
                                                            </div>
                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Annual Chart - {setYear}</h3>
                                                                    </div>
                                                                    <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={250} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ) : (<></>)}
												</>
                                                )}
                                            </div>

                                        </div></>

                                       ) }
                                        {activeTab === 1 &&
                                            
                                            <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body oxyem-main-attendance_dashborad">
                                                    <SearchFilter searchFilterData={searchFilterData} formType={"searchFilterAttendanceForAdmin"}/>

                                                    <ul className="nav-tabs nav nav-tabs-bottom oxyem-graph-tab">
                                        <li class={`nav-item ${activeTableTab === 0 ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTableTabClick(0)}>
                                                <div className="skolrup-profile-tab-link">Pending for Approvals</div>
                                            </a>
                                        </li>
                                        <li class={`nav-item ${activeTableTab === 1 ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTableTabClick(1)}>
                                                <div className="skolrup-profile-tab-link">Historical</div>
                                            </a>
                                        </li>
                                    </ul>
                                    <div>

                                                                <div className="col-md-6 mt-2">
                                                                    {activeStatus !== null && (
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
                                                            ismodule={'leave'}
                                                            onEditClick={handleEditClick}
                                                            onHistoryClick={handleHistoryClick}
                                                            handleApprrovereq={handleApprrovereq}
                                                            dashboradApi={'/attendance'}
                                                            utctimeconditionpage={'userAttendance'}
                                                            // onSubmitClick={handleSubmitData}
                                                            searchfilter={searchfilter}
                                                            tableStatus={activeTableTab === 0 ? 'pending' : 'history'}
                                                            
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
