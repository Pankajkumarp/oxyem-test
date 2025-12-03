import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegClock, FaTimes } from "react-icons/fa";
import View from '../../Components/Popup/ClaimHistory.jsx';
import dynamic from 'next/dynamic';



import Head from 'next/head';
import pageTitles from '../../../common/pageTitles.js';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import SelectComponent from '../../Components/common/SelectOption/SelectComponent.jsx';
import SearchFilter from '../../Components/SearchFilter/SearchFilter.jsx';
import { MdDeleteForever } from "react-icons/md";
import Loader from '../../Components/loader/loader.jsx';
export default function index() {

    const router = useRouter();
    const [updleavelist, setUpdUserList] = useState([]);
    const [formcolumn, setFormColumn] = useState([]);
    const [listheader, setListHeaders] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");
    const [ischartopen, setIsChartOpen] = useState(false);
    const [monthlyData, setMonthlyData] = useState();
    const [monthlyDatadonut, setMonthlyDatadonut] = useState();

    const [anualChartData, setAnualChartData] = useState({
        series: [],
        options: {}
    });

    const [anualChartDataClaim, setAnualChartDataClaim] = useState({
        series: [],
        options: {}
    });

    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };

    const openDetailpopup = async () => {
        setIsModalOpen(true)
    }
    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }

    const handleHistoryClick = async (id) => {
        setIsHistroyId(id)
        openDetailpopup()
        return
    }

    const fetchData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/claims/claimStats`, { params: { "isFor": "admin" } });
            const responsedata = response.data.data || {};
            console.log("this is responce")
            const listheader = responsedata.listheader || {};
            setListHeaders(listheader);
        } catch (error) {

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
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    const currentYear = new Date().getFullYear().toString();
    const optionsyear = [];
    for (let year = 2021; year <= currentYear; year++) {
        optionsyear.push({ value: year.toString(), label: year.toString() });
    }

    const [setMouth, setMonthValue] = useState(null);
    const [setYear, setYearValue] = useState(currentYear);

const onChangeMonth = (value) => {
  if (value) {
    setMonthValue(value.value);
  } else {
    setMonthValue(null); // cleared
  }
};

const onChangeYear = (value) => {
  if (value) {
    setYearValue(value.value);
  } else {
    setYearValue(null);
  }
};


    const [isLoadingGraph, setIsLoadingGraph] = useState(false);
    useEffect(() => {
        setIsLoadingGraph(true);
        // if (setMouth && setYear && activeTab === 0) {
            const chartData = async () => {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                    const params = {
  isFor: 'admin',
  currency: selectedCurrency,
  ...(setMouth ? { month: setMouth } : {}),
  ...(setYear ? { year: setYear } : {})
};
                    const response = await axiosJWT.get(`${apiUrl}/claims/graphStats`, {
                        params
                    });

                    // Extract pie chart data for overall claims
                    const overallClaimData = response.data.data.overallClaimData.overAll;
                    const ClaimData = response.data.data.allClaims;
                    const annualData = response.data.data.annualData;
                    const lastChar = response.data.data.currentAndLastFinancialGraph;
                    console.log(lastChar)
                    // Set up pie chart data for overall claims
                    setMonthlyData({
                        series: overallClaimData.data,
                        options: {
                            chart: { width: 450, type: 'pie' },
                            labels: overallClaimData.label,
                            colors: ['#26AF48', '#2196F3', '#FA7E12', '#cf59f1'],
                            title: { text: '', align: 'center' },
                            legend: { position: 'bottom' },
                            responsive: [{
                                breakpoint: 480,
                                options: {
                                    chart: { width: 300 },
                                    legend: { position: 'bottom' },
                                },
                            }],
                        },
                    });

                    setMonthlyDatadonut({
                        series: ClaimData.data,
                        options: {
                            chart: {
                                type: 'donut',
                                width: 450
                            },
                            labels: ClaimData.label,
                            colors: ['#2196F3', '#FF4560', '#26AF48', '#775DD0'], // Adjust these colors as necessary
                            title: {
                                text: '', // Update the title as needed
                                align: 'center'
                            },
                            legend: {
                                position: 'bottom'
                            },
                            responsive: [{
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 300
                                    },
                                    legend: {
                                        position: 'bottom'
                                    },
                                },
                            }],
                        },
                    });


                    // Set bar chart for annual data
                    setAnualChartData({
                        series: [{
                            name: 'Claims',
                            data: annualData.data
                        }],
                        options: {
                            chart: { type: 'bar', height: 350 },
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: '55%',
                                    endingShape: 'rounded',
                                },
                            },
                            colors: ['#26AF48', '#2196F3', '#FA7E12', '#FF4560', '#775DD0'],
                            dataLabels: { enabled: false },
                            xaxis: { categories: annualData.label },
                            yaxis: { title: { text: 'Count' } },
                            fill: { opacity: 1 },
                            tooltip: { y: { formatter: (val) => `${val} claims` } },
                        },
                    });

                    setAnualChartDataClaim({
                        series: lastChar.data.map((yearItem) => ({
                            name: yearItem.name,
                            data: yearItem.data
                        })),
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
                                        position: 'top',
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
                                categories: lastChar.categories,
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
                                        return `${val} Days`;
                                    },
                                },
                            },
                        },
                    });


                    setIsChartOpen(true);
                    setIsLoadingGraph(false);
                } catch (error) {
                    // Handle error

                }
            };

            setTimeout(function () {
                chartData();
            }, 0);
        // }
    }, [selectedCurrency, setMouth, setYear, activeTab]);


    useEffect(() => {
        fetchData();

    }, []);

    useEffect(() => {
        const fetchCurrencyList = async () => {
            try {

                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { params: { "isFor": "currencylist" } });

                const formattedOptions = response.data.data.map(item => ({
                    label: item.currencyName,
                    value: item.id,
                }));
                setCurrencyOptions(formattedOptions);
                // Set default currency to INR
                const inrOption = formattedOptions.find(option =>
                    option.label === "Indian Rupees - INR"
                );

                if (inrOption) {
                    setSelectedCurrency(inrOption.value);
                }
            } catch (error) {
                console.error('Failed to fetch currency list', error);
            }
        };

        fetchCurrencyList();
    }, []);
    const handleCurrencyChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : '';
        setSelectedCurrency(value);

    };
    const onViewClick = (id) => {
        router.push(`/claim/admin/${id}`);
    };

    const onDeleteClick = (id) => {

    };

    const handleApprrovereq = async (id, type, data, onSuccess) => {
        const apipayload = {
            "action": type,
            "idClaim": id,
            "comment": data
        }

        const message = type === 'approved'
            ? 'You have successfully <strong>Approved</strong>!'
            : 'You have successfully <strong>Rejected</strong>!';
        const errormessage = 'Error connecting to the backend. Please try after Sometime.';
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/claims/updateStatus`, apipayload);
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

        }
    }

    const handleUpadateClick = async (id) => {
        router.push(`/attendance/${id}`);
    }

    const [activeTableTab, setActiveTableTab] = useState(0); // State to manage active tab index
    const handleTableTabClick = (index) => {
        setActiveTableTab(index); // Update active tab index when a tab is clicked
    };
    const [activeStatus, setActiveStatus] = useState(null);
    const [searchfilter, setSearchfilter] = useState({});
    const searchFilterData = async (value) => {
        console.log("value", value)
        setSearchfilter(value);
    }

    const handleShowDataForStatus = (value) => {
        setActiveTableTab(value);
        setActiveStatus(value);
        setActiveTab(1);
        if (value === "clr") {
            setSearchfilter({});
            setActiveStatus(null);
        }
        //    else if (value === "pending") {

        //         setSearchfilter({ showOnly: value, status: "submitted" && "info req"});
        //     } 
        else {
            setSearchfilter({ status: value });
        }
    }

    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'claim-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);

    return (
        <>
            <Head>
                <title>{pageTitles.ClaimAdminDashboard}</title>
                <meta name="description" content={pageTitles.ClaimAdminDashboard} />
            </Head>

            <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} handleUpadateClick={handleUpadateClick} datafor={'shift'} />

            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">

                        <Breadcrumbs maintext={"Dashboard (Claim)"} addlink={"/claim/admin/add"} />

                        <div className="row">

                            <div className="col-12 col-lg-12 col-xl-12">

                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                    <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                        <li className={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                                            <a className={`nav-link`} onClick={() => handleTabClick(0)}>
                                                <div className="skolrup-profile-tab-link">Summary Overview</div>
                                            </a>
                                        </li>
                                        <li className={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                                            <a className={`nav-link`} onClick={() => handleTabClick(1)}>
                                                <div className="skolrup-profile-tab-link">Detailed Records</div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                {/* {activeStatus !== null && <span className='clr-filter-stats' ><MdDeleteForever size={25} onClick={() => handleShowDataForStatus('clr')}/></span>} */}
                                {activeTab === 0 &&
                                    <div>
                                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                                            <div className="">
                                                {listheader && Object.keys(listheader).length > 0 &&
                                                    <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">
                                                        {/* <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid" style={{marginBottom:'30px'}}>   */}

                                                        <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                            <div
                                                                className={`stats-info stats-info-cus ${activeStatus === 'pending' ? 'active' : ''}`}
                                                                onClick={() => handleShowDataForStatus('pending')}
                                                            >

                                                                <div className='ox-colored-box-1'><h4 className='all_attendence'>{listheader.pendingclaim}</h4></div>
                                                                <div className='ox-box-text'><h6>Pending</h6></div>
                                                            </div>
                                                        </div>


                                                        <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                            <div
                                                                className={`stats-info stats-info-cus ${activeStatus === 'approved' ? 'active' : ''}`}
                                                                onClick={() => handleShowDataForStatus('approved')}
                                                            >

                                                                <div className='ox-colored-box-2'><h4 className='month_attendence'>{listheader.approvedclaim}</h4></div>
                                                                <div className='ox-box-text'><h6>Approved</h6></div>
                                                            </div>
                                                        </div>


                                                        <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                            <div
                                                                className={`stats-info stats-info-cus ${activeStatus === 'rejected' ? 'active' : ''}`}
                                                                onClick={() => handleShowDataForStatus('rejected')}
                                                            >

                                                                <div className='ox-colored-box-3'><h4 className='notsubmit_attendence'>{listheader.rejectedclaim}</h4></div>
                                                                <div className='ox-box-text'><h6>Rejected</h6></div>
                                                            </div>
                                                        </div>


                                                        <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                            <div
                                                                className={`stats-info stats-info-cus ${activeStatus === 'totalClaimAmount' ? 'active' : ''}`}
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => {
                                                                    setActiveTab(1);
                                                                    setActiveTableTab(1);
                                                                }}>

                                                                <div className='ox-colored-box-4 amountText'><h4 className='week_attendence'>{listheader.symbol}{listheader.totalClaimAmount}k</h4></div>
                                                                <div className='ox-box-text'><h6>Total Claim Amount</h6></div>
                                                            </div>
                                                        </div>



                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        {isLoadingGraph?(
                                                                                            <Loader text={"Please wait while we load the claim graph."}/>
                                                                                            ):(
                                                                                            
                                        <>
                                            {ischartopen ? (
                                                <div>
                                                    <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                                                        <div className="tab-content">
                                                           
                                                                <>
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <SelectComponent label={"Filter Data by Year"} placeholder={"Select Year..."} options={optionsyear} onChange={onChangeYear} value={setYear} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <SelectComponent label={"Filter Data by Month"} placeholder={"Select Month..."} options={optionsmonth} onChange={onChangeMonth} value={setMouth} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <SelectComponent label={"Filter Data by Currency"} placeholder={""} options={currencyOptions} onChange={handleCurrencyChange} value={selectedCurrency} />
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="row">
                                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className='oxy_chat_box'>
                                                                        <div className='graph-top-head'>
                                                                            <h3>Claim Type {setMouth || `Until ${currentMonth}`}</h3>
                                                                        </div>
                                                                        <Chart options={monthlyDatadonut.options} series={monthlyDatadonut.series} type="donut" width='100%' height={320} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className='oxy_chat_box'>
                                                                        <div className='graph-top-head'>
                                                                            <h3>Overall Claim Status {setMouth || `Until ${currentMonth}`}</h3>
                                                                        </div>
                                                                        <Chart options={monthlyData.options} series={monthlyData.series} type="pie" width='100%' height={320} />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className='oxy_chat_box'>
                                                                        <div className='graph-top-head'>
                                                                            <h3>Monthly Claim Amount {setMouth || `Until ${currentMonth}`}</h3>
                                                                        </div>
                                                                        {anualChartData.series.length > 0 && (
                                                                            <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={250} width="100%" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                    <div className='oxy_chat_box'>
                                                                        <div className='graph-top-head'>
                                                                            <h3>Total Claim Amount {setYear}</h3>
                                                                        </div>
                                                                        <Chart options={anualChartDataClaim.options} series={anualChartDataClaim.series} type="bar" height={250} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            </>
                                                                
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (<></>)}
                                        </>
                                                )}

                                    </div>

                                }

                            </div>




                            {activeTab === 1 &&

                                <>

                                    {/* <div className="row"> */}
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body oxyem-main-attendance_dashborad">
                                                    {activeStatus !== null && (
                                                        <div className="active-filter-tag">
                                                            <span>
                                                                {String(activeStatus).charAt(0).toUpperCase() + String(activeStatus).slice(1)}</span>
                                                            <button onClick={() => handleShowDataForStatus('clr')} className="remove-filter-btn">×</button>
                                                        </div>
                                                    )}
                                                    <SearchFilter searchFilterData={searchFilterData} formType={"searchFilterClaimAdmin"} />

                                                    <ul className="nav-tabs nav nav-tabs-bottom oxyem-graph-tab">
                                                        <li class={`nav-item ${activeTableTab === 0 ? 'active' : ''}`}>
                                                            <a class={`nav-link`} onClick={() => handleTableTabClick(0)}>
                                                                <div className="skolrup-profile-tab-link">Pending</div>
                                                            </a>
                                                        </li>
                                                        <li class={`nav-item ${activeTableTab === 1 ? 'active' : ''}`}>
                                                            <a class={`nav-link`} onClick={() => handleTableTabClick(1)}>
                                                                <div className="skolrup-profile-tab-link">Paid</div>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title={""}
                                                            data={updleavelist}
                                                            columnsdata={formcolumn}
                                                            onViewClick={onViewClick}
                                                            onDeleteClick={onDeleteClick}
                                                            handleApprrovereq={handleApprrovereq}
                                                            onHistoryClick={handleHistoryClick}
                                                            dashboradApi={'/claims/manageClaims'}
                                                            ifForvalue={`admin`}
                                                            tabParamsInObj={activeTableTab === 1 ? { status: 'paid' } : { status: 'pending' }}
                                                            searchfilter={searchfilter}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* </div> */}
                                </>
                            }

                        </div>
                    </div>
                </div>
            </div>
            {/* </div>
            </div> */}
        </>
    )
}