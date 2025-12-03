import React, { useEffect, useState } from "react";
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import OpportunityHistroy from '../../Components/Popup/pricingHistroy';
import Head from 'next/head';
import pageTitles from '../../../common/pageTitles.js';
import SearchFilter from '../../Components/SearchFilter/SearchFilter.jsx';
import dynamic from "next/dynamic";
import SelectComponent from '../../Components/common/SelectOption/SelectComponent.jsx';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function pricingView() {
  const router = useRouter();
  const [isrefresh, setRefresh] = useState(true);
  const [opportunityId, setOpportunityId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [listheader, setListHeaders] = useState([]);
  const [status, setStatus] = useState();
  const [ischartopen, setIsChartOpen] = useState(false);

  const [statusbar, setStatusBar] = useState();
  const [clientcountbar, setClientcountBar] = useState({
    series: [],
    options: {}
  });

  const [opptunitycountbar, setOpptunitycountBar] = useState({
    series: [],
    options: {}
  });

  const [monthlysumbar, setMonthlysumBar] = useState({
    series: [],
    options: {}
  });


  const [isModalHistroyOpen, setIsModalHistroyOpen] = useState(false);
  const onViewClick = (id) => {
    router.push(`/createPricing/view/${id}`);
  };
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
  const handleTabClick = (index) => {
    setActiveTab(index); // Update active tab index when a tab is clicked
  };
  const onHistoryClick = async (id) => {
    setOpportunityId(id);
    setIsModalHistroyOpen(true)
  };
  const closeHistroyClick = (id) => {
    setIsModalHistroyOpen(false)
  };
  const onEditClick = (id) => {
    router.push(`/createPricing/${id}`);
  };
  const handleApprrovereq = (id) => { };

  const handleDecommissionreq = async (data) => {
  };

  const onDeleteClick = (id) => {

  };
  const statusDisplayMap = {
    draft: "Pending",
    approve: "Approved",
    open: "Open",
    // Add more as needed
  };
  const [searchfilter, setSearchfilter] = useState({});
  const searchFilterData = async (value) => {
    console.log("value", value)
    setSearchfilter(value);
  }
  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/opportunity/pricestats`);
      const responsedata = response.data.data || {};
      const listheader = responsedata || {};
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

  const [setMouth, setMonthValue] = useState(currentMonth);
  const [setYear, setYearValue] = useState(currentYear);

  const onChangeYear = (value) => {
    if (value !== null) {
      setYearValue(value.value); // Update active tab index when a tab is clicked
    } else {
      setYearValue();
    }
  };

  const onChangeMonth = (value) => {
    if (value !== null) {
      setMonthValue(value.value); // Update active tab index when a tab is clicked
    } else {
      setMonthValue();
    }
  };

  //  useEffect(() => {
  //     if (activeTab === 0) {
  //       handleDecommissionreq();
  //     }
  //   }, [activeTab]);



  useEffect(() => {
    if (setMouth && setYear && activeTab === 0) {
      const chartData = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(`${apiUrl}/opportunity/pricecharts`, {
            params: { "month": setMouth, "year": setYear }
          });

          // Extract pie chart data for overall claims
          // const overallClaimData = response.data.data.overallClaimData.overAll;
          // const ClaimData = response.data.data.allClaims;
          // const annualData = response.data.data.annualData;
          // const lastChar = response.data.data.currentAndLastFinancialGraph;
          const statuschart = response.data.data.status;
          const clientcountchart = response.data.data.clientcount;
          const opptunitycountchart = response.data.data.opptunitycount;
          const monthlysumchart = response.data.data.monthlysum;
          console.log(clientcountchart)


          // Set up pie chart data for pricing
          setStatusBar({
            series: statuschart.data,
            options: {
              chart: { width: 450, type: 'pie' },
              labels: statuschart.categories,
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

          // setMonthlyDatadonut({
          //     series: ClaimData.data,
          //     options: {
          //         chart: {
          //             type: 'donut',
          //             width: 450
          //         },
          //         labels: ClaimData.label,
          //         colors: ['#2196F3', '#FF4560', '#26AF48', '#775DD0'], // Adjust these colors as necessary
          //         title: {
          //             text: '', // Update the title as needed
          //             align: 'center'
          //         },
          //         legend: {
          //             position: 'bottom'
          //         },
          //         responsive: [{
          //             breakpoint: 480,
          //             options: {
          //                 chart: {
          //                     width: 300
          //                 },
          //                 legend: {
          //                     position: 'bottom'
          //                 },
          //             },
          //         }],
          //     },
          // });


          // // Set bar chart for annual data
          if (
            clientcountchart &&
            Array.isArray(clientcountchart.data) &&
            Array.isArray(clientcountchart.categories)
          ) {
            setClientcountBar({
              series: [{
                name: 'Based on Client',
                data: clientcountchart.data
              }],
              options: {
                chart: { type: 'bar' },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                  },
                },
                colors: ['#26AF48', '#2196F3', '#FA7E12', '#FF4560', '#775DD0'],
                dataLabels: { enabled: false },
                xaxis: { categories: clientcountchart.categories },
                yaxis: { title: { text: 'Count' } },
                fill: { opacity: 1 },
                tooltip: { y: { formatter: (val) => `${val} client` } },
              },
            });
          } else {
            console.error("Invalid clientcount data: ", clientcountchart);
          }
          setOpptunitycountBar({
            series: [{
              name: '  ',
              data: opptunitycountchart.data
            }],
            options: {
              chart: { type: 'bar' },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: '55%',
                  endingShape: 'rounded',
                },
              },
              colors: ['#26AF48', '#2196F3', '#FA7E12', '#FF4560', '#775DD0'],
              dataLabels: { enabled: false },
              xaxis: { categories: opptunitycountchart.label },
              yaxis: { title: { text: 'Count' } },
              fill: { opacity: 1 },
              tooltip: { y: { formatter: (val) => `${val}` } },
            },
          });
          setMonthlysumBar({
            series: [{
              name: '',
              data: monthlysumchart.data
            }],

            options: {
              chart: {
                type: 'bar',
              
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
                categories: monthlysumchart.label,
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
                    return `${val}`;
                  },
                },
              },
            },
          });


          setIsChartOpen(true);

        } catch (error) {
          // Handle error

        }
      };

      chartData();
    }
  }, [setMouth, setYear, activeTab]);
  useEffect(() => {
    fetchData();
    // chartData();
  }, []);
  return (
    <>
      <Head><title>{pageTitles.CreatePricingView}</title></Head>
      <div className="main-wrapper">
        <OpportunityHistroy isOpen={isModalHistroyOpen} closeModal={closeHistroyClick} opportunityId={opportunityId} />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Dashboard (Create Pricing)"} addlink={"/createPricing"} />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                  <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                    <li
                      className={`nav-item ${activeTab === 0 ? "active" : ""}`}
                    >
                      <a
                        className={`nav-link`}
                        onClick={() => handleTabClick(0)}
                      >
                        <div className="skolrup-profile-tab-link">
                          Summary Overview
                        </div>
                      </a>
                    </li>
                    <li
                      className={`nav-item ${activeTab === 1 ? "active" : ""}`}
                    >
                      <a
                        className={`nav-link`}
                        onClick={() => handleTabClick(1)}
                      >
                        <div className="skolrup-profile-tab-link">Detailed Records</div>
                      </a>
                    </li>
                  </ul>
                  {/* <br></br> */}
                </div>
                {activeTab === 0 && (
                  <>
                    <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                      {/* {employeeTypeCounts && employeeTypeCounts.series && employeeTypeCounts.series.length > 0 && ( */}
                      {listheader &&
                        Object.keys(listheader).length > 0 && (

                          <div className="">
                            <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">
                              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                <div
                                  className="stats-info stats-info-cus"
                                  onClick={() => {
                                    setStatus("draft");
                                    setActiveTab(1);
                                  }}                               >
                                  <div className="ox-colored-box-1">
                                    <h4 className="all_attendence">
                                      {listheader.totalpending}
                                    </h4>
                                  </div>
                                  <div className="ox-box-text">
                                    <h6>Pending</h6>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                <div
                                  className="stats-info stats-info-cus"
                                  onClick={() => {
                                    // setEmptypefilter("Permanent");
                                    setStatus("approve");

                                    setActiveTab(1);
                                  }}
                                >
                                  <div className="ox-colored-box-2">
                                    <h4 className="month_attendence">
                                      {listheader.totalapproved}
                                    </h4>
                                  </div>
                                  <div className="ox-box-text">
                                    <h6>Approved</h6>
                                  </div>
                                </div>
                              </div>

                              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                <div
                                  className="stats-info stats-info-cus"
                                  onClick={() => {
                                    // setEmptypefilter("Contract");
                                    setStatus("open");

                                    setActiveTab(1);
                                  }}                            >
                                  <div className="ox-colored-box-3">
                                    <h4 className="notsubmit_attendence">
                                      {listheader.totalOpen}
                                    </h4>
                                  </div>
                                  <div className="ox-box-text">
                                    <h6>Open</h6>
                                  </div>
                                </div>
                              </div>

                              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                <div
                                  className="stats-info stats-info-cus"
                                  onClick={() => {
                                    // setEmptypefilter("Intern");
                                    // setStatus("Active");
                                    setActiveTab(1);
                                  }}                               >
                                  <div className="ox-colored-box-4 amountText">
                                    <h4 className="week_attendence">
                                      {listheader.totalAmountFY}k
                                    </h4>
                                  </div>
                                  <div className="ox-box-text">
                                    <h6>Total Amount</h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                    <>
                      {ischartopen ? (
                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                          <div className="tab-content">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group">
                                  <SelectComponent label={"Filter Data by Year"} placeholder={"Select Year..."} options={optionsyear} onChange={onChangeYear} value={setYear} />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group">
                                  <SelectComponent label={"Filter Data by Month"} placeholder={"Select Month..."} options={optionsmonth} onChange={onChangeMonth} value={setMouth} />
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className='oxy_chat_box'>
                                  <div className='graph-top-head'>
                                    <h3>Status</h3>
                                  </div>
                                  <Chart options={statusbar.options} series={statusbar.series} type="pie" height={345} width={233} />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className='oxy_chat_box'>
                                  <div className='graph-top-head'>
                                    <h3>Client</h3>
                                  </div>
                                  {/* {clientcountbar.series.length > 0 && ( */}
                                  <Chart options={clientcountbar.options} series={clientcountbar.series} type="bar" height={330} width="100%" />
                                  {/* )} */}
                                </div>
                              </div>

                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className='oxy_chat_box'>
                                  <div className='graph-top-head'>
                                    <h3>Opportunity</h3>
                                  </div>
                                  {opptunitycountbar.series.length > 0 && (
                                    <Chart options={opptunitycountbar.options} series={opptunitycountbar.series} type="bar" height={330} width="100%" />
                                  )}
                                </div>

                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                <div className='oxy_chat_box'>
                                  <div className='graph-top-head'>
                                    <h3>Monthly Trend</h3>
                                  </div>
                                  {monthlysumbar.series.length > 0 && (
                                    <Chart options={monthlysumbar.options} series={monthlysumbar.series} type="bar" height={330} width="100%" />
                                  )}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      ) : (<></>)}
                    </>

                  </>
                )}
                {activeTab === 1 && (
                  <div className="row">
                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                      <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                        <div className="card flex-fill comman-shadow oxyem-index">

                          <div className="center-part">
                            <div className="card-body oxyem-mobile-card-body oxyem-main-attendance_dashborad">
                              {typeof status === 'string' && (
                                <div className="active-filter-tag">
                                  <span>{statusDisplayMap[status] || status}</span>

                                  {/* <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span> */}

                                  <button
                                    className="remove-filter-btn"
                                    onClick={() => {
                                      setStatus(null);    // Clear the filter
                                      fetchData();        // Reload full data
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                              <div className="card-body oxyem-mobile-card-body">
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
                                      dashboradApi={'/opportunity/pricingDashboard'}
                                      onDeleteClick={onDeleteClick}
                                      status={status}
                                      searchfilter={status}
                                    />
                                  )}
                                </div>
                              </div>
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
        <Toaster
          position="top-right"
          reverseOrder={false}

        />
      </div>
    </>
  );
}
