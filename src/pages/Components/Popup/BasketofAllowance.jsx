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

 
const BasketofAllowance = ({ isOpen, closeModal, isviewId, section, handleUpadateClick }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [histroyValue, setHistroyValue] = useState([]);
  const [StatusType, setStatusType] = useState();

  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/payroll/viewHistory`, {
        params: {
          idBoa: id,
        },
      });
      if (response && response.data && response.data.data) {
        setStatusType(response.data.data.status)
        setHistroyValue(response.data.data.action)
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
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
                <h5 className="text_top_l">Allowance History</h5>
                <div className={`top-box-leave-right leave-${StatusType}`}>{StatusType}</div>
              </div>
              {(histroyValue || []).map((request, index) => (
                <div className="detail-box-leave" key={index}>
                  {request.submittedOn && (
                    <div className="top-box-other-text top-box-other-text-detail">
                      Submitted on <span>{request.submittedOn}</span> by <span>{request.submittedBy}</span>
                    </div>
                  )}
				  {request.approvedOn && (
                    <div className="top-box-other-text top-box-other-text-detail">
                      Approved on <span>{request.approvedOn}</span> by <span>{request.approvedBy}</span>
                    </div>
                  )}
				  {request.rejectedOn && (
                    <div className="top-box-other-text top-box-other-text-detail">
                      Rejected on <span>{request.rejectedOn}</span> by <span>{request.rejectedBy}</span>
                    </div>
                  )}
                  {request.status && (
                    <div className={`top-box-leave-right leave-${request.status}`}>{request.status}</div>
                  )}
                  {request.applicableMonth && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Applicable Month</span> : <span className="end_text_d">{request.applicableMonth}</span>
                    </div>
                  )}
                  {request.RevisedBOA && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Revised BOA :</span> <span className="end_text_d">{request.RevisedBOA}</span>
                    </div>
                  )}
				  {request.comment && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Reject Reason :</span> <span className="end_text_d">{request.comment}</span>
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

export default BasketofAllowance;
