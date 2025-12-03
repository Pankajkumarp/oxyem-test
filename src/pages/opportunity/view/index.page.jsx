import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import OpportunityPop from '../../Components/Popup/opportunityPopup';
import OpportunityHistroy from '../../Components/Popup/opportunityHistroy';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';


import pageTitles from '../../../common/pageTitles';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function opportunityView() {
  const router = useRouter();
  const [isrefresh, setRefresh] = useState(true);
  const [opportunityId, setOpportunityId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalHistroyOpen, setIsModalHistroyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
  const handleTabClick = (index) => {
    setActiveTab(index); // Update active tab index when a tab is clicked
  };
  const onViewClick = (id) => {
    router.push(`/opportunity/view/${id}`);
  };
  const closeViewClick = (id) => {
    setIsModalOpen(false)
  };
  const onHistoryClick = async (id) => {
    setOpportunityId(id);
    setIsModalHistroyOpen(true)
  };
  const closeHistroyClick = (id) => {
    setIsModalHistroyOpen(false)
  };
  const onEditClick = (id) => {
    router.push(`/opportunity/${id}`);
  };
  const handleApprrovereq = (id) => { };

  const handleDecommissionreq = async (data) => {
  };

  const onDeleteClick = (id) => {

  };


  const [opportunityStats, setOpportunityStats] = useState({});

  const fetchOpportunityStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      // 🔹 Later replace dummy with real API call
      const response = await axiosJWT.get(`${apiUrl}/opportunity/stats`);
      const responsedata = response.data.data || {};

      // ✅ Dummy stats data (based on your table)
      // const responsedata = {
      //   totalOpen: 1,
      //   totalWon: 6,
      //   totalLost: 0,
      //   totalWonAmountFY: 167,
      // };

      setOpportunityStats(responsedata);
    } catch (error) {
      console.error("Error fetching opportunity stats:", error);
    }
  };

  useEffect(() => {
    fetchOpportunityStats();
  }, []);


  // States for charts
  const [isChartOpen, setIsChartOpen] = useState(false);


  const [clientStatusChartData, setClientStatusChartData] = useState();
  const [overallStatusPieData, setOverallStatusPieData] = useState();
  const [monthlyStatusChartData, setMonthlyStatusChartData] = useState();
  const [topCountryChartData, setTopCountryChartData] = useState();

