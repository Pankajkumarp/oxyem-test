import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const ProjectChart = ({ activeTab }) => {
  const [totalClient, setTotalClient] = useState("");
  const [totalProject, setTotalProject] = useState("");
  const [projectStat, setProjectStat] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const fetchClientData = async (value) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDashboardDetails`, {
        params: { isFor: value },
      });
      if (response) {
        const dataCome = response.data.data
        setTotalClient(
          {
            series: dataCome.totalClient.series,
            chart: {
              type: 'donut',
              width: 600,
              height: 400
            },
            title: {
              text: "Total Client",
              align: 'center',
              margin: 20,
              style: {
                fontSize: '13px',
                fontFamily: 'Helvetica Now MT Micro Regular',
                fontWeight: '500',
                color: '#263238',
              },
            },
            labels: dataCome.totalClient.labels,
            colors: ['#156082', '#e97132', '#37997b'],
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
        );
        setTotalProject(
          {
              series: dataCome.project.series,
              options: {
                  chart: {
                      width: 380,
                      type: 'pie',
                  },
                  responsive: [{
                      breakpoint: 480,
                      options: {
                          chart: {
                              width: 200
                          },
                          legend: {
                              position: 'bottom'
                          }
                      }
                  }]
              },
              title: {
                  text: "Total Project",
                  align: 'center',
                  margin: 20,
                  style: {
                      fontSize: '13px',
                      fontFamily: 'Helvetica Now MT Micro Regular',
                      fontWeight: '500',
                      color: '#263238',
                  },
              },
              colors: ['#156082', '#e97132', '#37997b'],
              labels: dataCome.project.labels,
              legend: {
                  position: 'bottom',
              },
              fill: {
                  opacity: 1,
              },
          }
      )
      setProjectStat(
        {
          series: dataCome.dealsStatistics.series,
          options: {
              chart: {
                  width: 380,
                  type: 'pie',
              },
              responsive: [{
                  breakpoint: 480,
                  options: {
                      chart: {
                          width: 200
                      },
                      legend: {
                          position: 'bottom'
                      }
                  }
              }]
          },
          title: {
              text: "Project Statistics",
              align: 'center',
              margin: 20,
              style: {
                  fontSize: '13px',
                  fontFamily: 'Helvetica Now MT Micro Regular',
                  fontWeight: '500',
                  color: '#263238',
              },
          },
          colors: ['#156082', '#e97132', '#37997b', '#65997b'],
          labels: dataCome.dealsStatistics.labels,
          legend: {
              position: 'bottom',
          },
          fill: {
              opacity: 1,
          },
      }
      )
        setShowGraph(true)

      }
    } catch (error) {

    }
  };
  useEffect(() => {
    if (activeTab === "Projects") {
      fetchClientData("projects");
    }
  }, [activeTab]);
  return (
    <div className='row mb-3'>
      <div className="col-12 col-md-4 custom_padding_taskbar">
        {showGraph ? (
          <div className="oxy_chat_box">
            <Chart
              options={totalClient}
              series={totalClient.series}
              type="donut"
              width="100%"
              height={330}
            />
          </div>
        ) : null}
      </div>
      <div className="col-12 col-md-4 custom_padding_taskbar">
        {showGraph ? (
          <div className="oxy_chat_box"   >
            <Chart
              options={totalProject}
              series={totalProject.series}
              type="pie"
              width="100%"
              height={330}
            />
          </div>
        ) : null}
      </div>
      <div className="col-12 col-md-4 custom_padding_taskbar">
        {showGraph ? (
          <div className="oxy_chat_box"   >
           <Chart
              options={projectStat}
              series={projectStat.series}
              type="pie"
              width="100%"
              height={330}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectChart;
