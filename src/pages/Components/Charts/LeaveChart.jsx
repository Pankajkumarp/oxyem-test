import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import Profile from '../commancomponents/profile.jsx';
import LeaveAdminDetailsDrawer from '../Popup/LeaveAdminDetail.jsx';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const LeaveChart = ({ activeTab }) => {
  const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const [leavesOnToday, setLeavesOnToday] = useState("");
  const [approvalPending, setApprovalPending] = useState("");
  const [annualStatus, setAnnualStatus] = useState("");
  const [monthlyStatus, setMonthlyStatus] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [empLeaveDetail, setEmpLeaveDetail] = useState([]);
  const [searchfilter, setSearchfilter] = useState({});
  const [activeStatus, setActiveStatus] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fetchClientData = async (value) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDashboardDetails`, {
        params: { isFor: value },
      });
      if (response) {
        const dataCome = response.data.data
        console.log("dataCome", dataCome)
        setLeavesOnToday(dataCome.leavesOnToday)
        setEmpLeaveDetail(dataCome.leavesOnTodayList)
        setApprovalPending(dataCome.approvalPending)
        setAnnualStatus(
          {
            series: [{
              name: 'Leave',
              data: dataCome.anualTrend.data
            }],
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
               events: {
      dataPointSelection: (event, chartContext, config) => {
        const category =
          chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
        if (!category) return;

        requestAnimationFrame(() => {
          handleChartClick({ month: category }); // or { period: category }
          setActiveStatus(category);
        });
      },
    },
            },
            title: {
              text: `Annual status ${currentYear}`,
              align: 'center', // Center the title
              margin: 20, // Space between the title and chart
              style: {
                fontSize: '13px', // Font size
                fontFamily: 'Helvetica Now MT Micro Regular', // Font family
                fontWeight: '500', // Font weight
                color: '#263238', // Font color
              },
            },
            options: {
              chart: {
                height: 350,
                type: 'bar',
              },
              stroke: {
                width: 0
              },
              grid: {
                row: {
                  colors: ['#fff', '#f2f2f2']
                }
              },
            },
            colors: ['#156082', '#f3797e'],
            xaxis: {
              categories: dataCome.anualTrend.categories,
            },
          }
        );
        setMonthlyStatus(
          {
            series: [{
              name: 'Leave',
              data: dataCome.monthlyTrend.data
            }],
            title: {
              text: `Monthly status ${currentMonth} ${currentYear}`,
              align: 'center',
              margin: 20,
              style: {
                fontSize: '13px',
                fontFamily: 'Helvetica Now MT Micro Regular',
                fontWeight: '500',
                color: '#263238',
              },
            },
            options: {
              chart: {
                height: 350,
                type: 'bar',
              },
              stroke: {
                width: 0
              },
              grid: {
                row: {
                  colors: ['#fff', '#f2f2f2']
                }
              },
               events: {
      dataPointSelection: (event, chartContext, config) => {
        const category =
          chartContext.w.config.xaxis?.categories?.[config.dataPointIndex];
        if (!category) return;

        requestAnimationFrame(() => {
          handleChartClick({ date: category }); // your filter key
          setActiveStatus(category);
        });
      },
    },
            },
            colors: ['#e97132', '#f3797e'],
            xaxis: {
              categories: dataCome.monthlyTrend.categories, // X-axis categories
            },
          }
        )
        setShowGraph(true)

      }
    } catch (error) {

    }
  };
  useEffect(() => {
    if (activeTab === "All") {
      fetchClientData("leaves");
    }
  }, [activeTab]);

      const handleChartClick = (filterObject) => {
        setSearchfilter(filterObject); // set gender/role
        setActiveStatus(Object.values(filterObject)[0]); // optional
        setIsDrawerOpen(true); // open drawer
    };

    const handleClearFilter = () => {
        setActiveStatus(null);
        setSearchfilter(null);     // or {}
        setIsDrawerOpen(false);    // close drawer
    };

  return (
    <div className='row'>
      <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6
 custom_padding_taskbar">
        {showGraph ? (
          <div className="oxy_chat_box cus_leave_box_e">
            <div className="oxy_chat_inner_text">
              <div className='leave_grap_section_t_box'>
                <p>{leavesOnToday}</p>
                <span>On Leave Today</span>
              </div>
              {empLeaveDetail && empLeaveDetail.length > 0 ? (
                <div className='leave_grap_section_box'>
                  {empLeaveDetail.map((emp, index) => (
                    <div className="leave_grap_inner_box" key={emp.profilePicPath}>
                      <div className='graph_profile_img'>
                        <Profile name={emp.employeeName} imageurl={`${baseImageUrl}/${emp.profilePicPath}`} size={20} />
                        <div className='info_e_sec'>
                          <h4 className='graph_name_sec'>{emp.employeeName}</h4>
                          <h5 className='graph_type_sec'>{emp.leaveType}</h5>
                        </div>
                      </div>

                      <div className={`graph_status_sec oxyem-mark-${emp.status}`}>{emp.status}</div>
                    </div>
                  ))}
                </div>
              ) : (null)}
            </div>
          </div>
        ) : null}
      </div>
      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6
 custom_padding_taskbar">
        {showGraph ? (
          <div className="oxy_chat_box"   >
            <Chart
              options={annualStatus}
              series={annualStatus.series}
              type="bar"
              width="100%"
              height={330}
            />
          </div>
        ) : null}
      </div>
      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6
 custom_padding_taskbar">
        {showGraph ? (
          <div className="oxy_chat_box"   >
            <Chart
              options={monthlyStatus}
              series={monthlyStatus.series}
              type="bar"
              width="100%"
              height={330}
            />
          </div>
        ) : null}
      </div>
      <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6
 custom_padding_taskbar">
        {showGraph ? (
          <div className="oxy_chat_box">
            <div className="oxy_chat_inner_text">
              <img src='/assets/img/pending.png' alt='icon' />
              <span>Approval Pending</span>
              <p>{approvalPending}</p>
            </div>
          </div>
        ) : null}
      </div>
      <LeaveAdminDetailsDrawer
                      isOpen={isDrawerOpen}
                      closeModal={() => setIsDrawerOpen(false)}
                      selectedFilter={searchfilter}
                      activeStatus={activeStatus}
                      handleClearFilter={handleClearFilter}
                  />
    </div>
  );
};

export default LeaveChart;
