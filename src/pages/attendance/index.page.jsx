import React, { useState, useEffect } from "react";
import Breadcrumbs from "../Components/Breadcrumbs/Breadcrumbsdiscription";
import CustomDataTable from "../Components/Datatable/tablewithApi.jsx";
import { axiosJWT } from "../Auth/AddAuthorization.jsx";
import { useRouter } from "next/router";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import View from "../Components/Popup/AttendenceHistroy";
import dynamic from "next/dynamic";
import SelectComponent from "../Components/common/SelectOption/SelectComponent.jsx";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import moment from "moment-timezone";
import { Toaster, toast } from "react-hot-toast";
import Head from "next/head";
import pageTitles from "../../common/pageTitles.js";
import SearchFilter from "../Components/SearchFilter/SearchFilter.jsx";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import Loader from "../Components/loader/loader.jsx";
import { ATTENDENCE_MANAGEMENT_TEXT } from "../../constants/AttendenceManagementText.js";
import TopSectionHeading from "../Components/common/Heading/TopSectionHeading.jsx";
import CheckInCheckoutButton from "../Components/Attendance/CheckInCheckoutButton.jsx";
import { FcPositiveDynamic } from "react-icons/fc";
const getCurrentTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const convertUtcToLocalTime = (utcTime, timeZone) => {
  // Early return for invalid or empty time
  if (!utcTime || utcTime.trim() === "") return "";

  try {
    const today = moment.utc().format("YYYY-MM-DD"); // Get today's date in UTC
    const utcDateTime = `${today}T${utcTime}Z`; // Combine date and time to form a full date-time string
    const localTime = moment.utc(utcDateTime).tz(timeZone).format("HH:mm:ss"); // Convert to local time

    if (localTime === "Invalid date") return ""; // Return empty string if the date is invalid
    return localTime;
  } catch (error) {
    return ""; // Return empty string in case of any error during conversion
  }
};

