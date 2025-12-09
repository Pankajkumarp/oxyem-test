import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
// import View from '../Components/Popup/TicketHistory.jsx';
import TicketHistory from '../Components/Popup/TicketHistory.jsx';
import dynamic from 'next/dynamic';
import Recall from '../Components/Popup/Recallmodal';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';

export default function index() {

    const router = useRouter();
    const [listheader, setListHeaders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");
    const [isModalOpenRe, setIsModalOpenRe] = useState(false);
    const [isrecallId, setIsRecallId] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [activeStatus, setActiveStatus] = useState(null);
    const [ischartopen, setIsChartOpen] = useState(false);
    const [pieData, setTicketPieData] = useState();
    const [moduleWiseStatus, setModuleWiseStatus] = useState();
    const [employeeWiseStatus, setEmployeeWiseStatus] = useState();
    const openDetailpopup = async () => {
        setIsModalOpen(true)
    }
    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }

    // const handleHistoryClick = async (id) => {

    //     setIsHistroyId(id)
    //     openDetailpopup()
    //     return
    // }

    const [isTicketDrawerOpen, setTicketDrawerOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // 🔹 This will be called when history button clicked in table
   const handleHistoryClick = (id) => {
    setSelectedTicketId(id);
    setTicketDrawerOpen(true);
  };

    const fetchData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            // const response = await axiosJWT.get(`${apiUrl}/ticket/ticketStats`);  //{ params: { "isFor": "admin" } }
      const response = await axiosJWT.get(`${apiUrl}/ticket/ticketStats`,  { params: { "isFor": "self" } });

            const responsedata = response.data.data || {};
            const listheader = responsedata.listheader || {};
            setListHeaders(listheader);
        } catch (error) {

        }
    };

    const onViewClick = (id) => {
        router.push(`ticket/${id}`);
    };

    const onDeleteClick = (id) => {

    };

    const handleApprrovereq = async (id, type, data, onSuccess) => {
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

    };
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };


    const handleShowDataForStatus = (value) => {
        // setActiveTableTab(value);
        setActiveStatus(value);
        if (value === "clr") {
            setSearchfilter({});
            setActiveStatus(null);
        }
        else if (value === "submitted") {
            setSearchfilter({ showOnly: value });
        }
        else {
            setSearchfilter({ status: value });
        }
    }

    useEffect(() => {
        fetchData();

    }, []);

    useEffect(() => {
        if (activeTab === 1) {
            const chartData = async () => {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                    const response = await axiosJWT.get(`${apiUrl}/ticket/graphStats`,  { params: { "isFor": "self" } });

                    const ticketStatus = response.data.data.overallTicketData.overAll;

                    const allTickets = response.data.data.allTickets;

                   
         const categories = allTickets.map(t => t.moduleName);

// Mapping data according to new statuses
const submittedData = allTickets.map(t => t.submitted || 0);
const infoReqData = allTickets.map(t => t.inforeq || 0);
const inProgressData = allTickets.map(t => t.inprogress || 0);
const onHoldData = allTickets.map(t => t.onhold || 0);
const resolvedData = allTickets.map(t => t.resolved || 0);
const closedData = allTickets.map(t => t.closed || 0);

                    const ticketSummary = response.data.data.ticketSummary;
                    console.log("yaha tk mrra", ticketStatus)
                    setTicketPieData({
                        series: ticketStatus.data,
                        options: {
                            chart: { width: 450, type: 'pie' },
                            labels: ticketStatus.label,
                            colors: [
      '#3498db', // submitted
      '#e67e22', // inforeq
      '#2ecc71', // inprogress
      '#e74c3c', // onhold
      '#f1c40f',  // resolved
      '#9b59b6'// closed 

    ],
                            title: { text: 'Ticket Status', align: 'center' },
                            legend: { position: 'bottom' },
                            responsive: [{
                                breakpoint: 480,
                                options: {
                                    chart: { width: 300 },
                                    legend: { position: 'bottom' }
                                }
                            }]
                        }
                    });

                  
         setModuleWiseStatus({
  series: [
    { name: 'Submitted', data: submittedData },
    // { name: 'Info Required', data: infoReqData },
    { name: 'In Progress', data: inProgressData },
    // { name: 'On Hold', data: onHoldData },
    { name: 'Resolved', data: resolvedData },
    { name: 'Closed', data: closedData }
  ],
  options: {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    // Colors for each status in the same order as series
      colors: [
      '#3498db', // submitted
    //   '#e67e22', // inforeq
      '#2ecc71', // inprogress
    //   '#e74c3c', // onhold
      '#f1c40f',  // resolved
      '#9b59b6'// closed 

    ],
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: categories
    },
    yaxis: {
      title: {
        text: 'Tickets'
      }
    },
    legend: {
      position: 'bottom'
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} tickets`
      }
    }
  }
});


                setEmployeeWiseStatus({
  series: ticketSummary.datasets.map(dataset => ({
    name: dataset.label,          // backend returns 'label' per dataset
    data: dataset.data            // backend returns 'data' array per dataset
  })),
  options: {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    colors: ticketSummary.datasets.map(dataset => dataset.backgroundColor), // use backend colors
    xaxis: {
      categories: ticketSummary.labels // backend returns employee names array
    },
    yaxis: {
      title: {
        text: 'Number of Tickets'
      }
    },
    legend: {
      position: 'bottom'
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} ticket${val !== 1 ? 's' : ''}` // pluralization handled
      }
    }
  }
});
                    console.log(pieData, "ye data set hona chiye ")
                    setIsChartOpen(true);

                } catch (err) {
                    console.log(err);
                }
            };

            chartData();
        }

    }, [activeTab]);

    const [activeTableTab, setActiveTableTab] = useState(0); // State to manage active tab index
    const handleTableTabClick = (index) => {
        setActiveTableTab(index); // Update active tab index when a tab is clicked
    };


    return (
        <>
            <Head>
                <title>{pageTitles.TicketDashboard}</title>
                <meta name="description" content={pageTitles.TicketDashboard} />
            </Head>
            <TicketHistory 
  isOpen={isTicketDrawerOpen} 
  closeModal={() => setTicketDrawerOpen(false)} 
  isHistroyId={selectedTicketId} 
/>

            {/* <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} handleUpadateClick={handleUpadateClick} datafor={'shift'}/> */}
            <Recall isOpen={isModalOpenRe} closeModal={closeDetailpopupRe} onSubmit={handleSubmitData} pagename={'ticketInfo'} />
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Dashboard (Ticket)"} addlink={"/ticket/add"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                    <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                        <li className={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                                            <a className={`nav-link`} onClick={() => handleTabClick(0)}>
                                                <div className="skolrup-profile-tab-link">Statistics</div>
                                            </a>
                                        </li>
                                        <li className={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                                            <a className={`nav-link`} onClick={() => handleTabClick(1)}>
                                                <div className="skolrup-profile-tab-link">Chart</div>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        {activeStatus !== null && <span className='clr-filter-stats' ><MdDeleteForever size={25} onClick={() => handleShowDataForStatus('clr')} /></span>}
                                        {activeTab === 0 &&
                                            <div>
                                                {listheader && Object.keys(listheader).length > 0 &&
                                                    <div className="oxyem-top-box-design design-only-attendence" style={{ marginBottom: '30px' }}>
                            <div
                              className={`stats-info stats-info-cus shift-heading-box `}      //${activeStatus === 'openState' ? 'active' : ''}
                            // onClick={() => handleShowDataForStatus('submitted')}
                            >
                              <h6></h6>
                              <h4 className='week_attendence'>{listheader.submitted}</h4>
                              <h6>Submitted</h6>
                            </div>
                            <div
                              className={`stats-info stats-info-cus shift-heading-box `}      //${activeStatus === 'openState' ? 'active' : ''}
                            // onClick={() => handleShowDataForStatus('submitted')}
                            >
                              <h6></h6>
                              <h4 className='week_attendence'>{listheader.inforeq}</h4>
                              <h6>Info Required</h6>
                            </div>

                            <div
                              className={`stats-info stats-info-cus shift-heading-box ${activeStatus === 'inprogress' ? 'active' : ''}`}
                            // onClick={() => handleShowDataForStatus('inProgress')}
                            >
                              <h6></h6>
                              <h4 className='week_attendence'>{listheader.inprogress}</h4>
                              <h6>In-Progress</h6>
                            </div>
                            <div
                              className={`stats-info stats-info-cus shift-heading-box ${activeStatus === 'inprogress' ? 'active' : ''}`}
                            // onClick={() => handleShowDataForStatus('inProgress')}
                            >
                              <h6></h6>
                              <h4 className='week_attendence'>{listheader.onhold}</h4>
                              <h6>On Hold</h6>
                            </div>

                            <div
                              className={`stats-info stats-info-cus shift-heading-box ${activeStatus === 'closed' ? 'active' : ''}`}
                            // onClick={() => handleShowDataForStatus('closed')}
                            >
                              <h6></h6>
                              <h4 className='week_attendence'>{listheader.resolved}</h4>
                              <h6>Resolved</h6>
                            </div>
                            <div
                              className={`stats-info stats-info-cus shift-heading-box ${activeStatus === 'closed' ? 'active' : ''}`}
                            // onClick={() => handleShowDataForStatus('closed')}
                            >
                              <h6></h6>
                              <h4 className='week_attendence'>{listheader.closed}</h4>
                              <h6>Closed</h6>
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
                                                            <div className="col-lg-4 col-md-12 col-sm-6">
                                                                <div className='graph-main-box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Overall Ticket Status</h3>
                                                                    </div>
                                                                    <Chart options={pieData.options} series={pieData.series} type="pie" height={330} />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-12 col-sm-6">
                                                                <div className='graph-main-box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Module Wise Ticket Status</h3>
                                                                    </div>
                                                                    <Chart
                                                                        options={moduleWiseStatus.options}
                                                                        series={moduleWiseStatus.series}
                                                                        type="bar"
                                                                        height={330}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-4 col-md-12 col-sm-6">
                                                                <div className='graph-main-box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Employee Ticket Status</h3>
                                                                    </div>
                                                                    <Chart
                                                                        options={employeeWiseStatus.options}
                                                                        series={employeeWiseStatus.series}
                                                                        type="bar"
                                                                        height={330}
                                                                    />
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
                                                <div className="card-body oxyem-mobile-card-body oxyem-main-attendance_dashborad">
                                                    <ul className="nav-tabs nav nav-tabs-bottom oxyem-graph-tab">
                                                        <li class={`nav-item ${activeTableTab === 0 ? 'active' : ''}`}>
                                                            <a class={`nav-link`} onClick={() => handleTableTabClick(0)}>
                                                                <div className="skolrup-profile-tab-link">Submit</div>
                                                            </a>
                                                        </li>
                                                        <li class={`nav-item ${activeTableTab === 1 ? 'active' : ''}`}>
                                                            <a class={`nav-link`} onClick={() => handleTableTabClick(1)}>
                                                                <div className="skolrup-profile-tab-link">Action</div>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title={""}

                                                            onViewClick={onViewClick}
                                                            onDeleteClick={onDeleteClick}
                                                            handleApprrovereq={handleApprrovereq}
                                                            onHistoryClick={handleHistoryClick}
                                                            handlerecallvalueClick={handlerecallvalueClick}
                                                            tabParamsInObj={{
                                                               
                                                                isFor: 'self',
                                                                ...(activeTableTab === 1 && { assignedTabType: 'assignedOnly' })  // when tab is Action
                                                            }}
                                                            dashboradApi={'/ticket/manageTickets'}
                                                            ifForvalue={`self`}
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

        </>
    )
}