import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaRegClock, FaTimes } from "react-icons/fa";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { FaRegCheckCircle } from "react-icons/fa";
export default function Navbar({ pagename }) {

  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  const [realTimeToday, setRealTimeToday] = useState("00:00:00");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [punchmode, setPunchmode] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [timeDate, setTimeDate] = useState('');
  const [idsent, setIdSent] = useState("");
  const [Isaddress, setAddress] = useState();
  const [idShift, setidShift] = useState("");
  const [isCheckIn, setIsCheckIn] = useState(true);
  const [profileInfo, setProfileInfo] = useState({});
  const [attendanceTimeInfo, setAttendanceTimeInfo] = useState({});

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    setIsClient(true);
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      const currentTime = new Date();
      setTimeDate(formatDateTime(currentTime));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fetchData = async () => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/attendancedata`);
      if (response) {
        setPunchmode(response.data.data.latestAttendance.mode || "");
        setIdSent(response.data.data.latestAttendance.idAttendance || "");
        setidShift(response.data.data.shiftDetails.idShift || "")
        setProfileInfo(response.data.data.profileInfo || {});
        setAttendanceTimeInfo(response.data.data.attendanceList || {});

        const realTimeToday = response.data.data.attendanceList?.realTimeToday; // Assuming this is in "HH:MM:SS"
        const [hours, minutes, seconds] = realTimeToday.split(":").map(Number);

        // Convert time to total seconds
        setTotalSeconds(hours * 3600 + minutes * 60 + seconds);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlesubmitclickA = async (combineAddress) => {
    const apipayload = {
      "idAttendance": idsent,
      "mode": punchmode ? "punchout" : "punchin",
      "punchtime": timeDate,
      "location": combineAddress,
      "shiftType": idShift,
      "idEmployee": ""
    }
    const message = !punchmode
      ? 'You have successfully <strong>checked in</strong> your attendance!'
      : punchmode === 'punchin'
        ? 'You have successfully <strong>checked out</strong> your attendance!'
        : 'Attendance submitted successfully!';
    const errormessage = 'Error connecting to the backend. Please try after Sometime.';
    try {
      const response = await axiosJWT.post(`${apiUrl}/attendance`, apipayload);
      if (response) {
        toast.success(({ id }) => (
          <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
            <FaRegCheckCircle style={{
                            fontSize: '35px',
                            marginRight: '10px',
                            color: '#4caf50'
                        }} />
            <span dangerouslySetInnerHTML={{ __html: message }}></span>
            <button
              onClick={() => toast.dismiss(id)}
              style={{
                background: 'none',
                  border: 'none',
                  color: '#4caf50',
                  marginLeft: 'auto',
                  cursor: 'pointer',
                  fontSize: '20px',
              }}
            >
              <FaTimes />
            </button>
          </div>
        ), {
          icon: null,
          duration: 7000,
          style: {
            border: '1px solid #4caf50',
            padding: '8px',
            color: '#4caf50',
          },
        });

        setIsCheckIn(false);
        fetchData();
      }
    } catch (error) {
      toast.success(({ id }) => (
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
          <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
          <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
          <button
            onClick={() => toast.dismiss(id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF000F',
              marginLeft: 'auto',
              cursor: 'pointer'
            }}
          >
            <FaTimes />
          </button>
        </div>
      ), {
        icon: null,
        duration: 7000,
        style: {
          border: '1px solid #FF000F',
          padding: '8px',
          color: '#FF000F',
        },
      });
      console.error("Error occurred:", error);
    }
  };

  const handlesubmitAttedence = async () => {
    try {
      const response = await axios.post('/api/location');
      const city = response.data.city;
      const state = response.data.state;
      const country = response.data.country;
      setAddress(`${city}, ${state}, ${country}`);
      const combineAddress = `${city}, ${state}, ${country}`;
      if (response) {
        handlesubmitclickA(combineAddress);
      }
    } catch (error) {
      console.error("Error fetching location", error);
    }
  };

  useEffect(() => {
    // Only run this interval if pagename is "me"
    if (pagename === "me") {
      const interval = setInterval(() => {
        setTotalSeconds(prev => prev + 1); // Increment total seconds by 1 every second
      }, 1000);

      return () => clearInterval(interval); // Clean up the interval on component unmount
    }
  }, [pagename]);

  useEffect(() => {
    // Convert total seconds back to HH:MM:SS format
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setRealTimeToday(
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    );
  }, [totalSeconds]); 

  return (
    <>
      {pagename === "me" ? (
        <>
          <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
            <div className="pr_card">
              <div className="pr_card_top">
                <img src={profileInfo.profilePicPath ? profileInfo.profilePicPath : "https://www.w3schools.com/howto/img_avatar.png"} alt="Profile Picture" />
                <div className="emp_profile_text">
                  <h2 className='user_name_m'>{profileInfo.employeeName}</h2>
                  <p className='user_desi_m'>{profileInfo.roleName}</p>
                </div>
              </div>
              <div className='emp_dash_bottom_box'>
                <div className="time">
                <p>{attendanceTimeInfo.showLiveTimer ? realTimeToday : attendanceTimeInfo.realTimeToday}</p>
                </div>
                {/* <div className="time">
                  {isClient && currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div> */}
                <p className="time_b ">
                  <span className='checked-in-at'>{attendanceTimeInfo?.firstPunchIn ? "Checked in at" :"Not Checkin yet" } </span>
                  {attendanceTimeInfo?.firstPunchIn &&
                    new Date(`${new Date().toISOString().split('T')[0]}T${attendanceTimeInfo.firstPunchIn}Z`)
                      .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
                  }
                  <span className='checked-in-at'>{attendanceTimeInfo?.firstPunchIn ? " till" :attendanceTimeInfo?.lastPunchOut ? "":"" } </span>
                  {attendanceTimeInfo?.lastPunchOut &&
                    new Date(`${new Date().toISOString().split('T')[0]}T${attendanceTimeInfo.lastPunchOut}Z`)
                      .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
                  }
                  <span className='checked-in-at'>{attendanceTimeInfo?.firstPunchIn && attendanceTimeInfo?.lastPunchOut === '' && attendanceTimeInfo?.showLiveTimer ? "now" :"" } </span>
                </p>

                <div className='mt-3'>
                  {punchmode === "" ? (
                    <div className='attendence-button attendence-checkin' onClick={handlesubmitAttedence}>
                      <button className='btn btn-primary'>Check IN</button>
                    </div>
                  ) : (
                    <div className='attendence-button attendence-checkout' onClick={handlesubmitAttedence}>
                      <button className='btn btn-primary'>Check Out</button>
                    </div>
                  )}
                </div>

                <div className="container mt-3 attendance-time-profile">
                  <div className="row text-center">
                    <div className="col-md-4">
                      <div className="label">Today</div>
                    </div>
                    <div className="col-md-4">
                      <div className="label">This Week</div>
                    </div>
                    <div className="col-md-4">
                      <div className="label">This Month</div>
                    </div>
                  </div>

                  <div className="row text-center mt-2">
                    <div className="col-md-4">
                      <div className="time">{attendanceTimeInfo?.today}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="time">{attendanceTimeInfo?.thisWeek}</div>
                    </div>
                    <div className="col-md-4">
                      <div className="time">{attendanceTimeInfo?.thisMonth}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='header_attendance_modu'>
            {punchmode === "" ? (
              <div className='attendence-button attendence-checkin' onClick={handlesubmitAttedence}>
                <span>Check IN</span>
                {isClient && (
                  <span className='inner_time_section'>
                    <span className='inner_time_text1'>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    <span className='inner_time_text2'>{formatDate(currentTime)}</span>
                  </span>
                )}
                <span className='oxyem-background-bg'><FaRegClock /></span>
              </div>
            ) : (
              <div className='attendence-button attendence-checkout' onClick={handlesubmitAttedence}>
                <span>Check OUT</span>
                {isClient && (
                  <span className='inner_time_section'>
                    <span className='inner_time_text1'>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    <span className='inner_time_text2'>{formatDate(currentTime)}</span>
                  </span>
                )}
                <span className='oxyem-background-bg'><FaRegClock /></span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
