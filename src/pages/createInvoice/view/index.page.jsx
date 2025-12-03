import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import InvoiceHistroy from '../../Components/Popup/invoiceHistroy';
import SendEmailModal from '../../Components/Popup/SendEmailModal';
import { FaTimes } from "react-icons/fa";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import SelectComponent from '../../Components/common/SelectOption/SelectComponent.jsx';
import Head from 'next/head';
import pageTitles from '../../../common/pageTitles.js';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function InvoiceView() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isrefresh, setRefresh] = useState(true);
  const [opportunityId, setOpportunityId] = useState("");
  const [isModalHistroyOpen, setIsModalHistroyOpen] = useState(false);
  const onViewClick = (id) => {
    router.push(`/createInvoice/view/${id}`);
  };

  const onHistoryClick = async (id) => {
    setOpportunityId(id);
    setIsModalHistroyOpen(true)
  };
  const closeHistroyClick = (id) => {
    setIsModalHistroyOpen(false)
  };
  const onEditClick = (id) => {
    router.push(`/createInvoice/${id}`);
  };
  const handleApprrovereq = async (id, type, data, onSuccess) => {
    const apipayload = {
      "status": type,
      "ids": id,
      "rejectReason": data
    }
    const message = type === 'approved'
      ? 'You have successfully <strong>Approved</strong> Invoice!'
      : 'You have successfully <strong>Rejected</strong> Invoice!';
    const errormessage = 'Error connecting to the backend. Please try after Sometime.';
    try {
      const response = await axiosJWT.post(`${apiUrl}/opportunity/invoiceApproval`, apipayload);
      if (response) {

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
        onSuccess("clear");
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
        icon: null,
        duration: 7000,
        style: {
          border: '1px solid #FF000F',
          padding: '8px',
          color: '#FF000F',
        },
      });

    }
  }
  const handleDecommissionreq = async (data) => {
  };

  const onDeleteClick = (id) => {

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
  const [toplist, setToplist] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const [statusChartData, setStatusChartData] = useState();
  const [clientChartData, setClientChartData] = useState();
  const [yearChartData, setYearChartData] = useState();
  const [isannualOpen, setIsAnnualOpen] = useState(false);
useEffect(() => {
  if (!setMouth || !setYear) return;

  const getgraphData = async () => {
    const apipayload = { month: setMouth, year: setYear };

    try {
      const response = await axiosJWT.post(`${apiUrl}/opportunity/invoiceGraph`, apipayload);
      if (!response?.data?.data) return;

      const { statusChart, yearChart, clientChart } = response.data.data;

      // STATUS CHART
      if (statusChart) {
        setStatusChartData({
          series: [{ name: "Status", data: statusChart.dataSet }],
          options: {
            chart: {
              height: 350,
              type: "bar",
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  const category = statusChart.labels[config.dataPointIndex];
                  if (!category) return;
                  requestAnimationFrame(() => {
                    setSearchfilter({ status: category });
                    setActiveTab(1);
                    setActiveStatus(category);
                  });
                },
              },
            },
            plotOptions: { bar: { columnWidth: "50%" } },
            dataLabels: { enabled: false },
            stroke: { width: 0 },
            grid: { row: { colors: ["#fff", "#f2f2f2"] } },
            xaxis: { labels: { rotate: -45 }, categories: statusChart.labels, tickPlacement: "on" },
            yaxis: { title: { text: "" } },
            fill: { type: "color" },
            colors: ["#2196F3", "#33FF57", "#3357FF", "#FF33A8"],
          },
        });
      }

      // CLIENT CHART
      if (clientChart) {
        setClientChartData({
          series: [{ name: "Client", data: clientChart.dataset }],
          options: {
            chart: {
              height: 350,
              type: "bar",
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  const category = clientChart.labels[config.dataPointIndex];
                  if (!category) return;
                  requestAnimationFrame(() => {
                    setSearchfilter({ customerName: category });
                    setActiveTab(1);
                    setActiveStatus(category);
                  });
                },
              },
            },
            plotOptions: { bar: { columnWidth: "50%" } },
            dataLabels: { enabled: false },
            stroke: { width: 0 },
            grid: { row: { colors: ["#fff", "#f2f2f2"] } },
            xaxis: { labels: { rotate: -45 }, categories: clientChart.labels, tickPlacement: "on" },
            yaxis: { title: { text: "" } },
            fill: { type: "color" },
          },
        });
      }

      // YEAR CHART
      if (yearChart) {
        setYearChartData({
          series: yearChart.dataset,
          options: {
            chart: {
              type: "bar",
              height: 350,
              // events: {
              //   dataPointSelection: (event, chartContext, config) => {
              //     const category = yearChart.labels[config.dataPointIndex];
              //     if (!category) return;
              //     requestAnimationFrame(() => {
              //       setSearchfilter({ month: category });
              //       setActiveTab(1);
              //       setActiveStatus(category);
              //     });
              //   },
              // },
            },
            plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ["transparent"] },
            xaxis: { categories: yearChart.labels },
            yaxis: { title: { text: "" } },
            fill: { opacity: 1 },
            tooltip: { y: { formatter: (val) => `${val}` } },
            colors: ["#2196F3", "#26AF48", "#f8a921", "#FF000F"],
          },
        });
      }

      setIsAnnualOpen(true);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  getgraphData();
}, [setMouth, setYear]); // <-- removed activeTab



  const [statData, setStatData] = useState({});
  async function fetchInvoiceData() {
    try {
      const response = await axiosJWT.get(`${apiUrl}/opportunity/invoiceStats`)
      if (response) {
        setStatData(response.data.data || {});
      }
    } catch (error) {


    }
  }
  useEffect(() => {
    if (activeTab === 0) {
      fetchInvoiceData()
    }
  }, [activeTab])

  const [isModalMailOpen, setIsMailModalOpen] = useState(false);
  const [idforEmail, setIdForEmail] = useState("");
  const onEmailClick = (id) => {
    setIdForEmail(id)
    setIsMailModalOpen(true)
  };

  const closeMailPopupClick = (id) => {
    setIsMailModalOpen(false)
  };

  useEffect(() => {
    const mainElement = document.querySelector('body');
    if (mainElement) {
      mainElement.setAttribute('id', 'invoice-module');
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute('id');
      }
    };
  }, []);

      const [searchfilter, setSearchfilter] = useState({});
  
      const [activeStatus, setActiveStatus] = useState(null);
      const [activeTableTabStatus, setActiveTableTabStatus] = useState(null);
  
      const handleShowDataForStatus = (filterKey) => {
          setActiveTab(1); // switch to table tab
          setActiveTableTabStatus(filterKey);
          setActiveStatus(filterKey);
  
          if (filterKey === "clr") {
              setSearchfilter({});
              setActiveStatus(null);
          } else {
              let filter = {};
  
              switch (filterKey) {
                  case "generated":
                      setSearchfilter({ status: "generated" });
                      break;
                  case "approved":
                      setSearchfilter({ status:"approved" });
                      break;
                  case "dispatched":
                      setSearchfilter({ status: "dispatched" });
                      break;
                  case "draft":
                       setSearchfilter ( { status: "draft" }); 
                      break;
              }
  
              // setSearchfilter(filter);
              // console.log("Applied filter:", filter);
          }
      };
  return (
    <>
      <Head><title>{pageTitles.CreateInvoiceView}</title></Head>
      <div className="main-wrapper">
        <SendEmailModal isOpen={isModalMailOpen} closeModal={closeMailPopupClick} id={idforEmail} />
        <InvoiceHistroy isOpen={isModalHistroyOpen} closeModal={closeHistroyClick} opportunityId={opportunityId} />
        <div className="page-wrapper" id="create_invoice_list">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Dashboard (Create Invoice)"} addlink={"/createInvoice"} />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                  <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                    <li class={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                      <a class={`nav-link`} onClick={() => handleTabClick(0)}>
                        <div className="skolrup-profile-tab-link">Summary Overview</div>
                      </a>
                    </li>
                    <li class={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                      <a class={`nav-link`} onClick={() => handleTabClick(1)}>
                        <div className="skolrup-profile-tab-link">Detailed Records</div>
                      </a>
                    </li>
                  </ul>
                </div>


                {activeTab === 0 &&
                  <>

                    <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                      <div className="">
                        <div>
                          {statData && Object.keys(statData).length > 0 && (

                            <div className="oxyem-top-box-design design-only-attendence attendence-top-data-main leave-top-data-main mx-0  row stats-grid">

                              <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("generated")}>
                                  <img src='/assets/img/proposal-icon.png' />
                                  <div className='ox-colored-box-1'><h4 className='all_attendence'>
                                    {statData.invoiceSubmissionPending}
                                  </h4></div>
                                  <div className='ox-box-text'><h6>Generated</h6></div>
                                </div>
                              </div>

                              <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("approved")}>
                                  <img src='/assets/img/reservation-icon.png' />
                                  <div className='ox-colored-box-2'><h4 className='month_attendence'>
                                    {statData.invoiceApproved}
                                  </h4></div>
                                  <div className='ox-box-text'><h6>Approved</h6></div>
                                </div>
                              </div>

                              <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("dispatched")}>
                                  <img src='/assets/img/reservation-icon.png' />
                                  <div className='ox-colored-box-3'><h4 className='notsubmit_attendence'>
                                    {statData.invoiceDispatched}
                                  </h4></div>
                                  <div className='ox-box-text'><h6>Dispatched</h6></div>
                                </div>
                              </div>

                              <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                <div className="stats-info stats-info-cus" onClick={() => handleShowDataForStatus("draft")}>
                                  <img src='/assets/img/booking-cancel-icon.png' />
                                  <div className='ox-colored-box-4'><h4 className='week_attendence'>
                                    {statData.invoiceRejected}
                                  </h4></div>
                                  <div className='ox-box-text'><h6>Draft</h6></div>

                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                      <div className="tab-content">
                        {isannualOpen ? (
                          <div>

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
                              <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                <div className='oxy_chat_box'>
                                  <div className='graph-top-head'>
                                    <h3>Invoice Status - Monthly</h3>
                                  </div>
                                  {
                                    statusChartData && statusChartData.options && statusChartData.series ? (
                                      <Chart
                                        options={statusChartData.options}
                                        series={statusChartData.series}
                                        type="bar"
                                        height={250}
                                      />
                                    ) : null
                                  }
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                <div className='oxy_chat_box'>
                                  <div className='graph-top-head'>
                                    <h3>Invoice Status - Yearly</h3>
                                  </div>
                                  {
                                    yearChartData && yearChartData.options && yearChartData.series ? (
                                      <Chart
                                        options={yearChartData.options}
                                        series={yearChartData.series}
                                        type="bar"
                                        height={250}
                                      />
                                    ) : null
                                  }
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                <div className='oxy_chat_box'>
                                  <div className='graph-top-head'>
                                    <h3>Client Wise - Monthly</h3>
                                  </div>
                                  {
                                    clientChartData && clientChartData.options && clientChartData.series ? (
                                      <Chart
                                        options={clientChartData.options}
                                        series={clientChartData.series}
                                        type="bar"
                                        height={250}
                                      />
                                    ) : null
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (<></>)}

                      </div>

                    </div>
                  </>
                }
                {activeTab === 1 &&
                  <>

                <div className="row">
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                           <div className="col-md-6 mt-2">
                                                                    {activeStatus !== null && (
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
                                onEmailClick={onEmailClick}
                                handleApprrovereq={handleApprrovereq}
                                handleDecommissionreq={handleDecommissionreq}
                                pagename={"addpayroll"}
                                dashboradApi={'/opportunity/invoiceList'}
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

                  </>
                }



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
