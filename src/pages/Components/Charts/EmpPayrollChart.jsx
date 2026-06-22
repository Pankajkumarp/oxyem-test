import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const EmpPayrollChart = ({ empID }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [data, setSalaryStructue] = useState([]);
  // 📊 Chart state
  const [chartData, setChartData] = useState({
    categories: [],
    values: [],
  });

  const getCurrentFinancialYear = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    return month < 4 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
  };

  const fetchData = async (empId) => {
    try {
      const response = await axiosJWT.post(`${apiUrl}/payroll/taxProjection`, {
        idEmployee: empId,
        financialYear: getCurrentFinancialYear(),
      });

      if (response && response.data) {
        const resData = response.data.data;
          const header = resData?.header;
          if (header) {
            const categories = Object.keys(header);
            const values = Object.values(header).map((val) =>
              parseFloat(val.replace(/[₹,\s]/g, '') || '0')
            );
            setChartData({ categories, values });
          }
      }
    } catch (error) {
      console.error('Error fetching tax projection data:', error);
    }
  };

  const fetchtabledata = async (empID) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/payroll/getMyBoaHistory`, {
        params: {
          idEmployee: empID,
        },
      });

      if (response) {
        const salaryInfoe = response.data.data.salaryInfo;
        setSalaryStructue(salaryInfoe);
      }
    } catch (error) {
      console.error('Error fetching payroll table data:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (empID !== '') {
        await fetchtabledata(empID);
        fetchData(empID);
      }
    };
    initialize();
  }, [empID]);

  const renderFinalSection = (finalData) => {
    const keys = Object.keys(finalData);
    return (
      <div className="box final emp-dashboard-payroll-month-anual" id="boi-final-box" key="final">
        {keys.map((key, index) => (
          <div key={key}>
            <h3>{key.replace(/([A-Z])/g, ' $1')}</h3>
            <h2 className="total">
              <b>{finalData[key]}</b>
            </h2>
            {index < keys.length - 1 && <hr />}
          </div>
        ))}
      </div>
    );
  };

  // 📊 ApexChart config
  const barChartOptions = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        rotate: -45,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
      },
    },
    dataLabels: {
      enabled: true,
    },
    title: {
      text: 'TDS Current FY',
      align: 'center',
    },
    legend: {show: false}
  };

  const barChartSeries = [
    {
      name: 'Amount (₹)',
      data: chartData.values,
    },
  ];

  return (
      <>
      {data && data?.final && (
        <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
          <div className="oxy_chat_box">
            <div className="col-md-12 text-center">
              <div className="row ">
                  <div className="col-md-12 ">
                    {renderFinalSection(data.final)}
                  </div>
              </div>
            </div>
          </div>
        </div>
        )}
        {chartData.categories.length > 0 && (
        <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
          <div className="oxy_chat_box oxy_chat_box_stat oxy_chat_box_stat_project">
            <div className="row">
                <Chart options={barChartOptions} series={barChartSeries} type="bar" height={330} />
            </div>
          </div>
        </div>
        )}
      </>
    
  );
};
export default EmpPayrollChart;
