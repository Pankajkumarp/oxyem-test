import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { MdClose } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import moment from 'moment-timezone';
const customStyles = {
  content: {
    background: '#fff',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const getCurrentTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const convertUtcToLocalTime = (utcTime, timeZone) => {
  // Early return for invalid or empty time
  if (!utcTime || utcTime.trim() === "") return "";

  try {
    const today = moment.utc().format('YYYY-MM-DD');  // Get today's date in UTC
    const utcDateTime = `${today}T${utcTime}Z`;  // Combine date and time to form a full date-time string
    const localTime = moment.utc(utcDateTime).tz(timeZone).format('HH:mm:ss');  // Convert to local time

    if (localTime === "Invalid date") return ""; // Return empty string if the date is invalid
    return localTime;
  } catch (error) {
    return ""; // Return empty string in case of any error during conversion
  }
};

const convertUtcTodayName = (utcDateTime, timeZone) => {
  return moment(utcDateTime).tz(timeZone).format('dddd'); // Format to day name and time
};
const AttendanceDetail = ({ isOpen, closeModal, isHistroyId, section, handleUpadateClick }) => {
  const timeZone = getCurrentTimeZone();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [attendanceDetails, setAttendanceDetails] = useState([]);
  const formattedDate = () => {
    const date = new Date(attendanceDate);

    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };

    return date.toLocaleDateString('en-GB', options);
  };
  const [attendanceDate, setAttendanceDate] = useState([]);
  const [shiftDetail, setshiftDetail] = useState({});
  const [dayDetail, setdayDetail] = useState("");
  const [checkInTime, setcheckInTime] = useState("");
  const [checkOutTime, setcheckOutTime] = useState("");
  const [checkTotalTime, setcheckTotalTime] = useState("");
  const [getidAttendance, setGetidAttendance] = useState("");

  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/attendance`, {
        params: {
          idAttendance: id,
        },
      });
      if (response && response.data && response.data.data && response.data.data.details) {
        setAttendanceDetails(response.data.data.details);
        setAttendanceDate(response.data.data.CreatedDate)
        setGetidAttendance(response.data.data.idAttendance)
        setdayDetail(convertUtcTodayName(response.data.data.CreatedDate, timeZone))
        setshiftDetail(response.data.data.currentshiftDetail)
        setcheckInTime(response.data.data.checkin)
        setcheckOutTime(response.data.data.checkout)
        setcheckTotalTime(response.data.data.noOfhrs)
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAttendanceDetails(isHistroyId);
    }
  }, [isOpen, isHistroyId]);

  const handleupdate = () => {
    handleUpadateClick(getidAttendance);
};
  
  
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      style={customStyles}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body  oxyem-attendence-popup">
            <h6>{dayDetail}, {formattedDate()}
              <span className='top-inner-text'>{shiftDetail.shifName}
                <span className='top-inner-time'> [{shiftDetail.shiftTime}]</span>
              </span>
            </h6>
            {attendanceDetails.map((detail, index) => (
              <div key={index}>
                <div className="oxyem-attendence-popup-card">
                  <div className="card1">
                    <span className="main_text">
                      <FaRegClock />{' '}
                      <span className="inner_text">
                        {convertUtcToLocalTime(moment(detail.punchIn).format('HH:mm:ss'), timeZone)}
                      </span>{' '}
                    </span>
                    <span className="main_text main_text_2">
                      <MdOutlineLocationOn />{' '}
                      <span className="bottom_text">
                        {detail.punchInLocation || 'Not Added'}
                      </span>{' '}
                    </span>
                  </div>
                  <div className="card2">
                    <span className="line"></span>
                  </div>
                  <div className="card3">
                    <span className="main_text">
                      <FaRegClock />{' '}
                      <span className="inner_text">
                        {convertUtcToLocalTime(moment(detail.punchOut).format('HH:mm:ss'), timeZone)}
                      </span>{' '}
                    </span>
                    <span className="main_text main_text_2">
                      <MdOutlineLocationOn />{' '}
                      <span className="bottom_text">
                        {detail.punchOutLocation || ''}
                      </span>{' '}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {section === "adminAttendance" ? (
              <div className="text-start w-100 attendence_update_btn">
                <button type="submit" className={`btn btn-primary`} onClick={handleupdate}>
                  Update  Records
                </button>
              </div>
            ) : null}
            <div className="oxyem-attendence-popup-card oxyem-attendence-popup-card-bottom">
              <div className="card1">
                <span className="sideline"></span>
                <div>First Check-in</div>
                <div>{checkInTime}</div>
              </div>
              <div className="card2">
                <span className="sideline"></span>

                <div>Last Check-in</div>
                <div>{checkOutTime}</div>
              </div>
              <div className="card3">
                <span className="sideline"></span>
                <div>Total  Hrs</div>
                <div>{checkTotalTime}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default AttendanceDetail;
