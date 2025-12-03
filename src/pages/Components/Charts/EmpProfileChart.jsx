import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import EmpRewards from './EmpRewards';
import CheckinCheckout from '../Attendance/CheckinCheckout';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const EmpProfileChart = () => {
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [upcomingLeave, setUpcomingLeave] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
              const response = await axiosJWT.get(`${apiUrl}/me/getDashboardDetails`, { params: { isFor: 'holidays' } });

              const response2 = await axiosJWT.get(`${apiUrl}/me/getDashboardDetails`, { params: { isFor: 'leave' } });
              const responsedata = response.data.data;
              setUpcomingLeave(response2.data.data || []);
              setUpcomingHolidays(responsedata || []);
          } catch (error) {
              // console.log(error);
          }
      };
      fetchData();
  }, []);


  return (
    <>
      <CheckinCheckout pagename={'me'}/>
      {upcomingHolidays?.length > 0 && (
      <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
        <div className="oxy_chat_box"   >
          <div className='row'>
          <div className="col-12 col-md-12 custom_padding_wid_noti mt-3">
            <h3 className="head_text">Upcoming Holiday</h3>
            {upcomingHolidays?.length > 0 ? (
                    upcomingHolidays.map((holiday, index) => (
                <div className={`widget_noti widget_noti_${''}`} key={index}>
                  <div className='row align-items-center'>
                    <div className="col-12">
                      <div className="right-panel_w_r">
                        <div className="right-panel_w">
                          {/* <img src={notification.imgSrc} alt={notification.altText} /> */}
                        </div>
                        <div className="left-panel panel">
                          <div className="city">
                            {holiday.holidayName}
                          </div>
                          <div className="date">
                          {new Date(holiday.holidayDate).toDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                ))
              ) : (
                <></>
            )}
            </div>
 
          </div>
        </div>
      </div>
      )}

{upcomingLeave.length > 0 && (
      <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
        <div className="oxy_chat_box"   >
          <div className='row'>

            <div className="col-12 col-md-12 custom_padding_wid_noti mt-3">
              <h3 className="head_text">Upcoming Leave</h3>
                {upcomingLeave.length > 0 ? (
                  upcomingLeave.map((leave, index) => (
                <div className={`widget_noti widget_noti_${''}`} key={index}>
                  <div className='row align-items-center'>
                    <div className="col-12">
                      <div className="right-panel_w_r">
                        <div className="right-panel_w">
                          {/* <img src={notification.imgSrc} alt={notification.altText} /> */}
                        </div>
                        <div className="left-panel panel">
                          <div className="city">
                            {leave.leaveTypeDesc}
                          </div>
                          <div className="date">
                            {leave.fromDate1} to {leave.toDate1} 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
               ))
              ) : (
                <>No upcoming leaves</>
            )}
            </div>
          </div>
        </div>
      </div>
)}
      <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
        <div className="oxy_chat_box"   >
          <div className='row'>            
          <EmpRewards upcomingLeave={upcomingLeave}/>  
          </div>
        </div>
      </div>
      </>
  );
};

export default EmpProfileChart;