useEffect(() => {
  const getOpportunityCharts = async () => {
    try {
       const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      // 🔹 Later replace dummy with real API call
      const response = await axiosJWT.get(`${apiUrl}/opportunity/charts`);
      const opportunityChartResponse = response.data.data || {};
      // 🔹 Dummy API Response (replace later with real API)
      // const opportunityChartResponse = {
      //   clientStatus: {
      //     categories: ["Shurti Industries", "test Pankaj", "Bawalia Group", "Raj Group of Industries"],
      //     open: [0, 1, 0, 0],
      //     won: [2, 2, 1, 1],
      //     lost: [0, 0, 0, 0]
      //   },
      //   overallStatus: {
      //     categories: ["Open", "Won", "Lost"],
      //     data: [1, 6, 0]
      //   },
      //   monthlyStatus: {
      //     categories: ["Apr-2024", "Sep-2025", "Oct-2025"],
      //     open: [0, 1, 0],
      //     won: [1, 4, 1],
      //     lost: [0, 0, 0]
      //   },
      //   topCountryStatus: {
      //     categories: ["India", "Canada", "USA", "Singapore", "Ireland"],
      //     open: [1, 0, 0, 0, 0],
      //     won: [1, 2, 1, 1, 0],
      //     lost: [0, 0, 0, 0, 0]
      //   }
      // };

      // 📊 Chart 1 - Client Wise
      setClientStatusChartData({
        series: [
          { name: "Open", data: opportunityChartResponse.clientStatus.open },
          { name: "Won", data: opportunityChartResponse.clientStatus.won },
          { name: "Lost", data: opportunityChartResponse.clientStatus.lost }
        ],
        options: {
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                const category = opportunityChartResponse.clientStatus.categories[config.dataPointIndex];
                if (!category) return;
                requestAnimationFrame(() => {
                  setSearchfilter({ clientName: category });
                  setActiveTab(1);
                  setActiveStatus(category);
                });
              }
            }
          },
          xaxis: { categories: opportunityChartResponse.clientStatus.categories },
          dataLabels: { enabled: true },
          colors: ["#0477BF", "#66d8f4", "#e97132"],

          legend: { position: "bottom" }
        }
      });

      // 📊 Chart 2 - Overall Status (Pie)
      setOverallStatusPieData({
        series: opportunityChartResponse.overallStatus.data,
        options: {
          chart: {
            type: "pie",
            height: 403,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                const category = opportunityChartResponse.overallStatus.categories[config.dataPointIndex];
                if (!category) return;
                requestAnimationFrame(() => {
                  setSearchfilter({ status: category });
                  setActiveTab(1);
                  setActiveStatus(category);
                });
              }
            }
          },
          labels: opportunityChartResponse.overallStatus.categories,
          colors: ["#0477BF", "#66d8f4", "#e97132"],
          legend: { position: "bottom" },
          dataLabels: { enabled: true }
        }
      });

      // 📊 Chart 3 - Monthly Status
      setMonthlyStatusChartData({
        series: [
          { name: "Open", data: opportunityChartResponse.monthlyStatus.open },
          { name: "Won", data: opportunityChartResponse.monthlyStatus.won },
          { name: "Lost", data: opportunityChartResponse.monthlyStatus.lost }
        ],
        options: {
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                const category = opportunityChartResponse.monthlyStatus.categories[config.dataPointIndex];
                if (!category) return;
                requestAnimationFrame(() => {
                  setActiveTab(1);
                  setActiveStatus(category);
                });
              }
            }
          },
          xaxis: { categories: opportunityChartResponse.monthlyStatus.categories },
          colors: ["#0477BF", "#66d8f4", "#e97132"],
          grid: {
      row: {
        colors: ["#fff", "#f2f2f2"],
      },
    },
          legend: { position: "bottom" }
        }
      });

      // 📊 Chart 4 - Top Countries
      setTopCountryChartData({
        series: [
          { name: "Open", data: opportunityChartResponse.topCountryStatus.open },
          { name: "Won", data: opportunityChartResponse.topCountryStatus.won },
          { name: "Lost", data: opportunityChartResponse.topCountryStatus.lost }
        ],
        options: {
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                const category = opportunityChartResponse.topCountryStatus.categories[config.dataPointIndex];
                if (!category) return;
                requestAnimationFrame(() => {
                  setSearchfilter({ location: category });
                  setActiveTab(1);
                  setActiveStatus(category);
                });
              }
            }
          },
          xaxis: { categories: opportunityChartResponse.topCountryStatus.categories },
          colors: ["#0477BF", "#66d8f4", "#e97132"],
          legend: { position: "bottom" }
        }
      });

      setIsChartOpen(true);
    } catch (error) {
      console.error("Error fetching opportunity chart data:", error);
    }
  };

  getOpportunityCharts();
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
        case "open":
          setSearchfilter({ status:  "open" });
          break;
        case "won":
          setSearchfilter({ status:  "won" });
          break;
        case "lost":
          setSearchfilter({ status:  "lost" });
          break;
      }
    }
  };


  return (
    <>
      <Head><title>{pageTitles.OpportunityView}</title></Head>
      <div className="main-wrapper">
        <OpportunityPop isOpen={isModalOpen} closeModal={closeViewClick} opportunityId={opportunityId} />
        <OpportunityHistroy isOpen={isModalHistroyOpen} closeModal={closeHistroyClick} opportunityId={opportunityId} />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Opportunity Dashboard"} addlink={"/opportunity"} />
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
                            {opportunityStats && Object.keys(opportunityStats).length > 0 && (
                              <div className="oxyem-top-box-design design-only-attendence attendence-top-data-main leave-top-data-main mx-0 row stats-grid">

                                {/* Total No. of Allowances */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                  <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("open")}>
                                    <img src='/assets/img/proposal-icon.png' />
                                    <div className='ox-colored-box-1'>
                                      <h4 className='all_attendence'>
                                        {opportunityStats.totalOpen}
                                      </h4>
                                    </div>
                                    <div className='ox-box-text'><h6>Open Opportunities</h6></div>
                                  </div>
                                </div>

                                {/* Active Allowances */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                  <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("won")}>
                                    <img src='/assets/img/reservation-icon.png' />
                                    <div className='ox-colored-box-2'>
                                      <h4 className='month_attendence'>
                                        {opportunityStats.totalWon}
                                      </h4>
                                    </div>
                                    <div className='ox-box-text'><h6>Won Opportunities</h6></div>
                                  </div>
                                </div>

                                {/* Inactive Allowances */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                  <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("lost")}>
                                    <img src='/assets/img/booking-cancel-icon.png' />
                                    <div className='ox-colored-box-3'>
                                      <h4 className=' notsubmit_attendence'>
                                        {opportunityStats.totalLost}
                                      </h4>
                                    </div>
                                    <div className='ox-box-text'><h6>Lost Opportunities</h6></div>
                                  </div>
                                </div>

                                {/* Total Amount */}
                                <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                  <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("All")}>
                                    <img src='/assets/img/money-icon.png' />
                                    <div className='ox-colored-box-4 amountText'>
                                      <h4 className='week_attendence'>
                                        {opportunityStats.totalWonAmountFY.toLocaleString()}
                                        k
                                      </h4>
                                    </div>
                                    <div className='ox-box-text'><h6>Total Amount (Current FY)</h6></div>
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
                                {/* 📊 Chart 1: Client Wise Status */}
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                  <div className='oxy_chat_box'>
                                    <div className='graph-top-head'>
                                      <h3>Client Wise Opportunity Status</h3>
                                    </div>
                                    {clientStatusChartData && (
                                      <Chart
                                        options={clientStatusChartData.options}
                                        series={clientStatusChartData.series}
                                        type="bar"
                                        height="90%"
                                      />
                                    )}
                                  </div>
                                </div>

                                {/* 📊 Chart 2: Overall Status (Pie) */}
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                  <div className='oxy_chat_box'>
                                    <div className='graph-top-head'>
                                      <h3>Overall Opportunity Status</h3>
                                    </div>
                                    {overallStatusPieData && (
                                      <Chart
                                        options={overallStatusPieData.options}
                                        series={overallStatusPieData.series}
                                        type="pie"
                                        width="100%"
                                        height="90%"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row mt-3">
                                {/* 📊 Chart 3: Monthly Status */}
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                  <div className='oxy_chat_box'>
                                    <div className='graph-top-head'>
                                      <h3>Monthly Opportunity Trends</h3>
                                    </div>
                                    {monthlyStatusChartData && (
                                      <Chart
                                        options={monthlyStatusChartData.options}
                                        series={monthlyStatusChartData.series}
                                        type="bar"
                                        height="90%"
                                      />
                                    )}
                                  </div>
                                </div>

                                {/* 📊 Chart 4: Top Countries */}
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                  <div className='oxy_chat_box'>
                                    <div className='graph-top-head'>
                                      <h3>Top Countries (Opportunities)</h3>
                                    </div>
                                    {topCountryChartData && (
                                      <Chart
                                        options={topCountryChartData.options}
                                        series={topCountryChartData.series}
                                        type="bar"
                                        height="90%"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}


                        </div>

                      </div>
                    </>
                  )}
                  {activeTab === 1 && (
                    <div className="row">
                      <div className="col-12 col-lg-12 col-xl-12 d-flex">
                        <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
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
                                {isrefresh && (
                                  <CustomDataTable
                                    title={""}
                                    onViewClick={onViewClick}
                                    onHistoryClick={onHistoryClick}
                                    onEditClick={onEditClick}
                                    handleApprrovereq={handleApprrovereq}
                                    handleDecommissionreq={handleDecommissionreq}
                                    pagename={"addpayroll"}
                                    dashboradApi={'/opportunity'}
                                    onDeleteClick={onDeleteClick}
                                    searchfilter={searchfilter}

                                  />
                                )}
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
        <Toaster
          position="top-right"
          reverseOrder={false}

        />
      </div>
    </>
  );
}
