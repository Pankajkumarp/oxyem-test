import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import EmployeeDetailsDrawer from '../Popup/EmployeeAdminDetail.jsx';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const EmployeeChart = ({ activeTab }) => {

    const [genderCounts, setGenderCounts] = useState({});
    const [roleWise, setRoleWise] = useState({});
    const [departmentWise, setDepartmentWise] = useState({});
    const [employeeTypeCounts, setEmployeeTypeCounts] = useState({});
    const [showGraph, setShowGraph] = useState(false);
    const [searchfilter, setSearchfilter] = useState({});
    const [activeStatus, setActiveStatus] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState([]);
    const fetchClientData = async (value) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDashboardDetails`, {
                params: { isFor: value },
            });
            if (response) {
                const dataCome = response.data.data

                setGenderCounts(
                    {
                        series: dataCome.genderCounts.series,
                        chart: {
                            type: 'donut',
                            width: 600,
                            height: 400,
                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const category = chartContext.w.config.labels?.[config.dataPointIndex];
                                    if (!category) return;
                                    requestAnimationFrame(() => {
                                        handleChartClick({ gender: category });
                                        //   setSearchfilter({ gender: category });
                                        // //   setActiveTab(1);
                                        //   setActiveStatus(category);
                                    });
                                },
                            },
                        },
                        title: {
                            text: "Total Employees",
                            align: 'center',
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        labels: dataCome.genderCounts.labels,
                        colors: ['#156082', '#e97132'],
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
                );
                setRoleWise(
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
                                    const category =
                                        chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                                    if (!category) return;
                                    requestAnimationFrame(() => {
                                        handleChartClick({ role: category });

                                        //   setSearchfilter({ role: category });
                                        // //   setActiveTab(1);
                                        //   setActiveStatus(category);
                                    });
                                },
                            },
                        },
                        title: {
                            text: "Role Wise Employees",
                            align: 'center',
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        series: dataCome.roleWise.series,
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
                            categories: dataCome.roleWise.categories,
                        },
                        colors: ['#156082', '#e97132', '#fcb040'],
                        legend: {
                            position: 'bottom',
                        },
                        fill: {
                            opacity: 1,
                        },
                    }
                )
                setDepartmentWise(
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
                                    const category =
                                        chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                                    if (!category) return;
                                    requestAnimationFrame(() => {
                                        handleChartClick({ department: category });

                                        //   setSearchfilter({ department: category });
                                        // //   setActiveTab(1);
                                        //   setActiveStatus(category);
                                    });
                                },
                            },
                        },
                        title: {
                            text: "Department wise Employees",
                            align: 'center',
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        series: dataCome.departmentWise.series,
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
                            categories: dataCome.departmentWise.categories,
                        },
                        colors: ['#156082', '#e97132', '#fcb040'],
                        legend: {
                            position: 'bottom',
                        },
                        fill: {
                            opacity: 1,
                        },
                    }
                )
                //             setEmployeeTypeCounts(
                //                 {
                //                     series: dataCome.employeeTypeCounts.series,
                //                     options: {
                //                         chart: {
                //                             width: 380,
                //                             type: 'pie',
                //                             events: {
                //     dataPointSelection: (event, chartContext, config) => {
                //       const category = chartContext.w.config.labels?.[config.dataPointIndex];
                //       if (!category) return;
                //       requestAnimationFrame(() => {
                //         handleChartClick({ empType: category });

                //         // setSearchfilter({ empType: category });
                //         // // setActiveTab(1);
                //         // setActiveStatus(category);
                //       });
                //     },
                //   },
                //                         },
                //                         responsive: [{
                //                             breakpoint: 480,
                //                             options: {
                //                                 chart: {
                //                                     width: 200
                //                                 },
                //                                 legend: {
                //                                     position: 'bottom'
                //                                 }
                //                             }
                //                         }]
                //                     },
                //                     title: {
                //                         text: "Employees Type",
                //                         align: 'center',
                //                         margin: 20,
                //                         style: {
                //                             fontSize: '13px',
                //                             fontFamily: 'Helvetica Now MT Micro Regular',
                //                             fontWeight: '500',
                //                             color: '#263238',
                //                         },
                //                     },
                //                     colors: ['#156082', '#e97132', '#37997b'],
                //                     labels: dataCome.employeeTypeCounts.labels,
                //                     legend: {
                //                         position: 'bottom',
                //                     },
                //                     fill: {
                //                         opacity: 1,
                //                     },
                //                 }
                //             )
                setEmployeeTypeCounts({
                    series: dataCome.employeeTypeCounts.series,
                    chart: {
                        width: 380,
                        type: "pie",
                        events: {
                            dataPointSelection: (event, chartContext, config) => {
                                const category = chartContext.w.config.labels?.[config.dataPointIndex];
                                if (!category) return;
                                requestAnimationFrame(() => {
                                    handleChartClick({ empType: category });
                                });
                            },
                        },
                    },
                    title: {
                        text: "Employees Type",
                        align: "center",
                        margin: 20,
                        style: {
                            fontSize: "13px",
                            fontFamily: "Helvetica Now MT Micro Regular",
                            fontWeight: "500",
                            color: "#263238",
                        },
                    },
                    labels: dataCome.employeeTypeCounts.labels,
                    colors: ["#156082", "#e97132", "#37997b"],
                    legend: {
                        position: "bottom",
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200,
                                },
                                legend: {
                                    position: "bottom",
                                },
                            },
                        },
                    ],
                });

                setShowGraph(true)

            }
        } catch (error) {

        }
    };
    useEffect(() => {
        if (activeTab === "All") {
            fetchClientData("employees");
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
                            options={genderCounts}
                            series={genderCounts.series}
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
                            options={roleWise}
                            series={roleWise.series}
                            type="bar"
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
                            options={departmentWise}
                            series={departmentWise.series}
                            type="bar"
                            height={250}
                        />
                    </div>
                ) : null}
            </div>
            <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6
 custom_padding_taskbar">
                {showGraph ? (
                    <div className="oxy_chat_box"   >
                        <Chart
                            options={employeeTypeCounts}
                            series={employeeTypeCounts.series}
                            type="pie"
                            width="100%"
                            height={250}
                        />
                    </div>
                ) : null}
            </div>
            <EmployeeDetailsDrawer
                isOpen={isDrawerOpen}
                closeModal={() => setIsDrawerOpen(false)}
                selectedFilter={searchfilter}
                activeStatus={activeStatus}
                handleClearFilter={handleClearFilter}
            />
        </div>
    );
};

export default EmployeeChart;
