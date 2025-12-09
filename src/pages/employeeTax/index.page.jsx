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
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function employeeTax({ showOnlylist }) {
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

    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };

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
    const [isannualOpen, setIsAnnualOpen] = useState(false);
    const [anualChartData, setAnualChartData] = useState();
    const [monthlyData, setmonthlyData] = useState();

    useEffect(() => {
        if (activeTab === 1) {
            const getgraphData = async () => {
                try {
                    const response = await axiosJWT.get(`${apiUrl}/payroll/viewCharts`);
                    // Handle the response if needed
                    if (response) {
                        const yearchart = response.data.data.monthlyTax
                        const monthchart = response.data.data.totalTaxVsPaid
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
                        setmonthlyData(
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
                        setIsAnnualOpen(true)
                    }

                } catch (error) {
                    // Handle the error if any
                    // console.error("Error occurred:", error);
                }

            };
            getgraphData();
        }

    }, [activeTab]);


    const [taxTab, settaxTab] = useState(0); // State to manage active tab index
    const handleTabSecClick = (index) => {
        settaxTab(index); // Update active tab index when a tab is clicked
    };


    const [topheader, setTopHeader] = useState([]);
    
      useEffect(() => {
        const gettopheader = async () => {
            try {
              const response = await axiosJWT.get(`${apiUrl}/payroll/viewTaxDeductions`, { params: {isFor: 'selfHeader' ,year: 'currentYear'} });
              if (response && response.data && response.data.data && response.data.data) {
                setTopHeader(response.data.data.header);
              }
            } catch (error) { }
          };
        gettopheader();
      }, []);

    return (
        <>
<Head>
        <title>{pageTitles.PayrollEmployeeTaxView}</title>
        <meta name="description" content={pageTitles.PayrollEmployeeTaxView} />
    </Head>

            <div className="main-wrapper leave_dashborad_page">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Employee Tax View"} />
                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                            <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                <li class={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                                    <a class={`nav-link`} onClick={() => handleTabClick(0)}>
                                        <div className="skolrup-profile-tab-link">Data</div>
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
                            <div className="design-only-employeeTax mb-3 row">
                                {Object.entries(topheader).map(([key, value], index) => (
                                    <div key={index} className="col-md-3 header-box">
                                        <h4 className='tax_value'>{value}</h4>
                                        <h6>{key}</h6>
                                    </div>
                                ))}
                                </div>
                            }   

                                {activeTab === 0 &&
                                    <div>
                                        <ul className="nav-tabs nav nav-tabs-bottom justify-content-start oxyem-graph-tab">
                                            <li class={`nav-item ${taxTab === 0 ? 'active' : ''}`}>
                                                <a class={`nav-link`} onClick={() => handleTabSecClick(0)}>
                                                    <div className="skolrup-profile-tab-link">Current Tax</div>
                                                </a>
                                            </li>
                                            <li class={`nav-item ${taxTab === 1 ? 'active' : ''}`}>
                                                <a class={`nav-link`} onClick={() => handleTabSecClick(1)}>
                                                    <div className="skolrup-profile-tab-link">Last FY TAX</div>
                                                </a>
                                            </li>
                                        </ul>

                                        {taxTab === 0 &&
                                        <CustomDataTable
                                            title={""}
                                            data={updleavelist}
                                            columnsdata={formcolumn}
                                            ismodule={'leave'}
                                            refreshtable={refreshtable}
                                            ifForvalue={'self'}
                                            year={"currentYear"}
                                            dashboradApi={'/payroll/viewTaxDeductions'}
                                            onEditClick={handleEditClick}
                                            responseData={responseData}

                                        />
                                        }
                                        {taxTab === 1 &&
                                        <CustomDataTable
                                            title={""}
                                            data={updleavelist}
                                            columnsdata={formcolumn}
                                            ismodule={'leave'}
                                            year={"lastYear"}
                                            refreshtable={refreshtable}
                                            ifForvalue={'self'}
                                            dashboradApi={'/payroll/viewTaxDeductions'}
                                            onEditClick={handleEditClick}
                                            responseData={responseData}

                                        />
                                        }


                                    </div>
                                }
                                {activeTab === 1 &&
                                    <>
                                        {isannualOpen ? (
                                            <div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className='graph-main-box'>
                                                            <div className='graph-top-head'>
                                                                <h3>Total Tax vs Paid</h3>
                                                            </div>
                                                            <Chart options={monthlyData.options} series={monthlyData.series} type="pie" height={330} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className='graph-main-box'>
                                                            <div className='graph-top-head'>
                                                                <h3>Tax Paid - Monthly</h3>
                                                            </div>
                                                            <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={330} />
                                                        </div>
                                                    </div>



                                                </div>
                                            </div>
                                        ) : (<></>)}

                                    </>
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