export default function Leaveview({ }) {
  const timeZone = getCurrentTimeZone();
  const router = useRouter();
  const [datacoloum, setDatacoloum] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [toplist, setToplist] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(true);
  const [Isaddress, setAddress] = useState();

  const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [timeDate, setTimeDate] = useState("");
  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    setIsClient(true);
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      const currentTime = new Date();
      setTimeDate(formatDateTime(currentTime));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.post("/api/location");
        const city = response.data.city;
        const state = response.data.state;
        const country = response.data.country;
        setAddress(`${city}, ${state}, ${country}`);
      } catch (error) {
        console.error("Error fetching location", error);
      }
    };

    fetchLocation();
  }, []);

  const handleEditClick = (id) => {
    router.push(`/attendance/${id}`);
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const desiredOrder = [
    "srno",
    "id",
    "dayAnddate",
    "starttime",
    "endtime",
    "noOfhrs",
    "weekendorDay",
    "status",
    "action",
  ];

  const sortColumns = (columns) => {
    return columns.sort((a, b) => {
      return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
    });
  };
  const sortAndFilterAllocationList = (allocationList) => {
    return allocationList.map((row) => {
      return row
        .filter((item) => item.name !== "idProject")
        .sort((a, b) => {
          return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
        });
    });
  };
  const [idShift, setidShift] = useState("");
  const [shiftDetails, setshiftDetails] = useState({});
  const [idsent, setIdSent] = useState("");
  const [punchmode, setPunchmode] = useState(true);
  const [aiPayload, setAiPayload] = useState({});
  const [hitInsight, setHitInsight] = useState(false);
  const fetchData = async () => {
    setHitInsight(false);
    try {
      // const response = await axiosJWT.get(`${apiUrl}/employeeAttendance`);
      const response = await axiosJWT.get(`${apiUrl}/attendance`, {
        params: { statsFor: "", isFor: "stats" },
      });
      if (response) {
        setHitInsight(true);
        setAiPayload(response.data.data);
        setIdSent(response.data.data.latestAttendance.idAttendance || "");
        setIdSent(response.data.data.latestAttendance.idAttendance || "");
        setPunchmode(response.data.data.latestAttendance.mode || "");
        setidShift(response.data.data.shiftDetails.idShift || "");
        setshiftDetails(response.data.data.shiftDetails || "");
        setToplist(response.data.data.attendancesummary || {});
        const sortedColumns = response.data.data.formcolumns
          ? sortColumns(response.data.data.formcolumns)
          : [];
        setDatacoloum(sortedColumns);
        const sortedAllocationList = response.data.data.attendancelist
          ? sortAndFilterAllocationList(response.data.data.attendancelist)
          : [];

        const transformedArray = sortedAllocationList.map((project) => {
          const projectObj = Object.fromEntries(
            project.map((item) => [item.name, item.value])
          );
          let formattedNoOfhrs = "";
          if (!isNaN(parseFloat(projectObj.noOfhrs))) {
            formattedNoOfhrs = parseFloat(projectObj.noOfhrs).toFixed(2);
          } else {
            formattedNoOfhrs = ""; // or any other default value you want to set
          }
          return [
            {
              name: "srno",
              value: projectObj.srno,
            },
            {
              name: "id",
              value: projectObj.id,
            },
            {
              name: "dayAnddate",
              value: projectObj.dayAnddate,
            },
            {
              name: "starttime",
              value: convertUtcToLocalTime(projectObj.starttime, timeZone),
            },
            {
              name: "endtime",
              value: convertUtcToLocalTime(projectObj.endtime, timeZone),
            },
            {
              name: "noOfhrs",
              value: formattedNoOfhrs,
            },
            {
              name: "weekendorDay",
              value: projectObj.weekendorDay,
            },
            {
              name: "status",
              value: projectObj.status,
            },
            {
              name: "action",
              value: projectObj.action,
            },
          ];
        });

        setRowData(transformedArray);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [updatelist, setupdatelist] = useState(false);

  const handlesubmitAttedence = async () => {
    const apipayload = {
      idAttendance: idsent,
      mode: punchmode ? "punchout" : "punchin",
      punchtime: timeDate,
      location: Isaddress,
      shiftType: idShift,
      idEmployee: "",
    };
    const message = !punchmode
      ? "You have successfully <strong>checked in</strong> your attendance!"
      : punchmode === "punchin"
        ? "You have successfully <strong>checked out</strong> your attendance!"
        : "Attendance submitted successfully!";
    const errormessage =
      "Error connecting to the backend. Please try after Sometime.";
    try {
      const response = await axiosJWT.post(`${apiUrl}/attendance`, apipayload);
      // Handle the response if needed
      if (response) {
        setTimeout(() => {
          setupdatelist(true);
          setTimeout(() => {
            setupdatelist(false);
          }, 2000); // Change back to false after another 2 seconds
        }, 2000);
        toast.success(
          ({ id }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "0",
              }}
            >
              <FaRegCheckCircle
                style={{
                  fontSize: "35px",
                  marginRight: "10px",
                  color: "#4caf50",
                }}
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
                  fontSize: "20px",
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
          }
        );

        setIsCheckIn(false);
        fetchData();
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
        }
      );
      // Handle the error if any
      console.error("Error occurred:", error);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistroyId, setIsHistroyId] = useState("");
  const handleHistoryClick = async (id) => {
    setIsHistroyId(id);
    openDetailpopup();
  };
  const openDetailpopup = async () => {
    setIsModalOpen(true);
  };
  const closeDetailpopup = async () => {
    setIsModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
  const handleTabClick = (index) => {
    setActiveTab(index); // Update active tab index when a tab is clicked
  };
  const optionsmonth = [
    { value: "Jan", label: "January" },
    { value: "Feb", label: "February" },
    { value: "Mar", label: "March" },
    { value: "Apr", label: "April" },
    { value: "May", label: "May" },
    { value: "Jun", label: "June" },
    { value: "Jul", label: "July" },
    { value: "Aug", label: "August" },
    { value: "Sep", label: "September" },
    { value: "Oct", label: "October" },
    { value: "Nov", label: "November" },
    { value: "Dec", label: "December" },
  ];
  // const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  const currentMonth = new Date().toLocaleString("en-US", { month: "short" });

  const currentYear = new Date().getFullYear().toString();
  const optionsyear = [];
  for (let year = 2021; year <= currentYear; year++) {
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
  const [ischartopen, setIsChartOpen] = useState(false);
  const [anualChartData, setAnualChartData] = useState();
  const [monthlyTrendData, setMonthlyTrend] = useState();
  const [monthlyData, setMonthlyData] = useState();
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  useEffect(() => {
    setIsLoadingGraph(true);
    // if (setMouth && setYear) {
    if (setMouth && setYear && activeTab === 0) {
      const getgraphData = async () => {
        const apipayload = {
          month: setMouth,
          year: setYear,
        };
        try {
          const response = await axiosJWT.get(`${apiUrl}/graphstats`, {
            params: { month: setMouth, year: setYear, isFor: "self" },
          });
          // Handle the response if needed
          if (response) {
            const yearchart = response.data.data.annual;
            const monthchart = response.data.data.month;
            const monthlytrendchart = response.data.data.monthlyTrend;

            setMonthlyData({
              series: monthchart.data,
              options: {
                chart: {
                  width: 450,
                  type: "pie",
                },
                labels: monthchart.label,
                colors: ["#26AF48", "#2196F3", "#FA7E12"],
                title: {
                  text: "",
                  align: "center",
                },
                legend: {
                  position: "bottom", // This line positions the legend at the bottom
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: "bottom", // Ensure it's also set for smaller screens
                      },
                    },
                  },
                ],
              },
            });
            setMonthlyTrend({
              series: [
                {
                  name: "Total Attendance",
                  data: monthlytrendchart.data,
                },
              ],
              options: {
                chart: {
                  height: 350,
                  type: "line",
                  zoom: {
                    enabled: false,
                  },
                },
                legend: { show: false },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  width: 1,
                  curve: "straight",
                  colors: ["#156082"], // Specify the line color you want here
                },
                markers: {
                  colors: "#156082", // Specify the hover pointer color here
                },
                title: {
                  text: "",
                  align: "left",
                },
                grid: {
                  row: {
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5,
                  },
                },
                xaxis: {
                  categories: monthlytrendchart.days,
                },
              },
            });
            setAnualChartData({
              series: yearchart.data,
              options: {
                chart: {
                  type: "bar",
                  height: 350,
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    endingShape: "rounded",
                    dataLabels: {
                      position: "top", // Show data labels on top of each bar
                    },
                  },
                },
                colors: ["#26AF48", "#2196F3", "#FA7E12"],
                dataLabels: {
                  enabled: false,
                },
                title: {
                  text: "",
                  align: "left",
                },
                stroke: {
                  show: true,
                  width: 1,
                  colors: ["transparent"],
                },
                xaxis: {
                  categories: yearchart.months,
                },
                yaxis: {
                  title: {
                    text: "",
                  },
                },
                fill: {
                  opacity: 1,
                },
                tooltip: {
                  y: {
                    formatter: function (val) {
                      return "" + val + " Days";
                    },
                  },
                },
              },
            });
            setIsChartOpen(true);
            setIsLoadingGraph(false);
          }
        } catch (error) {
          // Handle the error if any
          console.error("Error occurred:", error);
        }
      };
      setTimeout(function () {
        getgraphData();
      }, 0);
    }
  }, [setMouth, setYear, activeTab]);

  const [searchfilter, setSearchfilter] = useState({});
  const searchFilterData = async (value) => {
    setSearchfilter(value);
  };

  const [activeTableTab, setActiveTableTab] = useState(0); // State to manage active tab index
  const handleTableTabClick = (index) => {
    setActiveTableTab(index); // Update active tab index when a tab is clicked
  };

  // whenever the table‐tab or external filters change, recompute date‐range
  useEffect(() => {
    const today = new Date();
    let startDate, endDate;

    if (activeTableTab === 0) {
      // current calendar month
      const year = today.getFullYear();
      const month = today.getMonth();
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
    } else {
      // last 12 full months, excluding the current month
      endDate = new Date(today.getFullYear(), today.getMonth(), 0); // last day of previous month
      startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 11, 1); // first day 12 months ago
    }

    setSearchfilter({
      // preserve any other filters the user chose via SearchFilter
      ...searchfilter,

      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
    });
  }, [activeTableTab]);
  useEffect(() => {
    const mainElement = document.querySelector("body");
    if (mainElement) {
      mainElement.setAttribute("id", "attendance-module");
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute("id");
      }
    };
  }, []);

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
        case "leavesOnToday":
          const today = new Date().toISOString().split("T")[0];
          setSearchfilter({ currentDate: today });
          break;
        case "submit":
          setSearchfilter({ status: "submit" });
          break;
        case "LossOfPay":
          setSearchfilter({ leaveType: "LossOfPay" });
          break;
        case "currentMonthEmpLeaveCount":
          // filter = { special: "monthTotal" };
          break;
      }

      // setSearchfilter(filter);
      // console.log("Applied filter:", filter);
    }
  };
  const [loading, setLoading] = useState(false);
  const [aiRisks, setAiRisks] = useState([]);
  const [isModalAIOpen, setIsModalAIOpen] = useState(false);

  const prompt = `Attendance Prompt: 
Deep analyze the following employee attendance data. Generate the output in three sections with a maximum of three crisp points each with max 6 words:
1) Risk Banner Suggestions
2) Predictive Insight Cards
3) Positive Nudges
 
Keep the tone neutral, non-judgmental, and HR-safe. Can also add impact payroll if trend continues. Focus on system-usage patterns rather than personal assumptions. Make the text concise and suitable for dashboard UI and try to add some stats and number
Share the results in json proper json object in format [{"type":"Risk-Banner","values":[{"resultText":""}]},{"type":"predictive-insight","values":[{"resultText":""}]},{"type":"positive-nudges","values":[{"resultText":""}]}]
`;
  const STORAGE_KEY = "ai_insights:attendance";
  const buildAIContext = (aiPayload) => ({
    attendancesummary: {
      totalattendance: aiPayload?.attendancesummary?.totalattendance ?? 0,
      monthlycount: aiPayload?.attendancesummary?.monthlycount ?? 0,
      weeklycount: aiPayload?.attendancesummary?.weeklycount ?? 0,
      notsubmitted: aiPayload?.attendancesummary?.notsubmitted ?? 0
    },
    shiftDetails: {
      shiftName: aiPayload?.shiftDetails?.shifName ?? "",
      shiftTime: aiPayload?.shiftDetails?.shiftTime ?? ""
    }
  });
  const context = buildAIContext(aiPayload);

