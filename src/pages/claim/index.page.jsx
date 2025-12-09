import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
import View from '../Components/Popup/ClaimHistory.jsx';
import dynamic from 'next/dynamic';
import Recall from '../Components/Popup/Recallmodal';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';

import SelectComponent from '../Components/common/SelectOption/SelectComponent.jsx';
import SearchFilter from '../Components/SearchFilter/SearchFilter.jsx';
import { MdDeleteForever } from "react-icons/md";
import Loader from '../Components/loader/loader.jsx';
export default function index() {

    const router = useRouter();
    const [updleavelist, setUpdUserList] = useState([]);
    const [formcolumn, setFormColumn] = useState([]);
    const [listheader, setListHeaders] = useState([]);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");
    const [ischartopen, setIsChartOpen] = useState(false);
    const [monthlyData, setMonthlyData] = useState();
    const [monthlyDatadonut, setMonthlyDatadonut] = useState();
    const [anualChartData, setAnualChartData] = useState({
        series: [],
        options: {}
    });

    const [isModalOpenRe, setIsModalOpenRe] = useState(false);
    const [isrecallId, setIsRecallId] = useState("");
const [selectedCurrency, setSelectedCurrency] = useState(null);
 const [currencyOptions, setCurrencyOptions] = useState([]);
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
            const response = await axiosJWT.get(`${apiUrl}/claims/claimStats`, { params: { "isFor": "employee" } });
            const responsedata = response.data.data || {};
            const listheader = responsedata.listheader || {};
            console.log(listheader);
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
    for (let year = 2000; year <= currentYear; year++) {
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
  isFor: 'self',
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
                            legend: {show: false}
                        },
                    });


                    setIsChartOpen(true);
					setIsLoadingGraph(false);
                } catch (error) {
                    // Handle error

                }
            };
			setTimeout(function() {
				chartData();
			}, 0);
        // }
    }, [selectedCurrency, setMouth, setYear, activeTab]);

    useEffect(() => {
        fetchData();
        // chartData();
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
        router.push(`/claim/${id}`);
    };

    const onDeleteClick = (id) => {

    };

    const handleApprrovereq = async (id, type, data, onSuccess) => {
        const apipayload = {
            "action": type,
            "idAttendance": id,
            "rejectReason": data
        }

        const message = type === 'approved'
            ? 'You have successfully <strong>Approved</strong>!'
            : 'You have successfully <strong>Rejected</strong>!';
        const errormessage = 'Error connecting to the backend. Please try after Sometime.';
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/shiftStatus`, apipayload);
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


    const handleSubmitData = async (data) => {

        try {
            let recallPostdata = {
                "idClaim": [isrecallId],
                "action": "recalled",
                "comment": data.leavereason
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/claims/updateStatus`, recallPostdata)

            if (response) {
                setIsModalOpenRe(false)
                fetchData();
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
            // setResponseData(resparr)
        }

    };

    // handleShowDataForStatus
    const [searchfilter, setSearchfilter] = useState({});
    const [activeTableTab, setActiveTableTab] = useState(""); // State to manage active tab index

    const [activeStatus, setActiveStatus] = useState(null);

    // const handleShowDataForStatus = (status) => {
    //     setActiveStatus(status);
    //     // Your existing logic to show data...
    // };



    const handleShowDataForStatus = (value) => {
        setActiveTableTab(value);
        setActiveStatus(value);
        setActiveTab(1);
        if (value === "clr") {
            setSearchfilter({});
            setActiveStatus(null);
            
        }
        // else if (value === "pending") {
        //     setSearchfilter({ showOnly: value , status: "pending"});
        // }
        else {
            setSearchfilter({ status: value });
        }

    };


    // const [searchfilter, setSearchfilter] = useState({});
    const searchFilterData = async (value) => {
        setSearchfilter(value);
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
                <title>{pageTitles.ClaimDashboard}</title>
                <meta name="description" content={pageTitles.ClaimDashboard} />
            </Head>
            <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} handleUpadateClick={handleUpadateClick} datafor={'shift'} />
            <Recall isOpen={isModalOpenRe} closeModal={closeDetailpopupRe} onSubmit={handleSubmitData} pagename={'claimInfo'} />
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Dashboard (Claim)"} addlink={"/claim/add"} />

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
   

                                        {activeTab === 0 &&

                                            <div>
                                     <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                                        <div className="">
                                                {listheader && Object.keys(listheader).length > 0 &&
                                                    <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">
                                                        
														<div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
														<div
                                                            className={`stats-info stats-info-cus ${activeStatus === 'pending' ? 'active' : ''}`}
                                                            onClick={() => handleShowDataForStatus('pending')}
                                                        >
                                                            
                                                             <div className='ox-colored-box-1'><h4 className='all_attendence'>{listheader.pendingclaim}</h4></div>
                                                            <div className='ox-box-text'><h6>Pending Paid</h6></div>
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
                                    }}>
                                                         
                                                             <div className='ox-colored-box-4'><h4 className='week_attendence'>{listheader.symbol}{listheader.totalClaimAmount}k</h4></div>
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

                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Claim Type {setMouth || `Until ${currentMonth}`}</h3>
                                                                    </div>
                                                                    <Chart options={monthlyDatadonut.options} series={monthlyDatadonut.series} type="donut" height={330} />
                                                                </div>
                                                            </div>

                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Overall Claim Status {setMouth || `Until ${currentMonth}`}</h3>
                                                                    </div>
                                                                    <Chart options={monthlyData.options} series={monthlyData.series} type="pie" height={330} />
                                                                </div>
                                                            </div>

                                                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Annaul Claim Amount {setYear}</h3>
                                                                    </div>
                                                                    {anualChartData.series.length > 0 && (
                                                                        <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={330} width="100%" />
                                                                    )}
                                                                </div>
                                                            </div>


                                                        </div>
</div>
</div>
                                                    </div>
                                                ) : (<></>)}
                                                 </>
                                                )}
                                            </div>
                                        }
                                        {activeTab === 1 &&
                                            <>

                                                  <div className="row">
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
                                                   <SearchFilter searchFilterData={searchFilterData} formType={"searchFilterClaim"} />
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title={""}
                                                            data={updleavelist}
                                                            columnsdata={formcolumn}
                                                            onViewClick={onViewClick}
                                                            onDeleteClick={onDeleteClick}
                                                            handleApprrovereq={handleApprrovereq}
                                                            onHistoryClick={handleHistoryClick}
                                                            handlerecallvalueClick={handlerecallvalueClick}
                                                            dashboradApi={'/claims/manageClaims'}
                                                            searchfilter={searchfilter}
                                                            ifForvalue={`self`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                            </>
                                        }
                                    {/* </div>

                                </div> */}

                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}