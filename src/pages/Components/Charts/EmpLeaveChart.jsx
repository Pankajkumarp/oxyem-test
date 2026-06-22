import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const EmpLeaveChart = () => {


  const [annualChartData, setAnnualChartData] = useState(null);
  const [annualStatus, setAnnualStatus] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.post(`${apiUrl}/leave/getLeaveChart`, {
          isFor: 'self',
          month: 'Apr',
          year: '2025',
        });



        const { anual , anualTrend } = response.data.data;

        setAnnualChartData({
          series: anual.data,
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
              },
            },
            colors: ['#156082', '#e97132', '#196b24'],
            dataLabels: {
              enabled: true,
            },
            xaxis: {
              categories: anual.categories,
            },
            tooltip: {
              y: {
                formatter: (val) => `${val} Days`,
              },
            },
            title: {
              text: "Leave Status",
              align: 'center', // Center the title
              margin: 20, // Space between the title and chart
              style: {
                fontSize: '13px', // Font size
                fontFamily: 'Helvetica Now MT Micro Regular', // Font family
                fontWeight: '500', // Font weight
                color: '#263238', // Font color
              },
            },
          },
          
        });

        setAnnualStatus({
          series: [{
            name: 'Leaves',
            data: anualTrend.data
          }],
          options: {
            chart: {
              type: 'bar',
              height: 350,
              stacked: true,
            },
            title: {
              text: "Annual Leave Trend 2025",
              align: 'center',
              margin: 20,
              style: {
                fontSize: '13px',
                fontFamily: 'Helvetica Now MT Micro Regular',
                fontWeight: '500',
                color: '#263238',
              },
            },
            colors: ['#156082'],
            xaxis: {
              categories: anualTrend.categories,
            },
            legend: {show: false}
          },
        });
      } catch (error) {
         console.error('Error fetching annual leave data:', error);
      }
    };

    fetchData();
  }, []);

  const [ischartopen, setIsChartOpen] = useState(false);
    const [anualChartData, setAnualChartData] = useState();
    const [monthlyData, setMonthlyData] = useState();
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    const currentYear = new Date().getFullYear().toString();
    const optionsyear = [];
    for (let year = 2000; year <= currentYear; year++) {
        optionsyear.push({ value: year.toString(), label: year.toString() });
    }

    const setMouth = currentMonth; // State to manage active tab index
    const setYear = currentYear;
  useEffect(() => {
          // if (setMouth && setYear) {
              if (setMouth && setYear ) {
              const getgraphData = async () => {
                  try {
                      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                      const response = await axiosJWT.get(`${apiUrl}/graphstats`, 
                          { params: { "month": setMouth, "year": setYear, "isFor":"self"} 
                      });
                      // Handle the response if needed
                      if (response) {
                          const yearchart = response.data.data.annual
                          const monthchart = response.data.data.month
  
                          setMonthlyData(
                              {
                                  series: monthchart.data,
                                  options: {
                                      chart: {
                                          width: 450,
                                          type: 'pie',
                                      },
                                      labels: monthchart.label,
                                      colors: ['#26AF48', '#2196F3', '#FA7E12'],
                                      title: {
                                        text: "Monthly Attendance",
                                        align: 'center', // Center the title
                                        margin: 20, // Space between the title and chart
                                        style: {
                                          fontSize: '13px', // Font size
                                          fontFamily: 'Helvetica Now MT Micro Regular', // Font family
                                          fontWeight: '500', // Font weight
                                          color: '#263238', // Font color
                                        },
                                      },
                                      legend: {
                                          position: 'bottom', // This line positions the legend at the bottom
                                      },
                                      responsive: [{
                                          breakpoint: 480,
                                          options: {
                                              chart: {
                                                  width: 200,
                                              },
                                              legend: {
                                                  position: 'bottom', // Ensure it's also set for smaller screens
                                              },
                                          },
                                      }],
                                  },
                              }
                          )

                          setAnualChartData(
                              {
                                  series: yearchart.data,
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
                                        text: "Annual Attendance Record 2025",
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
                                          categories: yearchart.months,
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
                                                  return "" + val + " Days";
                                              },
                                          },
                                      },
                                  },
                              }
                          )
                          setIsChartOpen(true)
                      }
  
                  } catch (error) {
                      // Handle the error if any
                      console.error("Error occurred:", error);
                  }
  
              };
              getgraphData();
          }
      }, [setMouth, setYear]);


  return (
    <>
      {annualChartData && annualChartData?.options && annualChartData?.series && (
    <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
          <div className="oxy_chat_box">
            <Chart
              options={annualChartData.options}
              series={annualChartData.series}
              type="bar"
              width="100%"
              height={330}
            />
          </div>
    </div>
      )}
      {annualStatus?.series && annualStatus?.options && annualStatus?.series && (
      <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
        <div className="oxy_chat_box">
          <Chart
            options={annualStatus.options}
            series={annualStatus.series}
            type="bar"
            width="100%"
            height={330}
          />
        </div>
      </div>
      )}
        {ischartopen && anualChartData?.options && anualChartData?.series && (
      <div className="col-lg-4 col-md-6 col-sm-6 custom_padding_taskbar">
        <div className="oxy_chat_box"   >
          <Chart options={anualChartData?.options} series={anualChartData?.series} type="bar" height={330} /> 
        </div>
      </div>
      )}
        {ischartopen && monthlyData?.options && monthlyData?.series && (
          <div className="col-lg-2 col-md-6 col-sm-6 custom_padding_taskbar">
            <div className="oxy_chat_box">
              <Chart options={monthlyData?.options} series={monthlyData?.series} type="pie" height={330} />
            </div>
          </div>
        )}
      </>
  );
};

export default EmpLeaveChart;