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
          },
        });
      } catch (error) {
        // console.error('Error fetching annual leave data:', error);
      }
    };

    fetchData();
  }, []);

  const [ischartopen, setIsChartOpen] = useState(false);
    const [anualChartData, setAnualChartData] = useState();
    const [monthlyTrendData, setMonthlyTrend] = useState();
    const [monthlyData, setMonthlyData] = useState();
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    const currentYear = new Date().getFullYear().toString();
    const optionsyear = [];
    for (let year = 2000; year <= currentYear; year++) {
        optionsyear.push({ value: year.toString(), label: year.toString() });
    }

    const [setMouth, setMonthValue] = useState(currentMonth); // State to manage active tab index
    const [setYear, setYearValue] = useState(currentYear);
  useEffect(() => {
          // if (setMouth && setYear) {
              if (setMouth && setYear ) {
              const getgraphData = async () => {
                  const apipayload = {
                      "month": setMouth,
                      "year": setYear
                  }
                  try {
                      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                      const response = await axiosJWT.get(`${apiUrl}/graphstats`, 
                          { params: { "month": setMouth, "year": setYear, "isFor":"self"} 
                      });
                      // Handle the response if needed
                      if (response) {
                          const yearchart = response.data.data.annual
                          const monthchart = response.data.data.month
                          const monthlytrendchart = response.data.data.monthlyTrend
  
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
                          setMonthlyTrend(
                              {
                                  series: [{
                                      name: "Total Attendance",
                                      data: monthlytrendchart.data
                                  }],
                                  options: {
                                      chart: {
                                          height: 350,
                                          type: 'line',
                                          zoom: {
                                              enabled: false
                                          }
                                      },
                                      dataLabels: {
                                          enabled: false
                                      },
                                      stroke: {
                      width: 1,
                                          curve: 'straight',
                                          colors: ['#156082']  // Specify the line color you want here
                                      },
                                      markers: {
                                          colors: '#156082'  // Specify the hover pointer color here
                                      },
                                      title: {
                                          text: '',
                                          align: 'left'
                                      },
                                      grid: {
                                          row: {
                                              colors: ['#f3f3f3', 'transparent'],
                                              opacity: 0.5
                                          },
                                      },
                                      xaxis: {
                                          categories: monthlytrendchart.days
                                      }
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

  const annualAttend = {
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
      text: "Annual Attendance Record 2024",
      align: 'center', // Center the title
      margin: 20, // Space between the title and chart
      style: {
        fontSize: '13px', // Font size
        fontFamily: 'Helvetica Now MT Micro Regular', // Font family
        fontWeight: '500', // Font weight
        color: '#263238', // Font color
      },
    },
    series: [
      {
        name: 'Persent',
        data: [14, 22, 16, 18, 21, 23, 17, 18],
      },
      {
        name: 'Absent',
        data: [1, 2, 1, 0, 0, 3, 0, 2],
      }
    ],
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], // X-axis categories
    },

    colors: ['#156082', '#f77837'],
    legend: {
      position: 'bottom', // This will set the default legend position
    },
    fill: {
      opacity: 1,
    },
  };

  const monthlyStatus = {
    series: [100, 3, 20],
    chart: {
      type: 'donut',
      width: 600, // Set the desired width
      height: 400 // Set the desired height
    },
    title: {
      text: "Monthly Status",
      align: 'center', // Center the title
      margin: 20, // Space between the title and chart
      style: {
        fontSize: '13px', // Font size
        fontFamily: 'Helvetica Now MT Micro Regular', // Font family
        fontWeight: '500', // Font weight
        color: '#263238', // Font color
      },
    },
    labels: ['Present', 'Not available', 'Absent'],
    colors: ['#156082', '#fcb040', '#ed6a58'],
    responsive: [

      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250, // Width for smaller screens
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    legend: {
      position: 'bottom', // This will set the default legend position
    },
  };

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
              height={300}
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
            height={250}
          />
        </div>
      </div>
      )}
        {ischartopen && anualChartData?.options && anualChartData?.series && (
      <div className="col-lg-4 col-md-6 col-sm-6 custom_padding_taskbar">
        <div className="oxy_chat_box"   >
          <Chart options={anualChartData?.options} series={anualChartData?.series} type="bar" height={250} /> 
        </div>
      </div>
      )}
        {ischartopen && monthlyData?.options && monthlyData?.series && (
          <div className="col-lg-2 col-md-6 col-sm-6 custom_padding_taskbar">
            <div className="oxy_chat_box">
              <Chart options={monthlyData?.options} series={monthlyData?.series} type="pie" width={250} height={250} />
            </div>
          </div>
        )}
      </>
  );
};

export default EmpLeaveChart;