import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { MdClose } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import moment from 'moment-timezone';
import Drawer from 'react-modern-drawer'
import Profile from '../commancomponents/profile';
//import styles 👇
import 'react-modern-drawer/dist/index.css'


const Leaveview = ({ isOpen, closeModal, isviewId, section, handleUpadateClick }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [attendanceDate, setAttendanceDate] = useState([]);

  const [EmployeeDetails, setEmployeeDetails] = useState([]);
  console.log("233", EmployeeDetails)

  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/leave`, {
        params: {
          idLeave: id,
        },
      });
      if (response && response.data && response.data.data) {
        setEmployeeDetails(response.data.data.allLeavesByEmp[0].section[0].fields);
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAttendanceDetails(isviewId);
    }
  }, [isOpen, isviewId]);

  const handleupdate = () => {
    handleUpadateClick(getidAttendance);
  };

  const filteredDetails = EmployeeDetails.filter(
    (item) => item.name !== "isDelete" && item.name !== "remainingLeaves"
  );

  const orderedDetails = [
    ...filteredDetails.filter((item) => item.name !== "idEmployee")
  ];

  const leaveHistory = {
    "leavetype": "Earned Leave",
    "leavestatus": "Approved",
    "leaveRequests": [
      {
        submittedOn: '09 jul 2024',
        submittedBy: 'Pankaj kumar',
        status: 'Submitted',
        submitFor: 'Pankaj Kumar',
        fromDate: '2024-07-10',
        toDate: '2024-07-11',
        noOfDays: 2,
        comment: 'I am apply leave from 2024-07-10 to 2024-07-11 due to urgent personal matters that require my immediate attention in my hometown.'
      },
      {
        submittedOn: '09 jul 2024',
        submittedBy: 'Pankaj kumar',
        status: 'Recalled',
        comment: 'I am writing to inform you that I need to cancel my previously requested leave from 2024-07-10 to 2024-07-11 due to a change in my personal circumstances. The urgent matter in my hometown has been postponed.'
      },
      {
        submittedOn: '11 jul 2024',
        submittedBy: 'Pankaj kumar',
        status: 'Submitted',
        submitFor: 'Pankaj Kumar',
        fromDate: '2024-07-12',
        toDate: '2024-07-13',
        noOfDays: 2,
        comment: 'I am writing to inform you that I need to cancel my previously requested leave from 2024-07-10 to 2024-07-11 due to a change in my personal circumstances. The urgent matter in my hometown has been postponed to the next day. Therefore, I would like to reapply for leave from 2024-07-12 to 2024-07-13 to address this rescheduled matter.'
      },
      {
        approvedOn: '11 jul 2024',
        approvedBy: 'Sandeep Bawalia',
        status: 'Approved'
      }
    ]
  };
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

          <div className="modal-body">
            <div className="main-view-box-leave">
              <div className="top-box-leave">
                <h5 className="text_top_l">{leaveHistory.leavetype}</h5>
                <div className={`top-box-leave-right leave-${leaveHistory.leavestatus}`}>{leaveHistory.leavestatus}</div>
              </div>
              {leaveHistory.leaveRequests.map((request, index) => (
                <div className="detail-box-leave" key={index}>
                  {request.submittedOn && (
                    <div className="top-box-other-text top-box-other-text-detail">
                      Submitted on <span>{request.submittedOn}</span> by <span>{request.submittedBy}</span>
                    </div>
                  )}
                  {request.status && (
                    <div className={`top-box-leave-right leave-${request.status}`}>{request.status}</div>
                  )}
                  {request.submitFor && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Submit for</span> : <span className="end_text_d">{request.submitFor}</span>
                    </div>
                  )}
                  {request.fromDate && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">From Date :</span> <span className="end_text_d">{request.fromDate}</span>
                    </div>
                  )}
                  {request.toDate && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">To Date :</span><span className="end_text_d">{request.toDate}</span>
                    </div>
                  )}
                  {request.noOfDays && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">No. of Days :</span><span className="end_text_d">{request.noOfDays}</span>
                    </div>
                  )}
                  {request.comment && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Comment :</span><span className="end_text_d">{request.comment}</span>
                    </div>
                  )}
                  {request.approvedOn && (
                    <div className="top-box-other-text top-box-other-text-detail">
                      Approved on <span>{request.approvedOn}</span> by <span>{request.approvedBy}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>


          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Leaveview;
