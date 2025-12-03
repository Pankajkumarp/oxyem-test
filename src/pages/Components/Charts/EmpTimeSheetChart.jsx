import React, { useEffect, useState } from 'react';
import { axiosJWT } from '../../Auth/AddAuthorization';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function EmpTimeSheetChart() {
  const [timesheetList, setTimesheetList] = useState([]);
  const [monthlyEffort, setMonthlyEffort] = useState(null);
  const [annualStatus, setAnnualStatus] = useState(null);
  const [taskEffort, setTaskEffort] = useState(null);
  const [showMonthlyChart, setShowMonthlyChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const [response, responseChart] = await Promise.all([
          axiosJWT.get(`${apiUrl}/me/getDashboardDetails`, { params: { isFor: 'timesheet' } }),
          axiosJWT.get(`${apiUrl}/timesheet/getChart`, { params: { isFor: 'me', month: 'Apr', year: '2025' } })
        ]);

        const timesheetData = response.data.data || [];
        const chartData = responseChart.data.data || {};

        // Monthly Effort Pie Chart
        const monthlyLogged = chartData?.monthly?.data?.[0]?.data || 0;
        const monthlyTotal = chartData?.monthly?.data?.[1]?.data || 0;



        
        setShowMonthlyChart(monthlyLogged > 0);
        setMonthlyEffort({
          series: [monthlyTotal - monthlyLogged, monthlyLogged],
          options: {
            chart: { type: 'pie' },
            labels: ['Pending Effort', 'Total Effort Logged'],
            colors: ['#28a745', '#f77e3c'],
            legend: { position: 'bottom' },
            title: {
                text: "Monthly Effort Status",
                align: 'center', // Center the title
                margin: 20, // Space between the title and chart
                style: {
                  fontSize: '13px', // Font size
                  fontFamily: 'Helvetica Now MT Micro Regular', // Font family
                  fontWeight: '500', // Font weight
                  color: '#263238', // Font color
                },
              },
          }
        });

        // Annual Effort Bar Chart
        const annualSeries = chartData?.annual?.data?.map(item => ({
          name: item.name,
          data: item.data.map(val => parseFloat(val))
        })) || [];

        const annualCategories = chartData?.annual?.months || [];

        setAnnualStatus({
          series: annualSeries,
          options: {
            chart: { type: 'bar', height: 250, stacked: true },
            
            title: {
                text: "Annual Effort Chart - 2025",
                align: 'center', // Center the title
                margin: 20, // Space between the title and chart
                style: {
                  fontSize: '13px', // Font size
                  fontFamily: 'Helvetica Now MT Micro Regular', // Font family
                  fontWeight: '500', // Font weight
                  color: '#263238', // Font color
                },
              },
            colors: ['#156082', '#f77e3c'],
            xaxis: { categories: annualCategories },
            legend: { position: 'bottom' }
          }
        });

        // Task-based Pie Chart (Static)
        setTaskEffort({
          series: [0, 0, 0], // Update if dynamic data becomes available
          options: {
            chart: { type: 'pie' },
            labels: ['', '', ''],
            colors: ['#1e90ff', '#f77e3c', '#2ecc71'],
            legend: { position: 'bottom' },

            title: {
                text: "% Effort allocated on task",
                align: 'center', // Center the title
                margin: 20, // Space between the title and chart
                style: {
                  fontSize: '13px', // Font size
                  fontFamily: 'Helvetica Now MT Micro Regular', // Font family
                  fontWeight: '500', // Font weight
                  color: '#263238', // Font color
                },
              },
          }
        });

        setTimesheetList(timesheetData);
      } catch (error) {
        console.error('Failed to fetch timesheet chart data:', error);
      }
    };

    fetchData();
  }, []);

  
  return (
    <>
      {/* Task List */}
      {timesheetList.length > 0 && (
      <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_wid_noti mt-3">
              <h3 className="head_text">Open/Assigned Tasks</h3>
              {timesheetList.length > 0 ? (
            timesheetList.map((task, index) => (
              <div className="widget_noti" key={index}>
                <div className="row align-items-center">
                  <div className="col-12">
                    <div className="left-panel panel">
                      <div className="row">
                        <div className="col-md-8">
                          <span className="name">{task.taskName}</span>
                        </div>
                        <div className="col-md-4">
                          <span className={`status oxyem-mark-${task.status}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                      <div className="date">
                        {new Date(task.startDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}{" "}
                        to{" "}
                        {new Date(task.endDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Data not found.</div>
          )}
            </div>
      )}
      {/* Monthly Effort Chart */}
          {monthlyEffort && showMonthlyChart && (
      <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
        <div className="oxy_chat_box">
            <Chart
              options={monthlyEffort.options}
              series={monthlyEffort.series}
              type="pie"
              width="100%"
            />
        </div>
      </div>
          )}

      {/* Annual Effort Chart */}
      {annualStatus && (
      <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
        <div className="oxy_chat_box">
            <Chart
              options={annualStatus.options}
              series={annualStatus.series}
              type="bar"
              height={250}
            />
        </div>
      </div>
      )}

      {/* Task Effort Chart */}
          {taskEffort && (
      <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
        <div className="oxy_chat_box">
            <Chart
              options={taskEffort.options}
              series={taskEffort.series}
              type="pie"
              width="100%"
            />
        </div>
      </div>
          )}
    </>
  );
}
