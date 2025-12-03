import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs/Breadcrumbs";
import CustomDataTable from "../../Components/Datatable/tablewithApi.jsx";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import SelectComponent from '../../Components/common/SelectOption/SelectComponent.jsx';
import pageTitles from "../../../common/pageTitles.js";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function index() {
  // const EmployeeChart = ({ activeTab }) => {
  const router = useRouter();
  const [updleavelist, setUpdUserList] = useState([]);
  const [formcolumn, setFormColumn] = useState([]);
    const [emptypefilter, setEmptypefilter] = useState();
    const [employeeTypeCounts, setEmployeeTypeCounts] = useState({});
      const [status, setStatus] = useState();
    
  const [permanentCount, setPermanentCount] = useState(0);
  const [countactive, setCountactive] = useState(0);
  const [internCount, setInternCount] = useState(0);
  const [conCount, setConCount] = useState(0);
  const [roleWise, setRoleWise] = useState({});
  const [departmentWise, setDepartmentWise] = useState({});
  const [genderCounts, setGenderCounts] = useState({});
  const [todayStatus, setTodayStatus] = useState({});
  const [showGraph, setShowGraph] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
  const handleTabClick = (index) => {
    setActiveTab(index); // Update active tab index when a tab is clicked
  };

  const onViewClick = (id) => {
    router.push(`/employeeDashboard/${id}`);
  };

  const onDeleteClick = (id) => {
    // console.log(id)
  };
  const fetchClientData = async (value) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDashboardDetails`, {
        params: { isFor: "employees" },
      });
       

      if (response) {
        const dataCome = response.data.data;
const labels = dataCome.employeeTypeCounts.labels;
const series = dataCome.employeeTypeCounts.series;
const activeempl = dataCome.empStatus.labels;
const activeemps = dataCome.empStatus.series;

const permanentIndex = labels.indexOf("Permanent");
const internIndex = labels.indexOf("Intern");
const ContractIndex = labels.indexOf("Contract");
const activeIndex = activeempl.indexOf("Active");

if (activeIndex !== -1) {
  const countactive = activeemps[activeIndex];
  setCountactive(countactive); // ✅ Update the state properly
}
if (internIndex !== -1) {
  const countin = series[internIndex];
  setInternCount(countin); // ✅ Update the state properly
}
if (permanentIndex !== -1) {
  const count = series[permanentIndex];
  setPermanentCount(count); // ✅ Update the state properly
}
if (ContractIndex !== -1) {
  const countcon = series[ContractIndex];
  setConCount(countcon); // ✅ Update the state properly
}

        if (
          dataCome.employeeTypeCounts &&
          dataCome.genderCounts && dataCome.empStatus
        ) {
          setEmployeeTypeCounts({
            series: dataCome.employeeTypeCounts.series,
            options: {
              chart: {
                width: 380,
                type: "pie",
              },
              labels: dataCome.employeeTypeCounts.labels,
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                },
              ],
              title: {
                text: "Employees Type",
                align: "center",
                margin: 20,
                style: {
                  fontSize: "13px",
                  fontFamily: "Helvetica Now MT Micro Regular",
                  fontWeight: "500",
                  color: "#263238",
                },
              },
              colors: ["#156082", "#e97132", "#37997b"],
              legend: {
                position: "bottom",
              },
              fill: {
                opacity: 1,
              },
            },
          });
          setGenderCounts({
            series: dataCome.genderCounts.series,
            chart: {
              type: "pie",
              width: 600,
              height: 400,
            },
            title: {
              text: "Total Employees",
              align: "center",
              margin: 20,
              style: {
                fontSize: "13px",
                fontFamily: "Helvetica Now MT Micro Regular",
                fontWeight: "500",
                color: "#263238",
              },
            },
            labels: dataCome.genderCounts.labels,
            colors: ["#156082", "#e97132"],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 250,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            legend: {
              position: "bottom",
            },
          });
          setTodayStatus(
                    {
                        series: dataCome.empStatus.series,
                        chart: {
                            type: 'pie',
                            width: 600, 
                            height: 400 
                        },
                        title: {
                            text: "Today's Status",
                            align: 'center', 
                            margin: 20,
                            style: {
                                fontSize: '13px', 
                                fontFamily: 'Helvetica Now MT Micro Regular', 
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        labels: dataCome.empStatus.labels,
                        colors: ['#156082', '#ed6a58', '#fcb040'],
                        responsive: [
                
                            {
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 250,
                                    },
                                    legend: {
                                        position: 'bottom',
                                    },
                                },
                            },
                        ],
                        legend: {
                            position: 'bottom',
                        },
                    }
                )
                 setRoleWise(
                    {
                        chart: {
                            type: 'bar',
                            height: 350,
                            stacked: true,
                            toolbar: {
                                show: true,
                            },
                            zoom: {
                                enabled: true,
                            },
                        },
                        title: {
                            text: "Role Wise Employees",
                            align: 'center',
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        series: dataCome.roleWise.series,
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    legend: {
                                        position: 'bottom',
                                        offsetX: -10,
                                        offsetY: 0,
                                    },
                                },
                            },
                        ],
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                borderRadius: 0,
                                borderRadiusApplication: 'end',
                                borderRadiusWhenStacked: 'last',

                            },
                        },
                        xaxis: {
                            categories: dataCome.roleWise.categories,
                        },
                        colors: ['#156082', '#e97132', '#fcb040'],
                        legend: {
                            position: 'bottom',
                        },
                        fill: {
                            opacity: 1,
                        },
                    }
                )
                setDepartmentWise(
                    {
                        chart: {
                            type: 'bar',
                            height: 350,
                            stacked: true,
                            toolbar: {
                                show: true,
                            },
                            zoom: {
                                enabled: true,
                            },
                        },
                        title: {
                            text: "Department wise Employees",
                            align: 'center', 
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        series: dataCome.departmentWise.series,
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    legend: {
                                        position: 'bottom',
                                        offsetX: -10,
                                        offsetY: 0,
                                    },
                                },
                            },
                        ],
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                borderRadius: 0,
                                borderRadiusApplication: 'end',
                                borderRadiusWhenStacked: 'last',

                            },
                        },
                        xaxis: {
                            categories: dataCome.departmentWise.categories,
                        },
                        colors: ['#156082', '#e97132', '#fcb040'],
                        legend: {
                            position: 'bottom',
                        },
                        fill: {
                            opacity: 1,
                        },
                    }
                )
          setShowGraph(true);
        }
      }
    } catch (error) {}
  };
useEffect(() => {
    if (activeTab === 1 && index === 0) {
      setStatus(null);
                                          setEmptypefilter(null);    // Clear the filter

      fetchClientData();
    }
  }, []);
  useEffect(() => {
    if (activeTab === 0) {
      fetchClientData("dashboard");
    }
  }, [activeTab]);
  return (
    <>
      <Head>
        <title>{pageTitles.UserList}</title>
      </Head>

      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"User Directory"} addlink={"/user"} />

            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                {/* old  */}
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
                      {employeeTypeCounts && employeeTypeCounts.series && employeeTypeCounts.series.length > 0 && (

                      <div className="">
                        <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">
                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
 onClick={() => {
                                      setStatus("Active");
                                      setActiveTab(1);
                                    }}                               >
                              <div className="ox-colored-box-1">
                                <h4 className="all_attendence">
                                  {countactive}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Active</h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
                            //   onClick={() => handleTabClick(1)}
                               onClick={() => {
                                      setEmptypefilter("Permanent");
                                                                            setStatus("Active");

                                      setActiveTab(1);
                                    }}
                            >
                              <div className="ox-colored-box-2">
                                <h4 className="month_attendence">
                                  {permanentCount}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Permanent</h6>
                              </div>
                            </div>
                          </div>

                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
 onClick={() => {
                                      setEmptypefilter("Contract");
                                                                            setStatus("Active");

                                      setActiveTab(1);
                                    }}                            >
                              <div className="ox-colored-box-3">
                                <h4 className="notsubmit_attendence">
                                  {conCount}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Contract</h6>
                              </div>
                            </div>
                          </div>

                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
onClick={() => {
                                      setEmptypefilter("Intern");
                                      setStatus("Active");
                                      setActiveTab(1);
                                    }}                               >
                              <div className="ox-colored-box-4">
                                <h4 className="week_attendence">
                                  {internCount}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Interns</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      )} 
                    </div>
                    <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                      <div className="tab-content">
                       
                        <div className="row">
                          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            {showGraph &&
                              employeeTypeCounts.options &&
                              employeeTypeCounts.series && (
                                <div className="oxy_chat_box">
                                  <Chart
                                    options={employeeTypeCounts.options}
                                    series={employeeTypeCounts.series}
                                    type="pie"
                                    width="100%"
                                    height={250}
                                  />
                                </div>
                              )}
                          </div>
                          
                          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            {showGraph &&
                              genderCounts &&
                              genderCounts.series && (
                                <div className="oxy_chat_box">
                                  <Chart
                                    options={genderCounts}
                                    series={genderCounts.series}
                                    type="pie"
                                    width="100%"
                                    height={250}
                                  />
                                </div>
                              )}
                          </div>
                          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            {showGraph &&
                              todayStatus &&
                              todayStatus.series && (
                                <div className="oxy_chat_box">
                                  <Chart
                                    options={todayStatus}
                                    series={todayStatus.series}
                                    type="pie"
                                    width="100%"
                                    height={250}
                                  />
                                </div>
                              )}
                          </div>
                        </div>
                      {/* </div>
                    </div>
                    <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                      <div className="tab-content"> */}
                       

                        <div>
                          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                              {showGraph ? (
                    <div className="oxy_chat_box"  >
                        <Chart
                            options={roleWise}
                            series={roleWise.series}
                            type="bar"
                            height={275}
                        />
                    </div>
                ) : null}
                            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                               {showGraph ? (
                    <div className="oxy_chat_box"  >
                        <Chart
                            options={departmentWise}
                            series={departmentWise.series}
                            type="bar"
                            height={250}
                        />
                    </div>
                ) : null}
                            </div>
                          
                          </div>
                        </div>
                       

                        <br></br>
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
  {typeof status === "Active" && emptypefilter === "" && (
                              <div className="active-filter-tag">
                                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                <button
                                  className="remove-filter-btn"
                                  onClick={() => {
                                    setStatus(null);    // Clear the filter
                                    fetchClientData();        // Reload full data
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            )}
                             {typeof emptypefilter === 'string' && (
                              <div className="active-filter-tag">
                                <span>{emptypefilter.charAt(0).toUpperCase() + emptypefilter.slice(1)}</span>
                                <button
                                  className="remove-filter-btn"
                                  onClick={() => {
                                    setEmptypefilter(null);    // Clear the filter
                                    fetchClientData();        // Reload full data
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
                              {/* <h2> Welcome to User page</h2> */}

                              <CustomDataTable
                              key={`${emptypefilter || "all"}-${status || "all"}`}
                                title={""}
                                data={updleavelist}
                                columnsdata={formcolumn}
                                onViewClick={onViewClick}
                                onDeleteClick={onDeleteClick}
                                dashboradApi={"/employees"}
                                empType={emptypefilter}
                                status={status}

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
    </>
  );
}
// };
// export default EmployeeChart;