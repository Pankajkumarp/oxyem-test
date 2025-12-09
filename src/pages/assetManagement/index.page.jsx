import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import View from './history';
import Info from './assetInfo';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { axiosJWT } from '../Auth/AddAuthorization';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import pageTitles from '../../common/pageTitles.js';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function assetManagement() {
    const router = useRouter();
    const [isHistroyId, setIsHistroyId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenInfo, setIsModalInfoOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };

    const onViewClick = (id) => {
        setIsHistroyId(id);
        setIsModalInfoOpen(true)
    };

    const openDetailpopup = async () => { setIsModalOpen(true); };

    const closeDetailpopup = async () => { setIsModalOpen(false) }

    const closeInfopopup = async () => { setIsModalInfoOpen(false) }

    const onHistoryClick = async (id) => {
        setIsHistroyId(id);
        openDetailpopup();
    };

    const onEditClick = (id) => {
        {
            router.push(`assetManagement/${id}`);

        }
    };
    const handleApprrovereq = (id) => { };

    const handleDecommissionreq = async (data) => {
        const formattedData = {
            idAsset: [data.idEmployee] // Set idEmployee in idAsset array
        };

        data.section.forEach(section => {
            section.fields.forEach(field => {
                // Skip radio objects
                if (field.type === 'Radiot&c' || field.type === 'ClaimDoc') { return; }

                if (typeof field.attributeValue === 'object' && 'value' in field.attributeValue) {
                    formattedData[field.name] = field.attributeValue.value;
                } else {
                    formattedData[field.name] = field.attributeValue;
                }
            });
        });

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/decommissionAsset';
            const response = await axiosJWT.post(apiUrl, formattedData);

            if (response.status === 200) {
                ToastNotification({ message: response.data.message });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
                ToastNotification({ message: errorMessage });
            } else {
                ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            }
        }
    };

    const [assetStats, setAssetStats] = useState({});

    const fetchAssetStats = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            // 🔹 Later replace dummy with real API call
            const response = await axiosJWT.get(`${apiUrl}/asset/getstats`);
            const responsedata = response.data.data || {};

            // ✅ Dummy stats data (based on your provided table)
            // const responsedata = {
            //     totalHardware: 3,
            //     totalSoftware: 2,
            //     totalAvailable: 5,
            //     totalAmount: 5054,
            // };

            setAssetStats(responsedata);
        } catch (error) {
            console.error("Error fetching asset stats:", error);
        }
    };

    useEffect(() => {
        fetchAssetStats();
    }, []);

    // 📊 Chart States
    const [isAssetChartOpen, setIsAssetChartOpen] = useState(false);

    const [assetCategoryPieChartData, setAssetCategoryPieChartData] = useState();
    const [assetTypeBarChartData, setAssetTypeBarChartData] = useState();
    const [assetStatusBarChartData, setAssetStatusBarChartData] = useState();
    const [assetWarrantyPieChartData, setAssetWarrantyPieChartData] = useState();
