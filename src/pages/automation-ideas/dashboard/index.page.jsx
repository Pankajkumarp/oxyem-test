import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import View from '../../Components/Popup/automationIdeasHistory';
import { useRouter } from 'next/router';

import Head from 'next/head';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import pageTitles from '../../../common/pageTitles.js';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Index() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistroyId, setIsHistroyId] = useState("");
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
  const handleTabClick = (index) => {
    setActiveTab(index); // Update active tab index when a tab is clicked
  };
  const openDetailpopup = async () => {
    setIsModalOpen(true);
  };
  const handleHistoryClick = async (id) => {
    setIsHistroyId(id);
    openDetailpopup();
  };
  const onViewClick = (id) => {
    router.push(`/automation-ideas/view/${id}`);
  };
  const onDeleteClick = (id) => {
    // Delete action implementation
  };
  const closeDetailpopup = async () => {
    setIsModalOpen(false)
  }
  const handleUpadateClick = async (id) => {
    router.push(`/attendance/${id}`);
  }
  // 📊 Chart States
  const [isIdeaChartOpen, setIsIdeaChartOpen] = useState(false);
  const [searchfilter, setSearchfilter] = useState({});
  const [activeStatus, setActiveStatus] = useState(null);
  const [ideaTypeBarChartData, setIdeaTypeBarChartData] = useState();
  const [employeeWiseBarChartData, setEmployeeWiseBarChartData] = useState();
  const [complexityWiseBarChartData, setComplexityWiseBarChartData] = useState();
  const [statusWiseBarChartData, setStatusWiseBarChartData] = useState();
  useEffect(() => {
    const getIdeaCharts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/automationIdea/getcharts`, { params: { isFor: "admin" } });
        const ideaChartResponse = response.data.data;
        // 🚀 Dummy API Response (for now)
        // const ideaChartResponse = {
        //   ideaType: {
        //     categories: [
        //       "Artificial Intelligence and Machine Learning Automation",
        //       "Business Process Automation (BPA)",
        //       "Customer Support Automation",
        //       "Data Management Automation",
        //     ],
        //     data: [4, 6, 3, 5],
        //   },
        //   employeeWise: {
        //     categories: [
        //       "Sumit Kumar",
        //       "Shruti Sohi",
        //       "Amit",
        //       "Raj",

        //     ],
        //     data: [5, 3, 2, 4],
        //   },
        //   complexityWise: {
        //     categories: ["Critical", "High", "Medium", "Low"],
        //     data: [2, 5, 4, 3],
        //   },
        //   statusWise: {
        //     categories: ["Submitted", "Inprogress", "Hold", "Approved"],
        //     data: [8, 3, 2, 1],
        //   },
        // };
        // 📊 Chart 1 - Idea Type Wise
        setIdeaTypeBarChartData({
          series: [{ name: "Ideas", data: ideaChartResponse.ideaType.data }],
          options: {
            chart: {
              type: "bar",
              height: 350,
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  const category =
                    chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                  if (!category) return;
                  requestAnimationFrame(() => {
                    setSearchfilter({ ideaType: category });
                    setActiveTab(1);
                    setActiveStatus(category);
                  });
                },
              },
            },
            xaxis: { categories: ideaChartResponse.ideaType.categories },
            colors: ["#1e88e5"],
            legend: { position: "bottom" },
            dataLabels: { enabled: true },
          },
        });
        // 📊 Chart 2 - Employee Wise
        setEmployeeWiseBarChartData({
          series: [{ name: "Ideas", data: ideaChartResponse.employeeWise.data }],
          options: {
            chart: {
              type: "bar",
              height: 350,
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  const category =
                    chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                  if (!category) return;
                  requestAnimationFrame(() => {
                    setSearchfilter({ employeeName: category });
                    setActiveTab(1);
                    setActiveStatus(category);
                  });
                },
              },
            },
            xaxis: { categories: ideaChartResponse.employeeWise.categories },
            colors: ["#43a047"],
            legend: { position: "bottom" },
            dataLabels: { enabled: true },
          },
        });
        // 📊 Chart 3 - Complexity Wise
        setComplexityWiseBarChartData({
          series: [{ name: "Ideas", data: ideaChartResponse.complexityWise.data }],
          options: {
            chart: {
              type: "bar",
              height: 350,
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  const category =
                    chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                  if (!category) return;
                  requestAnimationFrame(() => {
                    setSearchfilter({ complexity: category });
                    setActiveTab(1);
                    setActiveStatus(category);
                  });
                },
              },
            },
            xaxis: { categories: ideaChartResponse.complexityWise.categories },
            colors: ["#fb8c00"],
            legend: { position: "bottom" },
            dataLabels: { enabled: true },
          },
        });
        // 📊 Chart 4 - Status Wise
        setStatusWiseBarChartData({
          series: [{ name: "Ideas", data: ideaChartResponse.statusWise.data }],
          options: {
            chart: {
              type: "bar",
              height: 350,
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  const category =
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
            xaxis: { categories: ideaChartResponse.statusWise.categories },
            colors: ["#8e24aa"],
            legend: { position: "bottom" },
            dataLabels: { enabled: true },
          },
        });
        setIsIdeaChartOpen(true);
      } catch (error) {
        console.error("Error fetching idea chart data:", error);
      }
    };
    getIdeaCharts();
  }, []);

  const handleShowDataForStatus = (filterKey) => {
    setActiveTab(1); // switch to table tab
    setActiveStatus(filterKey);

    if (filterKey === "clr") {
      setSearchfilter({});
      setActiveStatus(null);
    } else {
      let filter = {};
      switch (filterKey) {
        case "All":
          setSearchfilter({});
          break;
        case "Hardware":
          setSearchfilter({ assetsCategories: "Hardware" });
          break;
        case "Software":
          setSearchfilter({ assetsCategories: "Software" });
          break;
        case "Available":
          setSearchfilter({ status: "Available" });
          break;
      }
    }
  };

  return (
    <>
      <Head><title>{pageTitles.AutomationIdeasAdminDashboard}</title></Head>
      <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} handleUpadateClick={handleUpadateClick} datafor={'shift'} />
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext="Admin Dashboard(Automation Ideas)" addlink="/automation-ideas/add" />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
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
                      <div className="tab-content">
                        {isIdeaChartOpen && (
                          <div>
                            <div className="row">
                              {/* 📊 Chart 1: Idea Type Wise */}
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className="oxy_chat_box">
                                  <div className="graph-top-head">
                                    <h3>Idea Type Wise</h3>
                                  </div>
                                  {ideaTypeBarChartData && (
                                    <Chart
                                      options={ideaTypeBarChartData.options}
                                      series={ideaTypeBarChartData.series}
                                      type="bar"
                                      height={330}
                                      width="100%"
                                    />
                                  )}
                                </div>
                              </div>
                              {/* 📊 Chart 2: Employee Wise */}
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className="oxy_chat_box">
                                  <div className="graph-top-head">
                                    <h3>Employee Wise</h3>
                                  </div>
                                  {employeeWiseBarChartData && (
                                    <Chart
                                      options={employeeWiseBarChartData.options}
                                      series={employeeWiseBarChartData.series}
                                      type="bar"
                                      height={330}
                                      width="100%"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="row mt-4">
                              {/* 📊 Chart 3: Complexity Wise */}
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className="oxy_chat_box">
                                  <div className="graph-top-head">
                                    <h3>Complexity Wise</h3>
                                  </div>
                                  {complexityWiseBarChartData && (
                                    <Chart
                                      options={complexityWiseBarChartData.options}
                                      series={complexityWiseBarChartData.series}
                                      type="bar"
                                      height={330}
                                      width="100%"
                                    />
                                  )}
                                </div>
                              </div>
                              {/* 📊 Chart 4: Status Wise */}
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className="oxy_chat_box">
                                  <div className="graph-top-head">
                                    <h3>Status Wise</h3>
                                  </div>
                                  {statusWiseBarChartData && (
                                    <Chart
                                      options={statusWiseBarChartData.options}
                                      series={statusWiseBarChartData.series}
                                      type="bar"
                                      height={330}
                                      width="100%"
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
                                  ? activeStatus?.charAt(0).toUpperCase() + activeStatus.slice(1)
                                  : activeStatus}</span>
                                <button onClick={() => handleShowDataForStatus('clr')} className="remove-filter-btn">×</button>
                              </div>
                            )}</div>
                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                              <CustomDataTable
                                title=""
                                onViewClick={onViewClick}
                                onDeleteClick={onDeleteClick}
                                handleApprrovereq=""
                                onHistoryClick={handleHistoryClick}
                                dashboradApi={'/automationIdea/list'}
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
    </>
  );
}