import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import View from '../Components/Popup/BasketofAllowance';
import { FaTimes } from "react-icons/fa";
import Head from 'next/head';
import dynamic from 'next/dynamic';

import pageTitles from '../../common/pageTitles.js';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function basketAllowance({ showOnlylist }) {
  const router = useRouter();
  const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
  const handleTabClick = (index) => {
    setActiveTab(index); // Update active tab index when a tab is clicked
  };

  const handleEditClick = (id) => {
    router.push(`/attendance/${id}`);
  };

  const onViewClick = (id) => {
    router.push(`/employeeAllowance/${id}`);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isviewId, setIsViewId] = useState("");
  const onHistoryClick = async (id) => {
    setIsViewId(id)
    openDetailpopup()
  }
  const openDetailpopup = async () => {
    setIsModalOpen(true)
  }
  const closeDetailpopup = async () => {
    setIsModalOpen(false)
  }
  const handleApprrovereq = async (id, type, data, onSuccess) => {
    const apipayload = {
      "status": type,
      "idBoa": id,
      "rejectReason": data
    }
    const message = type === 'approved'
      ? 'You have successfully <strong>Approved</strong> allowance!'
      : 'You have successfully <strong>Rejected</strong> allowance!';
    const errormessage = 'Error connecting to the backend. Please try after Sometime.';
    try {
      const response = await axiosJWT.post(`${apiUrl}/payroll/approvalBoa`, apipayload);
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

  useEffect(() => {
    const mainElement = document.querySelector('body');
    if (mainElement) {
      mainElement.setAttribute('id', 'basketOfAll-module');
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute('id');
      }
    };
  }, []);

  const [allowanceStats, setAllowanceStats] = useState({});

  const fetchAllowanceStats = async () => {
    try {
      // const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      // 🔹 For now using dummy data, later replace axios call with API
      const response = await axiosJWT.get(`${apiUrl}/payroll/boaStats` );     //, { params: { isFor: "self" }}
      const responsedata = response.data.data || {};

     
      setAllowanceStats(responsedata);
    } catch (error) {
      console.error("Error fetching allowance stats:", error);
    }
  };


  useEffect(() => {
    fetchAllowanceStats();
  }, []);

  // States for charts
  const [isChartOpen, setIsChartOpen] = useState(false);

  const [activeInactiveChartData, setActiveInactiveChartData] = useState();
  const [employeeTypeChartData, setEmployeeTypeChartData] = useState();
  const [pfChartData, setPfChartData] = useState();

useEffect(() => {
  const getAllowanceCharts = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/payroll/boaCharts`);
      const allowanceChartResponse = response.data.data || {};

      // 🥧 Chart 1: Active vs Inactive
      setActiveInactiveChartData({
        series: allowanceChartResponse.statusdata.data,
        options: {
          chart: {
            type: "pie",
            height: 350,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                const category =
                  chartContext.w.config.labels?.[config.dataPointIndex] ||
                  chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                if (!category) return;
                requestAnimationFrame(() => {
                  setSearchfilter({ status: category });
                  setActiveTab(1);
                  setActiveStatus(category);
                });
              },
            },
          },
          labels: allowanceChartResponse.statusdata.categories,
          colors: ["#156082", "#e97132"],
          legend: { position: "bottom" },
          dataLabels: { enabled: true },
        },
      });

      // // 📊 Chart 2: Employee Types (Active BOA per employee)
      // setEmployeeTypeChartData({
      //   series: [
      //     {
      //       name: "Active BOA (Current Month)",
      //       data: allowanceChartResponse.employeeWiseActiveData.data,
      //     },
      //   ],
      //   options: {
      //     chart: {
      //       type: "bar",
      //       height: 350,
      //       events: {
      //         dataPointSelection: (event, chartContext, config) => {
      //           const category =
      //             chartContext.w.config.labels?.[config.dataPointIndex] ||
      //             chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
      //           if (!category) return;
      //           requestAnimationFrame(() => {
      //             setSearchfilter({ employeeName: encodeURIComponent(category) });
      //             setActiveTab(1);
      //             setActiveStatus(category);
      //           });
      //         },
      //       },
      //     },
      //     plotOptions: {
      //       bar: {
      //         horizontal: false,
      //         columnWidth: "55%",
      //         endingShape: "rounded",
      //       },
      //     },
      //     dataLabels: { enabled: true },
      //     colors: ["#156082"],
      //     grid: {
      //       row: {
      //         colors: ["#f3f3f3", "transparent"],
      //         opacity: 0.5,
      //       },
      //     },
      //     xaxis: {
      //       categories: allowanceChartResponse.employeeWiseActiveData.categories,
      //       title: { text: "Employees" },
      //     },
      //     yaxis: {
      //       title: { text: "Active BOA Count" },
      //     },
      //   },
      // });

      // 🥧 Chart 3: PF Enabled vs Not Enabled
      setPfChartData({
        series: allowanceChartResponse.pfData.data,
        options: {
          chart: {
            type: "pie",
            height: 350,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                const category =
                  chartContext.w.config.labels?.[config.dataPointIndex] ||
                  chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                if (!category) return;
                requestAnimationFrame(() => {
                  setSearchfilter({ pfStatus: category });
                  setActiveTab(1);
                  setActiveStatus(category);
                });
              },
            },
          },
          labels: allowanceChartResponse.pfData.categories,
          colors: ["#156082", "#26af48"],
          legend: { position: "bottom" },
          dataLabels: { enabled: true },
        },
      });

      setIsChartOpen(true);
    } catch (error) {
      console.error("Error fetching allowance chart data:", error);
    }
  };

  getAllowanceCharts();
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
        case "All":
          setSearchfilter(null);
          break;
        case "totalamount":
          setSearchfilter(null);
          break;
        case "BOAwithPF":
          setSearchfilter(null);
          break;
        case "BOAwithoutPF":
          setSearchfilter(null);
          break;
      }
    }
  };


  return (
    <>
      <Head>
        <title>{pageTitles.BasketOfAllowanceAdmin}</title>
        <meta name="description" content={pageTitles.BasketOfAllowanceAdmin} />
      </Head>
      <View isOpen={isModalOpen} closeModal={closeDetailpopup} isviewId={isviewId} section={"employeeLeave"} />
      <div className="main-wrapper leave_dashborad_page">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Basket of Allowance (Admin)"} addlink={"/basket-of-allowance/create"} />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div>
                  <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                    <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                      <li className={`nav-item ${activeTab === 0 ? 'active' : ''}`}>   {/* ✅ className */}
                        <a className="nav-link" onClick={() => handleTabClick(0)}>   {/* ✅ className */}
                          <div className="skolrup-profile-tab-link">Summary Overview</div>
                        </a>
                      </li>
                      <li className={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                        <a className="nav-link" onClick={() => handleTabClick(1)}>
                          <div className="skolrup-profile-tab-link">Detailed Records</div>
                        </a>
                      </li>
                    </ul>


                  </div>

                  {activeTab === 0 && (

                    <>
                      <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                        <div className="">
                          <div>
                            {allowanceStats && Object.keys(allowanceStats)?.length > 0 && (
                              <div className="oxyem-top-box-design design-only-attendence attendence-top-data-main leave-top-data-main mx-0 row stats-grid">

                                {/* Total No. of Allowances */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                  <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("All")}>
                                    <img src='/assets/img/proposal-icon.png' />
                                    <div className='ox-colored-box-1'>
                                      <h4 className='all_attendence'>
                                        {allowanceStats.totalAllowances}
                                      </h4>
                                    </div>
                                    <div className='ox-box-text'><h6>Total No. of Allowances</h6></div>
                                  </div>
                                </div>

                                {/* Active Allowances */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                  <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("BOAwithPF")}>
                                    <img src='/assets/img/reservation-icon.png' />
                                    <div className='ox-colored-box-2'>
                                      <h4 className='month_attendence'>
                                        {allowanceStats.countBOAPF}
                                      </h4>
                                    </div>
                                    <div className='ox-box-text'><h6>BOA with PF</h6></div>
                                  </div>
                                </div>

                                {/* Inactive Allowances */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                  <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("BOAwithoutPF")}>
                                    <img src='/assets/img/booking-cancel-icon.png' />
                                    <div className='ox-colored-box-3'>
                                      <h4 className=' notsubmit_attendence'>
                                        {allowanceStats.countBOANoPF}
                                      </h4>
                                    </div>
                                    <div className='ox-box-text'><h6>BOA without PF</h6></div>
                                  </div>
                                </div>

                                {/* Total Amount */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                  <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("All")}>
                                    <img src='/assets/img/money-icon.png' />
                                    <div className='ox-colored-box-4 amountText'>
                                      <h4 className='week_attendence'>
                                        {allowanceStats.totalAmount.toLocaleString()}
                                        k
                                      </h4>
                                    </div>
                                    <div className='ox-box-text'><h6>Total Amount</h6></div>
                                  </div>
                                </div>

                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                      <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                        <div className="tab-content">

                          {isChartOpen && (
                            <div>
                              <div className="row">
                                {/* Pie Chart: Active vs Inactive */}
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                  <div className='oxy_chat_box'>
                                    <div className='graph-top-head'>
                                      <h3>Allowance Status</h3>
                                    </div>
                                    {activeInactiveChartData && (
                                      <Chart
                                        options={activeInactiveChartData.options}
                                        series={activeInactiveChartData.series}
                                        type="pie"
                                        width="100%"
                                        height={250}
                                      />
                                    )}
                                  </div>
                                </div>

                                {/* Bar Chart: Employee vs Intern/Contract */}
                                {/* <div className="col-lg-4 col-md-12 col-sm-6">
                                  <div className='oxy_chat_box'>
                                    <div className='graph-top-head'>
                                      <h3>Employee Type Distribution</h3>
                                    </div>
                                    {employeeTypeChartData && (
                                      <Chart
                                        options={employeeTypeChartData.options}
                                        series={employeeTypeChartData.series}
                                        type="bar"
                                        height={250}
                                      />
                                    )}
                                  </div>
                                </div> */}

                                {/* Pie Chart: PF Enabled vs Not Enabled */}
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                  <div className='oxy_chat_box'>
                                    <div className='graph-top-head'>
                                      <h3>PF Status</h3>
                                    </div>
                                    {pfChartData && (
                                      <Chart
                                        options={pfChartData.options}
                                        series={pfChartData.series}
                                        type="pie"
                                       width="100%"
                                        height={250}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>

                      </div></>
                  )}
                  {activeTab === 1 && (

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
                                  onViewClick={onViewClick}
                                  pagename={"basketofallow"}
                                  onHistoryClick={onHistoryClick}
                                  handleApprrovereq={handleApprrovereq}
                                  dashboradApi={'/payroll/getBoaHistory'}
                                  searchfilter={searchfilter}

                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
