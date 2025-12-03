import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import AttendanceAdminDetailsDrawer from '../Popup/AttendanceAdminDetail.jsx';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const AttendanceChart = ({ activeTab }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const [showGraph, setShowGraph] = useState(false);
    const [todayStatus, setTodayStatus] = useState("");
    const [monthlyAttend, setMonthlyAttend] = useState("");
    const [annualAttend, setAnnualAttend] = useState("");
    const [approvalPending, setApprovalPending] = useState("");
    const [searchfilter, setSearchfilter] = useState({});
    const [activeStatus, setActiveStatus] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const fetchClientData = async (value) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDashboardDetails`, {
                params: { isFor: value },
            });
            if (response) {
                const dataCome = response.data.data
                setApprovalPending(dataCome.approvalPending)
                setTodayStatus(
                    {
                        series: dataCome.todaysStatus.series,
                        chart: {
                            type: 'donut',
                            width: 600,
                            height: 400,
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const selectedCategory =
                                        chartContext.w.config.labels?.[config.dataPointIndex];
                                    if (!selectedCategory) return;

                                    requestAnimationFrame(() => {
                                        handleChartClick({ status: selectedCategory });
                                    });
                                },
                            },
                        },
                        title: {
                            text: "Today's Status",
                            align: 'center',
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        labels: dataCome.todaysStatus.labels,
                        colors: ['#156082', '#ed6a58', '#fcb040'],
                        responsive: [

                            {
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 250,
                                    },
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            },
                        ],
                        legend: {
                            position: 'bottom',
                        },
                    }
                )
                setMonthlyAttend(
                    {
                        chart: {
                            type: 'bar',
                            height: 350,
                            stacked: true,
                            toolbar: {
                                show: true,
                            },
                            zoom: {
                                enabled: true,
                            },
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const label = chartContext.w.config.xaxis.categories?.[config.dataPointIndex];
                                    if (!label) return;

                                    requestAnimationFrame(() => {
                                        handleChartClick({ month: label });
                                    });
                                },
                            },
                        },
                        title: {
                            text: `Monthly Attendance ${currentMonth} ${currentYear}`,
                            align: 'center',
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        series: dataCome.monthlyAttend.series,
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    legend: {
                                        position: 'bottom',
                                        offsetX: -10,
                                        offsetY: 0,
                                    },
                                },
                            },
                        ],
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                borderRadius: 0,
                                borderRadiusApplication: 'end',
                                borderRadiusWhenStacked: 'last',

                            },
                        },
                        xaxis: {
                            categories: dataCome.monthlyAttend.categories,
                        },
                        colors: ['#156082', '#f77837'],
                        legend: {
                            position: 'bottom',
                        },
                        fill: {
                            opacity: 1,
                        },
                    }
                )
                setAnnualAttend(
                    {
                        chart: {
                            type: 'bar',
                            height: 350,
                            stacked: true,
                            toolbar: {
                                show: true,
                            },
                            zoom: {
                                enabled: true,
                            },
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const yearCategory =
                                        chartContext.w.config.xaxis.categories?.[config.dataPointIndex];
                                    if (!yearCategory) return;

                                    requestAnimationFrame(() => {
                                        handleChartClick({ year: yearCategory });
                                    });
                                },
                            },
                        },
                        title: {
                            text: `Annual Attendance Record ${currentYear}`,
                            align: 'center',
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        series: dataCome.annualAttend.series,
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    legend: {
                                        position: 'bottom',
                                        offsetX: -10,
                                        offsetY: 0,
                                    },
                                },
                            },
                        ],
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                borderRadius: 0,
                                borderRadiusApplication: 'end',
                                borderRadiusWhenStacked: 'last',

                            },
                        },
                        xaxis: {
                            categories: dataCome.annualAttend.categories,
                        },

                        colors: ['#156082', '#f77837'],
                        legend: {
                            position: 'bottom',
                        },
                        fill: {
                            opacity: 1,
                        },
                    }
                )
                setShowGraph(true)

            }
        } catch (error) {

        }
    };
    useEffect(() => {
        if (activeTab === "All") {
            fetchClientData("attendance");
        }
    }, [activeTab]);

    const handleChartClick = (filterObject) => {
        setSearchfilter(filterObject); // set gender/role
        setActiveStatus(Object.values(filterObject)[0]); // optional
        setIsDrawerOpen(true); // open drawer
    };

    const handleClearFilter = () => {
        setActiveStatus(null);
        setSearchfilter(null);     // or {}
        setIsDrawerOpen(false);    // close drawer
    };


    return (
        <div className='row'>
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6
 custom_padding_taskbar">
                {showGraph ? (
                    <div className="oxy_chat_box"   >
                        <Chart
                            options={todayStatus}
                            series={todayStatus.series}
                            type="donut"
                            width="100%"
                            height={250}
                        />
                    </div>
                ) : null}
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6
 custom_padding_taskbar">
                {showGraph ? (
                    <div className="oxy_chat_box"  >
                        <Chart
                            options={annualAttend}
                            series={annualAttend.series}
                            type="bar"
                            width="100%"
                            height={250}
                        />
                    </div>
                ) : null}
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6
 custom_padding_taskbar">
                {showGraph ? (
                    <div className="oxy_chat_box"  >
                        <Chart
                            options={monthlyAttend}
                            series={monthlyAttend.series}
                            type="bar"
                            width="100%"
                            height={250}
                        />
                    </div>
                ) : null}
            </div>
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6
 custom_padding_taskbar">
                {showGraph ? (
                    <div className="oxy_chat_box">
                        <div className="oxy_chat_inner_text">
                            <img src='/assets/img/pending.png' alt='icon' />
                            <span>Approval Pending</span>
                            <p>{approvalPending}</p>
                        </div>
                    </div>
                ) : null}
            </div>
            <AttendanceAdminDetailsDrawer
                isOpen={isDrawerOpen}
                closeModal={() => setIsDrawerOpen(false)}
                selectedFilter={searchfilter}
                activeStatus={activeStatus}
                handleClearFilter={handleClearFilter}
            />
        </div>
    );
};

export default AttendanceChart;
