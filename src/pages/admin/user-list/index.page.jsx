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
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';


export default function index() {
  // const EmployeeChart = ({ activeTab }) => {
  const router = useRouter();
  const [updleavelist, setUpdUserList] = useState([]);
  const [formcolumn, setFormColumn] = useState([]);
  const [emptypefilter, setEmptypefilter] = useState();
  const [employeeTypeCounts, setEmployeeTypeCounts] = useState([]);
  const [status, setStatus] = useState();

  const [permanentCount, setPermanentCount] = useState(0);
  const [countactive, setCountactive] = useState(0);
  const [internCount, setInternCount] = useState(0);
  const [conCount, setConCount] = useState(0);
  const [roleWise, setRoleWise] = useState({ keys: [], data: [] });
  const [departmentWise, setDepartmentWise] = useState({keysD: [], data: []});
  const [genderCounts, setGenderCounts] = useState([]);
  const [todayStatus, setTodayStatus] = useState([]);
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
          setEmployeeTypeCounts(dataCome.employeeTypeCounts.labels.map((label, index) => ({
            id: label,
            label: label,
            value: dataCome.employeeTypeCounts.series[index],
          })));
          setGenderCounts(dataCome.genderCounts.labels.map((label, index) => ({
            id: label,
            label: label,
            value: dataCome.genderCounts.series[index],
          })));
          setTodayStatus(dataCome.empStatus.labels.map((label, index) => ({
            id: label,
            label: label,
            value: dataCome.empStatus.series[index],
          })));
          const keys = dataCome.roleWise.series.map(s => s.name);
          const barData = dataCome.roleWise.categories.map((category, index) => {
            const obj = { category };
            dataCome.roleWise.series.forEach(s => {
              obj[s.name] = s.data[index];
            });
            return obj;
          });
          setRoleWise({ keys, data: barData });
           const keysD = dataCome.departmentWise.series.map(s => s.name);
          const barDataDepartment = dataCome.departmentWise.categories.map((category, index) => {
            const obj = { category };
            dataCome.departmentWise.series.forEach(s => {
              obj[s.name] = s.data[index];
            });
            return obj;
          });
          setDepartmentWise({keysD, data: barDataDepartment})
          setShowGraph(true);
        }
      }
    } catch (error) { }
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
                            <div className="oxy_chat_box_new">
                              <div className="top-heading-chart">
                                Employees Type
                              </div>

                              <ResponsivePie
                                data={employeeTypeCounts}
                                margin={{ top: 30, right: 20, bottom: 100, left: 20 }}
                                colors={["#156082", "#e97132", "#37997b"]}
                                innerRadius={0}
                                padAngle={1}
                                cornerRadius={2}
                                activeOuterRadiusOffset={8}
                                borderWidth={1}
                                borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                                enableArcLinkLabels={true}
                                arcLinkLabelsSkipAngle={10}
                                arcLinkLabelsTextColor="#000"
                                arcLinkLabelsThickness={2}
                                arcLinkLabelsColor={{ from: 'color' }}
                                arcLabelsSkipAngle={0}
                                arcLabelsTextColor="#ffffff"
                                arcLabel={d => `${d.id}: ${d.value}`}
                                legends={[
                                  {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    translateY: 40,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemTextColor: '#000',
                                    symbolSize: 14,
                                    symbolShape: 'circle',
                                  },
                                ]}

                                theme={{
                                  labels: { text: { fontSize: 13 } },
                                  legends: { text: { fontSize: 14, fontWeight: 600 } },
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="oxy_chat_box_new">
                              <div className="top-heading-chart">
                                Total Employees
                              </div>

                              <ResponsivePie
                                data={genderCounts}
                                margin={{ top: 30, right: 20, bottom: 100, left: 20 }}
                                colors={["#156082", "#e97132", "#37997b"]}
                                innerRadius={0}
                                padAngle={1}
                                cornerRadius={2}
                                activeOuterRadiusOffset={8}
                                borderWidth={1}
                                borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                                enableArcLinkLabels={true}
                                arcLinkLabelsSkipAngle={10}
                                arcLinkLabelsTextColor="#000"
                                arcLinkLabelsThickness={2}
                                arcLinkLabelsColor={{ from: 'color' }}
                                arcLabelsSkipAngle={0}
                                arcLabelsTextColor="#ffffff"
                                arcLabel={d => `${d.id}: ${d.value}`}
                                legends={[
                                  {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    translateY: 40,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemTextColor: '#000',
                                    symbolSize: 14,
                                    symbolShape: 'circle',
                                  },
                                ]}

                                theme={{
                                  labels: { text: { fontSize: 13 } },
                                  legends: { text: { fontSize: 14, fontWeight: 600 } },
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                            <div className="oxy_chat_box_new">
                              <div className="top-heading-chart">
                                Today's Status
                              </div>
                              <ResponsivePie
                                data={todayStatus}
                                margin={{ top: 30, right: 20, bottom: 100, left: 20 }}
                                colors={["#156082", "#e97132", "#37997b"]}
                                innerRadius={0}
                                padAngle={1}
                                cornerRadius={2}
                                activeOuterRadiusOffset={8}
                                borderWidth={1}
                                borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                                enableArcLinkLabels={true}
                                arcLinkLabelsSkipAngle={10}
                                arcLinkLabelsTextColor="#000"
                                arcLinkLabelsThickness={2}
                                arcLinkLabelsColor={{ from: 'color' }}
                                arcLabelsSkipAngle={0}
                                arcLabelsTextColor="#ffffff"
                                arcLabel={d => `${d.id}: ${d.value}`}
                                legends={[
                                  {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    translateY: 40,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemTextColor: '#000',
                                    symbolSize: 14,
                                    symbolShape: 'circle',
                                  },
                                ]}

                                theme={{
                                  labels: { text: { fontSize: 13 } },
                                  legends: { text: { fontSize: 14, fontWeight: 600 } },
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {/* </div>
                    </div>
                    <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                      <div className="tab-content"> */}


                        <div>
                          <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                              <div className="oxy_chat_box_new">
                                <div className="top-heading-chart">
                                  Role Wise Employees
                                </div>
                                <ResponsiveBar
                                  data={roleWise.data}
                                  keys={roleWise.keys}
                                  indexBy="category"
                                  margin={{ top: 20, right: 30, bottom: 120, left: 30 }}
                                  padding={0.3}
                                  colors={['#156082', '#e97132', '#37997b']}
                                  axisBottom={{
                                    tickRotation: 18,
                                    legend: '',
                                    legendPosition: 'middle',
                                    legendOffset: 5,
                                  }}
                                  legends={[
                                    {
                                      dataFrom: 'keys',
                                      anchor: 'bottom',
                                      direction: 'row',
                                      justify: false,
                                      translateX: 0,
                                      translateY: 70,
                                      itemsSpacing: 10,
                                      itemWidth: 100,
                                      itemHeight: 20,
                                      itemDirection: 'left-to-right',
                                      itemOpacity: 0.85,
                                      symbolSize: 14,
                                      symbolShape: 'circle',
                                    },
                                  ]}
                                  theme={{
                                    labels: {
                                      text: {
                                        fontSize: 13,
                                        fontWeight: 600,
                                        fill: '#fff',
                                      },
                                    },
                                    legends: {
                                      text: {
                                        fontSize: 12,
                                        fontWeight: 500,
                                      },
                                    },
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                              <div className="oxy_chat_box_new">
                                <div className="top-heading-chart">
                                  Department wise Employees
                                </div>
                                <ResponsiveBar
                                  data={departmentWise.data}
                                  keys={departmentWise.keysD}
                                  indexBy="category"
                                  margin={{ top: 20, right: 30, bottom: 90, left: 30 }}
                                  padding={0.3}
                                  colors={['#156082', '#e97132', '#37997b']}
                                  axisBottom={{
                                    tickRotation: 0,
                                    legend: '',
                                    legendPosition: 'middle',
                                    legendOffset: 5,
                                  }}
                                  legends={[
                                    {
                                      dataFrom: 'keys',
                                      anchor: 'bottom',
                                      direction: 'row',
                                      justify: false,
                                      translateX: 0,
                                      translateY: 40,
                                      itemsSpacing: 10,
                                      itemWidth: 100,
                                      itemHeight: 20,
                                      itemDirection: 'left-to-right',
                                      itemOpacity: 0.85,
                                      symbolSize: 14,
                                      symbolShape: 'circle',
                                    },
                                  ]}
                                  theme={{
                                    labels: {
                                      text: {
                                        fontSize: 13,
                                        fontWeight: 600,
                                        fill: '#fff',
                                      },
                                    },
                                    legends: {
                                      text: {
                                        fontSize: 12,
                                        fontWeight: 500,
                                      },
                                    },
                                  }}
                                />
                              </div>
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
