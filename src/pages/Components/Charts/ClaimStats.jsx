import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import SelectComponent from '../common/SelectOption/SelectComponent.jsx';
import claimSummary from '../../Components/Charts/EmpClaimChart.jsx';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const ClaimStats = ({ activeTab }) => {
  const [showStat, setShowStat] = useState(false);
  const [statData, setStatData] = useState(false);
    const [isChartOpen, setIsChartOpen] = useState(false);
  
    const [claimSummary, setClaimSummary] = useState({});
   
  const fetchClientData = async (value) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDashboardDetails`, {
        params: { isFor: value },
      });
      if (response) {
        const dataCome = response.data.data
        setStatData(dataCome)
        setShowStat(true)
      }
    } catch (error) {

    }
  };



  // const [setEmployee, setEmployeeValue] = useState(""); // State to manage active tab index
  // const onChangeclaim = (value) => {
  //   console.log(value)
  //   if (value !== null) {
  //     setEmployeeValue(value.value); // Update active tab index when a tab is clicked
  //   } else {
  //     setEmployeeValue();
  //   }
  // };
  const [setEmployeeadd, setEmployeeValueadd] = useState("");
  const onChangeadd = (value) => {
    console.log(value)
    if (value !== null) {
      setEmployeeValueadd(value.value); // Update active tab index when a tab is clicked
    } else {
      setEmployeeValueadd();
    }
  };
  useEffect(() => {
    if (activeTab === "Employees" || activeTab === "All") {
      fetchClientData("attendanceVsTimesheet");
    }
  }, [activeTab]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  console.log("this is s selected empl",selectedEmployee)
  console.log("this is empl",employeeList)

  const onEmployeeChange = (value) => {
  if (value) {
    setSelectedEmployee(value.value);
  } else {
    setSelectedEmployee(null);
  }
};

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/employees/employeesList`, { params: { "isFor": name } });
        if (response) {
          const optionsData = response.data.data.map((item) => ({
            label: item.employeeName,
            value: item.idEmployee,
            image: item.profilePicPath ? item.profilePicPath : "",
            profileLink: item.profileLink ? item.profileLink : "",
            designation: item.designation ? item.designation : "",
          }));
          setEmployeeList(optionsData);
          if (optionsData.length > 0) {
            // setEmployeeValue(optionsData[-1].value); 
            // setEmployeeValueadd(optionsData[0].value); // Set the first item
             setSelectedEmployee(null);
          }
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);
  const [showMonthGraph, setShowMounthGraph] = useState(false);
  const [mounthData, setMounthData] = useState("");
  const fetchMounthData = async (value) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDashboardDetails`, {
        params: { isFor: value, idEmployee: selectedEmployee },
      });
      if (response) {
        const dataCome = response.data.data
        setMounthData(
          {
            series: dataCome.series,
            title: {
              text: "Monthly: Attendance vs Timesheet Effort comparison",
              align: 'center',
              margin: 20,
              style: {
                fontSize: '13px',
                fontFamily: 'Helvetica Now MT Micro Regular',
                fontWeight: '500',
                color: '#263238',
              },
            },

            chart: {
              height: 350,
              type: 'line',
              toolbar: {
                show: true,
              },
              zoom: {
                enabled: false,
              },
            },
            colors: ['#156082', '#f77837'],
            options: {
              chart: {
                height: 350,
                type: 'line',
              },
              colors: ['#77B6EA', '#545454'],
              dataLabels: {
                enabled: true,
              },
              stroke: {
                curve: 'smooth'
              },

              grid: {
                borderColor: '#e7e7e7',
                row: {
                  colors: ['#f3f3f3', 'transparent'],
                  opacity: 0.5
                },
              },
              markers: {
                size: 1
              },

            },
            xaxis: {
              categories: dataCome.categories, 
            },
          }
        )
        setShowMounthGraph(true)
      }
    } catch (error) {

    }
  };


//         const fetchChartData = async () => {
//             try {
//                 const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//                 const response = await axiosJWT.get(`${apiUrl}/claims/graphStats`, {
//                     params: { isFor: 'admin', showAll: 'all', idEmployee: selectedEmployee }
//                 });

//                 // console.log(response,"this si sactual responce from api")
//                 // const claimSummaryData = response.data.data.claimSummary;
//                 // setClaimSummary(claimSummaryData);
//                 // setIsChartOpen(true);
//                 // console.log(claimSummary)
//                 const claimSummaryData = response.data.data.claimSummary;
// let finalClaimSummary = claimSummaryData;

// // fallback if API didn’t send claimSummary
// if (!finalClaimSummary || Object.keys(finalClaimSummary).length === 0) {
//   const allClaims = response.data.data.allClaims;
//   if (allClaims && allClaims.label && allClaims.data) {
//     finalClaimSummary = allClaims.label.reduce((acc, label, idx) => {
//       acc[label] = allClaims.data[idx];
//       return acc;
//     }, {});
//   }
// }

// setClaimSummary(finalClaimSummary);
// setIsChartOpen(true);


//             } catch (error) {
//                 console.error('Error fetching chart data:', error);
//             }
//         };

const fetchChartData = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // 🧠 Build params dynamically
    const params = {
      isFor: 'admin',
      showAll: 'all',
    };

    // Only add idEmployee if selected
    if (selectedEmployee) {
      params.idEmployee = selectedEmployee;
    }

    const response = await axiosJWT.get(`${apiUrl}/claims/graphStats`, { params });

    console.log("✅ API Response:", response.data);

    const claimSummaryData = response.data.data.claimSummary;
    setClaimSummary(claimSummaryData || {});
    setIsChartOpen(true);
    console.log("🎯 claimSummary set to:", claimSummaryData);

  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

  const [showYearGraph, setShowYearGraph] = useState(false);
  const [yearData, setYearData] = useState("");
  const fetchYearData = async (value) => {
    //alert("123");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDashboardDetails`, {
        params: { isFor: value, idEmployee: selectedEmployee },
      });
      if (response) {
        const dataCome = response.data.data
        setYearData(
          {
            series: dataCome.series,
            title: {
              text: "Attendance vs Timesheet Effort comparison-Annual",
              align: 'center',
              margin: 20,
              style: {
                fontSize: '13px',
                fontFamily: 'Helvetica Now MT Micro Regular',
                fontWeight: '500',
                color: '#263238',
              },
            },

            chart: {
              height: 350,
              type: 'line',
              toolbar: {
                show: true,
              },
              zoom: {
                enabled: false,
              },
            },
            colors: ['#156082', '#f77837'],
            options: {
              chart: {
                height: 350,
                type: 'line',
              },
              colors: ['#77B6EA', '#545454'],
              dataLabels: {
                enabled: true,
              },
              stroke: {
                curve: 'smooth'
              },

              grid: {
                borderColor: '#e7e7e7',
                row: {
                  colors: ['#f3f3f3', 'transparent'],
                  opacity: 0.5
                },
              },
              markers: {
                size: 1
              },

            },
            xaxis: {
              categories: dataCome.categories, 
            },
          }
        )
        setShowYearGraph(true)
      }
    } catch (error) {

    }
  };
