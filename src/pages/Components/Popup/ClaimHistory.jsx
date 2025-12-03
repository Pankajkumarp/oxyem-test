import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { MdClose } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import moment from 'moment-timezone';
import Drawer from 'react-modern-drawer'
import HistoryComponent from '../../Components/Claim/claimhistory';

//import styles 👇
import 'react-modern-drawer/dist/index.css'
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
const AttendenceHistroy = ({ isOpen, closeModal, isHistroyId, section, handleUpadateClick ,datafor }) => {
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
  const [actionDetails, setClaimDetails] = useState([]);
  
  const getClaimDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/claims/claimDetails`, {
        params: {
          idClaim: id,
        },
      });
      if (response && response.data && response.data.data && response.data.data.actionDetails) {
        setClaimDetails(response.data.data.actionDetails);
      
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    if (isOpen) {
      getClaimDetails(isHistroyId);
    }
  }, [isOpen, isHistroyId]);

  const handleupdate = () => {
    handleUpadateClick(getidAttendance);
};
  
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getStatusText = (status) => {
  return status === 'RequiredAddInfo' ? 'Required Additional Information' : capitalizeFirstLetter(status);
};

// Sorting the actionDetails array by actionOn in descending order
const sortedActionDetails = actionDetails ? [...actionDetails].sort((a, b) => new Date(b.actionOn) - new Date(a.actionOn)) : [];

  
  return (
    <Drawer
    open={isOpen}
    onClose={closeModal}
    direction='right'
    className='custom-drawer'
    overlayClassName='custom-overlay' // Apply the custom overlay class
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
            <h6>
              <span className='top-inner-text'>{'Claim History'}
                <span className='top-inner-time'></span>
              </span>
            </h6>

        {sortedActionDetails && sortedActionDetails.length > 0 ? (
        sortedActionDetails.map((action, index) => (
          <div key={index} className="mb-3">
          <p className="top-box-other-text-detail claim-v-history">
            {action.actionOn ? `${getStatusText(action.status)} on ${action.actionOn}` : ''} by {action.actionBy || ''}
          </p>
          <p><strong>Comments :</strong> {action.comment || 'No comments provided.'}</p>
        </div>
        ))
      ) : (
        <p>No history available.</p>
      )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AttendenceHistroy;
