import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import Drawer from 'react-modern-drawer'
//import styles 👇
import 'react-modern-drawer/dist/index.css'


const Leaveview = ({ isOpen, closeModal, isviewId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [leaveHistory, setleaveHistory] = useState({});

  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/leave/history`, {
        params: {
          idLeave: id,
        },
      });
      if (response && response.data && response.data.data) {
        setleaveHistory(response.data.data)
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      getAttendanceDetails(isviewId);
		document.body.classList.add("hide-body-scroll");
    } else {
		document.body.classList.remove("hide-body-scroll");
    }
  }, [isOpen, isviewId]);


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
                <h5 className="text_top_l">{leaveHistory.leaveType}</h5>
                <div className={`top-box-leave-right leave-${leaveHistory.leavestatus}`}>{leaveHistory.leavestatus}</div>
              </div>
              {(leaveHistory.leaveRequests || []).map((request, index) => (
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