useEffect(() => {
  if (activeTab === "Employees" || activeTab === "All") {
    fetchChartData(); // always
  console.log(claimSummary,"this is")
  if (!selectedEmployee) {
  // Clear graphs only
  setShowYearGraph(false);
  setShowMounthGraph(false);
  // setShowStat(false);
}


    if (selectedEmployee) {
      fetchMounthData("attendanceVsTimesheetMonthly");
      fetchYearData("attendanceVsTimesheetYearly");
    }
  }
}, [activeTab, selectedEmployee]);

//employeeList.find(opt => opt.value === selectedEmployee)            claimSummary &&

  return (
    <div className='row'>  


  <>
   
            {isChartOpen && (
                <>
                

                    
  { Object.keys(claimSummary).length > 0 && (
    <div className="oxyem-top-box-design design-only-attendence attendence-top-data-main leave-top-data-main px-0 mt-0 row stats-grid">

      {/* Accommodation */}
      <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
        <div className="stats-info stats-info-cus">
          <img src='/assets/img/proposal-icon.png' />
          <div className='ox-colored-box-1 amountText'>
            <h4 className='all_attendence '>
              {claimSummary.Accommodation}
            </h4>
          </div>
          <div className='ox-box-text'><h6>Accommodation</h6></div>
        </div>
      </div>

      {/* Internet Expense */}
      <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
        <div className="stats-info stats-info-cus">
          <img src='/assets/img/reservation-icon.png' />
          <div className='ox-colored-box-2 amountText'>
            <h4 className='month_attendence '>
               {claimSummary["Internet Expense"]}
            </h4>
          </div>
          <div className='ox-box-text'><h6>Internet Expense</h6></div>
        </div>
      </div>



      {/* Travel */}
      <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
        <div className="stats-info stats-info-cus">
          <img src='/assets/img/money-icon.png' />
          <div className='ox-colored-box-4 amountText'>
            <h4 className='week_attendence'>
              {claimSummary.Travel}
            </h4>
          </div>
          <div className='ox-box-text'><h6>Travel</h6></div>
        </div>
      </div>

      {/* Others */}
      <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
        <div className="stats-info stats-info-cus">
          <img src='/assets/img/booking-cancel-icon.png' />
          <div className='ox-colored-box-3 amountText'>
            <h4 className='notsubmit_attendence '>
              {claimSummary.Others}
            </h4>
          </div>
          <div className='ox-box-text'><h6>Others</h6></div>
        </div>
      </div>
    </div>
  )}


                </>
            )}
       
        </>
  


                    
    </div>
  );
};

export default ClaimStats;