const generateAIContent = async () => {
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const now = Date.now();
  setLoading(true);
  try {
    const cachedItem = localStorage.getItem(STORAGE_KEY);

    if (cachedItem) {
      try {
        const parsed = JSON.parse(cachedItem);

        const isValidCache =
          parsed &&
          Array.isArray(parsed.data) &&
          parsed.data.length > 0 && 
          typeof parsed.timestamp === "number" &&
          now - parsed.timestamp < SIX_HOURS;

        if (isValidCache) {
          setAiRisks(parsed.data);
          return;
        }
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    const res = await fetch("/api/generateinsights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        data: context
      })
    });

    if (!res.ok) {
      throw new Error("Failed to fetch AI insights");
    }

    const dataGet = await res.json();
    let insightsArray;

    if (typeof dataGet.result === "string") {
      try {
        const parsedResult = JSON.parse(dataGet.result);
        insightsArray = parsedResult?.result;
      } catch {
        insightsArray = [];
      }
    } else {
      insightsArray = dataGet.result?.result;
    }

    const safeInsights = Array.isArray(insightsArray)
      ? insightsArray
      : [];
    if (safeInsights.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          data: safeInsights,
          timestamp: Date.now()
        })
      );
    }

    setAiRisks(safeInsights);

  } catch (error) {
    console.error("AI Insights Error:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if(hitInsight){
    generateAIContent();
    }
  }, [hitInsight]);

  const riskUIConfig = {
    "predictive-insight": {
      title: "🔮 Predictive Insights",
      headerClass: "bg-warning",
      colClass: "col-md-4"
    },
    "Risk-Banner": {
      title: "🚨 Risk Alerts",
      headerClass: "bg-risk-danger",
      colClass: "col-md-4"
    },
    "positive-nudges": {
      title: "🌱 Positive Nudges",
      headerClass: "bg-alert-success",
      colClass: "col-md-4"
    }
  };

  return (
    <>
      <Head>
        <title>{pageTitles.AttendanceDashboard}</title>
      </Head>
      <View
        isOpen={isModalOpen}
        closeModal={closeDetailpopup}
        isHistroyId={isHistroyId}
        section={"employeeAttendance"}
      />
      <div className="main-wrapper">
        <div className="page-wrapper">


          <div className="content container-fluid">
            <div className="row align-items-center">
              {/* Left: Breadcrumbs */}
              <div className="col-md-9 col-12">
                <Breadcrumbs
                  maintext={ATTENDENCE_MANAGEMENT_TEXT.TOP_RECORDS.TITLE}
                  discription={ATTENDENCE_MANAGEMENT_TEXT.TOP_RECORDS.SUB_TITLE}
                  icon={<MdAccessTime />}
                />
              </div>

              {/* Right: Check In / Out Button */}
              <div className="col-md-3 col-12 d-flex justify-content-md-end justify-content-start mt-3 mt-md-0 oxyem-create-attendenc-section main-text-for-attendence">
                <CheckInCheckoutButton
                  punchMode={punchmode}
                  onSubmit={handlesubmitAttedence}
                  currentTime={currentTime}
                  isClient={isClient}
                  formatDate={formatDate}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div>
                  <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">


                    <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">

                      <li
                        className={`nav-item ${activeTab === 0 ? "active" : ""
                          }`}
                      >
                        {" "}
                        {/* ✅ className */}
                        <a
                          className="nav-link"
                          onClick={() => handleTabClick(0)}
                        >
                          {" "}
                          {/* ✅ className */}
                          <div className="skolrup-profile-tab-link">
                            Summary Overview
                          </div>
                        </a>
                      </li>
                      <li
                        className={`nav-item ${activeTab === 1 ? "active" : ""
                          }`}
                      >
                        <a
                          className="nav-link"
                          onClick={() => handleTabClick(1)}
                        >
                          <div className="skolrup-profile-tab-link">
                            Detailed Records
                          </div>
                        </a>
                      </li>
                    </ul>
                    <div className="row">
                      <div className="col-12">
                        <div className="">
                          <div className="main-text-for-attendence left-right-padding ">
                            {!loading && Array.isArray(aiRisks) && aiRisks.length > 0 && (
                              <div className="row g-3 px-2">
                                {aiRisks.map((section, idx) => {
                                  const config = riskUIConfig[section.type];
                                  if (!config) return null;

                                  return (
                                    <div key={idx} className={config.colClass}>
                                      {/* Header */}
                                      <div
                                        className={`card-header bg-transparent border-0 fw-semibold ${config.headerClass}`}
                                      >
                                        {config.title}
                                      </div>

                                      {/* Card */}
                                      <div className="card card-analysis-h border-0 shadow-sm">
                                        <div className="card-body predictive-p">
                                          {Array.isArray(section.values) &&
                                            section.values.map((item, i) => (
                                              <div
                                                key={i}
                                                className="d-flex align-items-start gap-2 mb-3"
                                              >
                                                <span className="ai-dot" style={{ marginRight: 5 }}>•</span>
                                                <span className="text-muted">
                                                  {item.resultText}
                                                </span>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {activeTab === 0 && (
                    <>
                      <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                        <div className="">
                          <div>
                            {toplist && Object.keys(toplist).length > 0 && (
                              <div className="oxyem-top-box-design design-only-attendence attendence-top-data-main leave-top-data-main mx-0  row stats-grid">
                                <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                  <div
                                    className="stats-info stats-info-cus"
                                    onClick={() =>
                                      handleShowDataForStatus("submit")
                                    }
                                  >
                                    <img src="/assets/img/proposal-icon.png" />
                                    <div className="ox-colored-box-1">
                                      <h4 className="all_attendence">
                                        {toplist.totalattendance}
                                        <br />
                                        <span className="leave-days-label">
                                          DAYS
                                        </span>
                                      </h4>
                                    </div>
                                    <div className="ox-box-text">
                                      <h6>Days Present</h6>
                                      <p className="stats-p">
                                        {toplist.totalattendance}/22 working days
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                  <div className="stats-info stats-info-cus">
                                    <img src="/assets/img/reservation-icon.png" />
                                    <div className="ox-colored-box-2">
                                      <h4 className="month_attendence">
                                        {toplist.monthlycount}
                                        <br />
                                        <span className="leave-days-label">
                                          DAYS
                                        </span>
                                      </h4>
                                    </div>
                                    <div className="ox-box-text">
                                      <h6>This Month</h6>
                                      <p className="stats-p">
                                        {toplist.monthlycount}/22 working days
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                  <div className="stats-info stats-info-cus">
                                    <img src="/assets/img/reservation-icon.png" />
                                    <div className="ox-colored-box-3">
                                      <h4 className=" notsubmit_attendence">
                                        {toplist.weeklycount}
                                        <br />
                                        <span className="leave-days-label">
                                          DAYS
                                        </span>
                                      </h4>
                                    </div>
                                    <div className="ox-box-text">
                                      <h6>This Week</h6>
                                      <p className="stats-p">
                                        {toplist.weeklycount}/5 working days
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                                  <div className="stats-info stats-info-cus">
                                    <img src="/assets/img/booking-cancel-icon.png" />
                                    <div className="ox-colored-box-4">
                                      <h4 className="week_attendence">
                                        {toplist.notsubmitted}
                                        <br />
                                        <span className="leave-days-label">
                                          DAYS
                                        </span>
                                      </h4>
                                    </div>
                                    <div className="ox-box-text">
                                      <h6>Pending Attention</h6>
                                      <p className="stats-p">
                                        Records need action
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                        <TopSectionHeading
                          headingH1={ATTENDENCE_MANAGEMENT_TEXT.CHARTS.TITLE}
                          headingH2={""}
                          /** Icon={FcPositiveDynamic} */
                          Icon={FcPositiveDynamic}
                        />
                        <div className="tab-content">
                          {isLoadingGraph ? (
                            <Loader
                              text={
                                "Please wait while we load the attendance graph."
                              }
                            />
                          ) : (
                            <>
                              {ischartopen && (
                                <div>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="form-group">
                                        <SelectComponent
                                          label={"Filter Data by Year"}
                                          placeholder={"Select Year..."}
                                          options={optionsyear}
                                          onChange={onChangeYear}
                                          value={setYear}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="form-group">
                                        <SelectComponent
                                          label={"Filter Data by Month"}
                                          placeholder={"Select Month..."}
                                          options={optionsmonth}
                                          onChange={onChangeMonth}
                                          value={setMouth}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                      <div className="oxy_chat_box">
                                        <div className="graph-top-head">
                                          <h3>Monthly Status - {setMouth}</h3>
                                        </div>
                                        <Chart
                                          options={monthlyData.options}
                                          series={monthlyData.series}
                                          type="pie"
                                          width="100%"
                                          height={330}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                      <div className="oxy_chat_box">
                                        <div className="graph-top-head">
                                          <h3>Monthly Trend - {setMouth}</h3>
                                        </div>
                                        <Chart
                                          options={monthlyTrendData.options}
                                          series={monthlyTrendData.series}
                                          type="line"
                                          height={330}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                      <div className="oxy_chat_box">
                                        <div className="graph-top-head">
                                          <h3>Annual Chart - {setYear}</h3>
                                        </div>
                                        <Chart
                                          options={anualChartData.options}
                                          series={anualChartData.series}
                                          type="bar"
                                          height={330}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 1 && (
                    <div className="row">
                      <div className="col-12 col-lg-12 col-xl-12 d-flex">
                        <div className="card flex-fill comman-shadow oxyem-index">
                          <div className="center-part">
                            <div className="card-body oxyem-mobile-card-body oxyem-main-attendance_dashborad">
                              <SearchFilter
                                searchFilterData={searchFilterData}
                                formType={"searchFilterAttendanceForNonAdmin"}
                              />

                              <ul className="nav-tabs nav nav-tabs-bottom oxyem-graph-tab">
                                <li
                                  className={`nav-item ${activeTableTab === 0 ? "active" : ""
                                    }`}
                                >
                                  <a
                                    className="nav-link"
                                    onClick={() => handleTableTabClick(0)}
                                  >
                                    <div className="skolrup-profile-tab-link">
                                      Current Month
                                    </div>
                                  </a>
                                </li>
                                <li
                                  className={`nav-item ${activeTableTab === 1 ? "active" : ""
                                    }`}
                                >
                                  <a
                                    className="nav-link"
                                    onClick={() => handleTableTabClick(1)}
                                  >
                                    <div className="skolrup-profile-tab-link">
                                      Historical
                                    </div>
                                  </a>
                                </li>
                              </ul>
                              <div>
                                <div className="col-md-6 mt-2">
                                  {activeStatus !== null && (
                                    <div className="active-filter-tag">
                                      <span>
                                        {" "}
                                        {typeof activeStatus === "string"
                                          ? activeStatus
                                            .charAt(0)
                                            .toUpperCase() +
                                          activeStatus.slice(1)
                                          : activeStatus}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleShowDataForStatus("clr")
                                        }
                                        className="remove-filter-btn"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border"
                                  id="sk-create-page"
                                >
                                  <CustomDataTable
                                    title={""}
                                    data={rowData}
                                    columnsdata={datacoloum}
                                    ismodule={"leave"}
                                    onEditClick={handleEditClick}
                                    onHistoryClick={handleHistoryClick}
                                    dashboradApi={"/employeeAttendance"}
                                    utctimeconditionpage={"userAttendance"}
                                    updatelist={updatelist}
                                    searchfilter={searchfilter}
                                  />
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
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} autoClose={3000} closeOnClick pauseOnHover draggable/>
    </>
  );
}