useEffect(() => {
  const getAssetCharts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/asset/getcharts`);
      const assetChartResponse = response.data.data || {};
      console.log(assetChartResponse,"this is responce")

      // 🚀 Dummy API Response (for now)
      // const assetChartResponse = {
      //   assetCategory: {
      //     categories: ["Hardware", "Software"],
      //     data: [3, 2],
      //   },
      //   assetType: {
      //     categories: ["Hardware", "Software"],
      //     active: [1, 2],
      //     expired: [2, 0],
      //   },
      //   assetStatus: {
      //     categories: ["Available", "Allocated"],
      //     data: [5, 0],
      //   },
      //   assetWarranty: {
      //     categories: ["Under Warranty", "Expired"],
      //     data: [3, 2],
      //   },
      // };

      // 📊 Chart 1 - Pie (Hardware vs Software)
      setAssetCategoryPieChartData({
        series: assetChartResponse.assetCategory.data,
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
                  setSearchfilter({ assetsCategories: category });
                  setActiveTab(1);
                  setActiveStatus(category);
                });
              },
            },
          },
          labels: assetChartResponse.assetCategory.categories,
          colors: ["#1e88e5", "#43a047"],
          legend: { position: "bottom" },
          dataLabels: { enabled: true },
        },
      });

      // 📊 Chart 2 - Bar (Asset Type → Active/Expired)
      setAssetTypeBarChartData({
        series: [
          { name: "Active", data: assetChartResponse.assetType.active },
          { name: "Expired", data: assetChartResponse.assetType.expired },
        ],
        options: {
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            events: {
              dataPointSelection: (event, chartContext, config) => {
                const category =
                  chartContext.w.config.labels?.[config.dataPointIndex] ||
                  chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
                if (!category) return;
                requestAnimationFrame(() => {
                  setSearchfilter({ assetsCategories: category });
                  setActiveTab(1);
                  setActiveStatus(category);
                });
              },
            },
          },
          xaxis: { categories: assetChartResponse.assetType.categories },
          colors: ["#43a047", "#1e88e5"],
          legend: { position: "bottom" },
        },
      });

      // 📊 Chart 3 - Bar (Status Available/Allocated)
      setAssetStatusBarChartData({
        series: [{ name: "Assets", data: assetChartResponse.assetStatus.data }],
        options: {
          chart: {
            type: "bar",
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
          xaxis: { categories: assetChartResponse.assetStatus.categories },
          colors: ["#1e88e5"],
          legend: { position: "bottom" },
          dataLabels: { enabled: true },
        },
      });

      // 📊 Chart 4 - Pie (Warranty Yes vs Expired)
      setAssetWarrantyPieChartData({
        series: assetChartResponse.assetWarranty.data,
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
                  setSearchfilter({ assetWarranty: category });
                  setActiveTab(1);
                  setActiveStatus(category);
                });
              },
            },
          },
          labels: assetChartResponse.assetWarranty.categories,
          colors: ["#43a047", "#1e88e5"],
          legend: { position: "bottom" },
          dataLabels: { enabled: true },
        },
      });

      setIsAssetChartOpen(true);
    } catch (error) {
      console.error("Error fetching asset chart data:", error);
    }
  };

  getAssetCharts();
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
              setSearchfilter({});
              break;
            case "Hardware":
              setSearchfilter({ assetsCategories:  "Hardware" });
              break;
            case "Software":
              setSearchfilter({ assetsCategories:  "Software" });
              break;
            case "Available":
              setSearchfilter({ status:  "Available" });
              break;
          }
        }
      };
    


    return (
        <>
            <Head><title>{pageTitles.AssetDashboard}</title></Head>
            <Info isOpen={isModalOpenInfo} closeModal={closeInfopopup} isHistroyId={isHistroyId} />
            <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} datafor={'groups'} />
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Dashborad (Assets Management)"} addlink={"/addAssets"} />
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
                                            <div className="">
                                                <div>
                                                    {assetStats && Object.keys(assetStats)?.length > 0 &&
                                                        <div className="oxyem-top-box-design design-only-attendence leave-top-data-main mx-0 row stats-grid">

                                                            {/* 🔹 Total Hardware */}
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus text-center"  onClick={() => handleShowDataForStatus("Hardware")}>
                                                                    <img src='/assets/img/hardware.png' alt="hardware" />
                                                                    <div className='ox-colored-box-1'>
                                                                        <h4 className='all_attendence'>
                                                                            {assetStats.totalHardware}<br />
                                                                            {/* <span className="leave-days-label">Assets</span> */}
                                                                        </h4>
                                                                    </div>
                                                                    <div className='ox-box-text'><h6>Hardware</h6></div>
                                                                </div>
                                                            </div>

                                                            {/* 🔹 Total Software */}
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus text-center"  onClick={() => handleShowDataForStatus("Software")}>
                                                                    <img src='/assets/img/software.png' alt="software" />
                                                                    <div className='ox-colored-box-2'>
                                                                        <h4 className='month_attendence'>
                                                                            {assetStats.totalSoftware}<br />
                                                                            {/* <span className="leave-days-label">Assets</span> */}
                                                                        </h4>
                                                                    </div>
                                                                    <div className='ox-box-text'><h6>Software</h6></div>
                                                                </div>
                                                            </div>

                                                            {/* 🔹 Total Available */}
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus text-center"  onClick={() => handleShowDataForStatus("Available")}>
                                                                    <img src='/assets/img/available.png' alt="available" />
                                                                    <div className='ox-colored-box-3'>
                                                                        <h4 className='notsubmit_attendence'>
                                                                            {assetStats.totalAvailable}<br />
                                                                            {/* <span className="leave-days-label">Assets</span> */}
                                                                        </h4>
                                                                    </div>
                                                                    <div className='ox-box-text'><h6>Available</h6></div>
                                                                </div>
                                                            </div>

                                                            {/* 🔹 Total Assets Amount */}
                                                            <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                                <div className="stats-info stats-info-cus text-center"  onClick={() => handleShowDataForStatus("All")}>
                                                                    <img src='/assets/img/money.png' alt="amount" />
                                                                    <div className='ox-colored-box-4 amountText'>
                                                                        <h4 className='week_attendence'>
                                                                            {assetStats?.totalAmount}k
                                                                        </h4>
                                                                    </div>
                                                                    <div className='ox-box-text'><h6>Total Amount</h6></div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                            <div className="tab-content">
                                                {isAssetChartOpen && (
                                                    <div>
                                                        <div className="row">
                                                            {/* 📊 Chart 1: Asset Category (Pie) */}
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Asset Category</h3>
                                                                    </div>
                                                                    {assetCategoryPieChartData && (
                                                                        <Chart
                                                                            options={assetCategoryPieChartData.options}
                                                                            series={assetCategoryPieChartData.series}
                                                                            type="pie"
                                                                            height={330}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* 📊 Chart 2: Asset Type (Bar) */}
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Asset Type (Active vs Expired)</h3>
                                                                    </div>
                                                                    {assetTypeBarChartData && (
                                                                        <Chart
                                                                            options={assetTypeBarChartData.options}
                                                                            series={assetTypeBarChartData.series}
                                                                            type="bar"
                                                                            height={330}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row mt-4">
                                                            {/* 📊 Chart 3: Asset Status (Bar) */}
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Asset Status</h3>
                                                                    </div>
                                                                    {assetStatusBarChartData && (
                                                                        <Chart
                                                                            options={assetStatusBarChartData.options}
                                                                            series={assetStatusBarChartData.series}
                                                                            type="bar"
                                                                            height={330}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* 📊 Chart 4: Asset Warranty (Pie) */}
                                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                <div className='oxy_chat_box'>
                                                                    <div className='graph-top-head'>
                                                                        <h3>Asset Warranty</h3>
                                                                    </div>
                                                                    {assetWarrantyPieChartData && (
                                                                        <Chart
                                                                            options={assetWarrantyPieChartData.options}
                                                                            series={assetWarrantyPieChartData.series}
                                                                            type="pie"
                                                                            height={330}
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
                                                                title={""}
                                                                onViewClick={onViewClick}
                                                                onHistoryClick={onHistoryClick}
                                                                onEditClick={onEditClick}
                                                                handleApprrovereq={handleApprrovereq}
                                                                handleDecommissionreq={handleDecommissionreq}
                                                                pagename={"addpayroll"}
                                                                dashboradApi={'/asset/viewAssetList'}
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
            <ToastContainer />

        </>

    );
}
