import React, { useState, useEffect } from "react";
import Breadcrumbs from "../Components/Breadcrumbs/Breadcrumbs";
import Link from "next/link";
import CustomDataTable from "../Components/Datatable/tablewithApi.jsx";
import { useRouter } from "next/router";
import SelectComponent from "../Components/common/SelectOption/SelectComponent.jsx";
import { axiosJWT } from "../Auth/AddAuthorization.jsx";
import View from "../Components/Popup/PayrollHistroy";
import { Toaster, toast } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import Head from "next/head";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import pageTitles from "../../common/pageTitles.js";
import { MdOutlineFileDownload } from "react-icons/md";

export default function payrollManagement() {
  const router = useRouter();
  const [columnss, setDatacoloum] = useState([]);
  const [data, setRowData] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [listheader, setListHeaders] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const [status, setStatus] = useState();
  const [activeTableTab, setActiveTableTab] = useState("");
  const [ischartopen, setIsChartOpen] = useState(false);
  const [monthlyData, setMonthlyData] = useState();
  const [monthlyPaymentData, setMonthlyPaymentData] = useState();
  const [monthlyTrend, setMonthlyTrend] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
  const handleTabClick = (index) => {
    setActiveTab(index); // Update active tab index when a tab is clicked
    //    if (index === 0) {
    //   setStatus(null); // Clear status when switching to dashboard
    // }
  };
  const handleEditClick = (id) => {
    router.push(`/attendance/${id}`);
  };
  //  const fetchData = async (status = "") => {
  //   try {
  //     const response = await axiosJWT.get(`${apiUrl}/payroll/getSalaryDetails`,
  //     status ? { params: { status } } : undefined );
  const fetchData = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/payroll/getSalaryDetails`);
      if (response) {
        setDatacoloum(response.data.data.formcolumns);
        const salaryDetails = response.data.data.salaryDetails;
        console.log(salaryDetails);
        setRowData(salaryDetails);
      }

      const responsestats = await axiosJWT.get(
        `${apiUrl}/payroll/payrollStats`,
        {
          params: { currency: selectedCurrency }
        }
      );

      if (responsestats) {
        const listheader = responsestats.data.data;
        console.log(listheader);
        // const listheader = responsedata.listheader || {};
        setListHeaders(listheader);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      const chartData = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(
            `${apiUrl}/payroll/payrollCharts`,
            {
              params: { currency: selectedCurrency }
            }
          );

          // Extract pie chart data for CurrentMonthStatus
          const currentMonthStatus = response.data.data.CurrentMonthStatus;
          const currentMonthPayment = response.data.data.MonthlyTotalPayment;
          const currentMonthlyTrend = response.data.data.MonthlyTrend;

          // Set up pie chart data for CurrentMonthStatus
          if (
            currentMonthStatus &&
            Array.isArray(currentMonthStatus.series) &&
            Array.isArray(currentMonthStatus.labels)
          ) {
            const numericSeries = currentMonthStatus.series.map(
              (val) => Number(val) || 0,
            );

            setMonthlyData({
              series: numericSeries,
              options: {
                chart: { width: 450, type: "pie" },
                labels: currentMonthStatus.labels,
                colors: ["#26AF48", "#2196F3", "#FA7E12", "#cf59f1"],
                title: {
                  text: "Current Month Status", align: "center", style: {
                    fontSize: '13px', // Font size
                    fontFamily: 'Helvetica Now MT Micro Regular', // Font family
                    fontWeight: '500', // Font weight
                    color: '#263238', // Font color
                  }
                },
                legend: { position: "bottom" },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: { width: 300 },
                      legend: { position: "bottom" },
                    },
                  },
                ],
              },
            });
            setIsChartOpen(true);

          } else {
            console.warn("Invalid chart data structure", currentMonthStatus);
            setIsChartOpen(false);
          }
          if (currentMonthPayment) {
            setMonthlyPaymentData(
              {
                series: currentMonthPayment.data,
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
                    text: "Monthly Total Payment",
                    align: 'center', // Center the title
                    margin: 20, // Space between the title and chart
                    style: {
                      fontSize: '13px', // Font size
                      fontFamily: 'Helvetica Now MT Micro Regular', // Font family
                      fontWeight: '500', // Font weight
                      color: '#263238', // Font color
                    },
                  },
                  stroke: {
                    show: true,
                    width: 1,
                    colors: ['transparent'],
                  },
                  xaxis: {
                    categories: currentMonthPayment.months,
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
                        return "" + val;
                      },
                    },
                  },
                },
              }
            )
            setIsChartOpen(true);
          }

          // Set up line chart data for currentMonthlyTrend

          if (
            currentMonthlyTrend &&
            Array.isArray(currentMonthlyTrend.data) &&
            Array.isArray(currentMonthlyTrend.months)
          ) {
            const numericData = currentMonthlyTrend.data.map(val => Number(val));

            setMonthlyTrend({
              series: [
                {
                  name: 'Monthly Trend',
                  data: numericData,
                }
              ],
              options: {
                chart: {
                  type: 'line',
                  zoom: { enabled: false },
                },
                title: {
                  text: 'Monthly Trend',
                  align: 'center',
                  style: {
                    fontSize: '13px', // Font size
                    fontFamily: 'Helvetica Now MT Micro Regular', // Font family
                    fontWeight: '500', // Font weight
                    color: '#263238', // Font color
                  }
                },
                xaxis: {
                  categories: currentMonthlyTrend.months,
                  labels: {
                    rotate: -45,
                  },
                },
                yaxis: {
                  labels: {
                    title: {
                      text: '',
                    },
                  },
                },
                stroke: {
                  curve: 'stepline',
                  width: 3,
                },
                dataLabels: {
                  enabled: false,
                },
                tooltip: {
                  y: {
                    //   formatter: (value) => `${value.toFixed(2)}`,
                    formatter: function (value) {
                      return "" + value;
                    },
                  },
                },
              },
            });

            setIsChartOpen(true);

          } else {
            console.warn("Invalid chart data structure", currentMonthlyTrend);
            setIsChartOpen(false);
          }
        } catch (error) {
          // Handle error
        }
      };

      chartData();
      fetchData();

    }
  }, [selectedCurrency, activeTab]);

  useEffect(() => {
    if (activeTab === 1 && index === 0) {
      setStatus(null);
      fetchData();
    }
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
    router.push(`/payrollPreview/${id}`);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isviewId, setIsViewId] = useState("");
  const onHistoryClick = async (id) => {
    setIsViewId(id);
    openDetailpopup();
  };
  const openDetailpopup = async () => {
    setIsModalOpen(true);
  };
  const closeDetailpopup = async () => {
    setIsModalOpen(false);
  };
  const onEditClick = (id) => {
    router.push(`/edit-payroll/${id}`);
  };
  const handleApprrovereq = async (id, type, data, onSuccess) => {
    const apipayload = {
      status: type,
      idSalary: id,
      rejectReason: data,
    };
    const message = `You have successfully <strong>${type}</strong> Payroll!`;
    const errormessage =
      "Error connecting to the backend. Please try after Sometime.";
    try {
      const response = await axiosJWT.post(
        `${apiUrl}/payroll/approveSalary`,
        apipayload,
      );
      // Handle the response if needed
      if (response) {
        onSuccess("clear");
        toast.success(
          ({ id }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "0",
              }}
            >
              <img
                src="/assets/img/proposal-icon.png"
                style={{ marginRight: "10px", width: "30px" }}
                alt="icon"
              />
              <span dangerouslySetInnerHTML={{ __html: message }}></span>
              <button
                onClick={() => toast.dismiss(id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4caf50",
                  marginLeft: "auto",
                  cursor: "pointer",
                }}
              >
                <FaTimes />
              </button>
            </div>
          ),
          {
            icon: null, // Disable default icon
            duration: 7000,
            style: {
              border: "1px solid #4caf50",
              padding: "8px",
              color: "#4caf50",
            },
          },
        );

        // fetchData();
      }
    } catch (error) {
      toast.success(
        ({ id }) => (
          <div
            style={{ display: "flex", alignItems: "center", borderRadius: "0" }}
          >
            <img
              src="/assets/img/wrong.png"
              style={{ marginRight: "10px", width: "30px" }}
              alt="icon"
            />
            <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
            <button
              onClick={() => toast.dismiss(id)}
              style={{
                background: "none",
                border: "none",
                color: "#FF000F",
                marginLeft: "auto",
                cursor: "pointer",
              }}
            >
              <FaTimes />
            </button>
          </div>
        ),
        {
          icon: null, // Disable default icon
          duration: 7000,
          style: {
            border: "1px solid #FF000F",
            padding: "8px",
            color: "#FF000F",
          },
        },
      );
      // Handle the error if any
      console.error("Error occurred:", error);
    }
  };

  const handelDownloadAllPayslip = async () => {
    try {
      const response = await axiosJWT.get(
        `${apiUrl}/payroll/downloadAllEmpSalaryDetails`,
        {
          responseType: "blob", // This tells Axios to treat the response as binary data
        },
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "All_Payslips.xlsx"); // Set desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("Failed to download payslips. Please try again later.");
      }
    } catch (error) {
      console.error("Error downloading payslips:", error);
      toast.error("Error downloading payslips. Please try again later.");
    }
  };

  return (
    <>
      <Head>
        <title>{pageTitles.PayrollDashboard}</title>
        <meta name="description" content={pageTitles.PayrollDashboard} />
      </Head>
      <View
        isOpen={isModalOpen}
        closeModal={closeDetailpopup}
        isviewId={isviewId}
        section={"employeeLeave"}
      />
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row align-items-center mb-3">
              <div className="col-12">
                <Breadcrumbs
                  maintext={"Dashboard (Payroll)"}
                  pagename="payrollmanagement"
                /></div>
              <div className="col-12">
                {/* <button
    className="btn btn-primary"
    type="submit"
    onClick={handelDownloadAllPayslip}
  >
    <MdOutlineFileDownload size={20} style={{ marginRight: "5px" }} />
    Download
  </button> */}
                <div className="">
                  <div className="float-end ps-0">
                    <Link
                      href={"/add-payroll"}
                      className='btn btn-oxyem me-2'
                    >
                      Employee
                    </Link>
                    <Link
                      href={"/add-payrollemp"}
                      className='btn btn-oxyem me-2 '
                    >
                      Non-Employee
                    </Link>
                    <button
                      className="btn btn-primary"
                      type="submit"
                      onClick={handelDownloadAllPayslip}
                    >
                      <MdOutlineFileDownload size={20} style={{ marginRight: "5px" }} />
                      Download
                    </button></div>
                </div>

              </div></div>
            {/* <div className="row">
                                
                                <div className="col-6 col-lg-6 col-xl-6"><></></div>
                                <div className="col-6 col-lg-6 col-xl-6"><a className="btn btn-primary payrollbtn" href="/add-payroll" role="button">Employee Payroll</a>
                                <a className="btn btn-primary" href="/add-payrollemp" role="button">Non-Employee Payroll</a> 
                                    
                            

                                </div>
        </div> */}
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                {/* <div className="row">
                  <div className="col-12 col-lg-12 col-xl-12 d-flex"> */}
                    {/* <div className="card flex-fill comman-shadow oxyem-index payroll_page_main"> */}
                      <div className="center-part">
                        <div className="text-end w-100 mx-2 mt-2">
                          {/* <button
                            className="btn btn-primary"
                            type="submit"
                            onClick={handelDownloadAllPayslip}
                          >
                            <MdOutlineFileDownload
                              size={20}
                              style={{ marginRight: "5px" }}
                            />
                            Download Payroll
                          </button> */}
                        </div>
                        <div className="row">
                          <></>
                        </div>
                        {/* <br></br>
                        <br></br> */}
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
                              <div className="skolrup-profile-tab-link">
                                Detailed Records
                              </div>
                            </a>
                          </li>
                        </ul>
                        {/* <br></br> */}
</div>
                        {activeTab === 0 && (
                          <>
                            {/* <div className="col-md-3 ms-auto">
                              <div className="form-group">
                                <SelectComponent label={"Filter Data by Currency"} placeholder={""} options={currencyOptions} onChange={handleCurrencyChange} value={selectedCurrency} />
                              </div>
                            </div> */}
                            
                            <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
<br></br><div className="tab-content"><div className="row"><div className="col-md-4 ms-auto">
                              <div className="form-group mb-0">
                                <SelectComponent label={"Filter Data by Currency"} placeholder={""} options={currencyOptions} onChange={handleCurrencyChange} value={selectedCurrency} />
                              </div>
                            </div>
                             </div>
                            </div>
                            {listheader &&
                              Object.keys(listheader).length > 0 && (
                                
                                <div className="">
                                  <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">
                                
                                {/* <div
                                  className="oxyem-top-box-design design-only-attendence"
                                  style={{ marginBottom: "30px" }}
                                > */}
                              <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">

                                  <div className="stats-info stats-info-cus" onClick={() => handleTabClick(1)}>
                                      <div className='ox-colored-box-1 amountText'>
                                    <h4 className="all_attendence">
                                      {listheader.totalMonthAmount}
                                    </h4></div>
                                    <div className="ox-box-text">
                                    <h6>Monthly Amount</h6>
                                  </div></div>
                              </div>
                               <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">

                                  <div className="stats-info stats-info-cus"
                                    onClick={() => handleTabClick(1)}>
                                     <div className="ox-colored-box-2 amountText">

                                    <h4 className="month_attendence">
                                      {listheader.totalYearAmount}
                                    </h4></div>
                                                                        <div className="ox-box-text">

                                    <h6>Yearly Amount</h6>
                                  </div></div>
</div>

                               <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">

                                  <div className="stats-info stats-info-cus"
                                    onClick={() => {
                                      setStatus("generated");
                                      setActiveTab(1);
                                    }}>
                                     <div className="ox-colored-box-3">

                                    <h4 className="notsubmit_attendence">
                                      {listheader.totalPending}
                                    </h4></div><div className="ox-box-text">
                                    <h6>Pending</h6>
                                  </div></div></div>


                                 <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">

                                  <div className="stats-info stats-info-cus"
                                    onClick={() => {
                                      setStatus("paid");
                                      setActiveTab(1);
                                    }}>
                                   <div className="ox-colored-box-4">

                                    <h4 className="week_attendence">
                                      {listheader.totalGenerated}
                                    </h4></div><div className="ox-box-text">
                                    <h6>Paid</h6>
                                  </div>
                                  </div></div>
                                  {/* <div className="stats-info stats-info-cus shift-heading-box" style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setStatus("paid");
                                      setActiveTab(1);
                                    }}>
                                    <h4 className="week_attendence">
                                      {listheader.totalPayrolls}
                                    </h4>
                                    <h6>#Payrolls</h6>
                                  </div> */}
                                </div></div>
                              )}
</div>
                            {/* <br></br>
                            <br></br> */}
                            <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">

                            {ischartopen ? (
                              <div className="tab-content">
                                <div className="row">
                                  <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                    <div className="oxy_chat_box">
                                      <Chart
                                        options={monthlyData.options}
                                        series={monthlyData.series}
                                        type="pie"
                                        height={310}
                                      />
                                    </div>
                                  </div>
                                  {monthlyPaymentData?.options && monthlyPaymentData?.series && (
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                      <div className="oxy_chat_box"   >
                                        <Chart options={monthlyPaymentData?.options} series={monthlyPaymentData?.series} type="bar" height={330} />
                                      </div>
                                    </div>
                                  )}
                                  {monthlyTrend?.options && monthlyTrend?.series && (
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                      <div className="oxy_chat_box"   >
                                        <Chart options={monthlyTrend?.options} series={monthlyTrend?.series} type="line" height={330} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                            <br></br>
                            </div>
                          </>
                        )}

                        {/* 0 end */}
                        {/* <div className="tab-content"> */}
                        {activeTab === 1 && (


                          <>
                              {/* <div className="col-12 col-lg-12 col-xl-12 d-flex"> */}
 <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                                                        <div className="card flex-fill comman-shadow oxyem-index">
                                                                            <div className="center-part">
                                                                                <div className="card-body oxyem-mobile-card-body oxyem-main-attendance_dashborad">
                            {typeof status === 'string' && (
                              <div className="active-filter-tag">
                                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
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
                              <div
                                className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border"
                                id="sk-create-page"
                              >
                                <CustomDataTable
                                  title={""}
                                  data={data}
                                  columnsdata={columnss}
                                  onViewClick={onViewClick}
                                  onHistoryClick={onHistoryClick}
                                  onEditClick={onEditClick}
                                  handleApprrovereq={handleApprrovereq}
                                  pagename={"addpayroll"}
                                  dashboradApi={"/payroll/getSalaryDetails"}
                                  status={status}
                                  searchfilter={status}
                                />
                              </div>
                            </div>
                             </div>
                            </div>
                             </div>
                            </div>
                         {/* </div>  */}
                         </>
                        )}{" "}
                        {/* </div> */}
                      </div>
                    {/* </div>
                  </div> */}
                </div>
              </div>
            </div>
          {/* </div> */}
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
