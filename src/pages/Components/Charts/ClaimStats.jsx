/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
const ClaimStats = ({ activeTab }) => {
    const [isChartOpen, setIsChartOpen] = useState(false);
  
    const [claimSummary, setClaimSummary] = useState({});
   
  const [selectedEmployee, setSelectedEmployee] = useState(null);


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

    const claimSummaryData = response.data.data.claimSummary;
    setClaimSummary(claimSummaryData || {});
    setIsChartOpen(true);

  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

useEffect(() => {
  if (activeTab === "Employees" || activeTab === "All") {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChartData(); 
  if (!selectedEmployee) {
  // Clear graphs only
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
