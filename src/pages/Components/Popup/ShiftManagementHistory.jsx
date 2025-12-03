import React, { useState, useEffect } from "react";

import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import moment from 'moment-timezone';
import Drawer from 'react-modern-drawer'

//import styles 
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


const AttendenceHistroy = ({ isOpen, closeModal, isHistroyId, section, handleUpadateClick }) => {
  
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const [getidAttendance, setGetidAttendance] = useState("");

  const [shiftDetails, setShiftDetails] = useState([]);

  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/userShiftDetails`, {
        params: {
            idEmployee: id,
        },
      });


      if (response && response.data && response.data.data) {
        setShiftDetails(response.data.data);
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

//   useEffect(() => {
    
//       getAttendanceDetails(isHistroyId);
    
//   }, []);

  const handleupdate = () => {
    handleUpadateClick(getidAttendance);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} `;
}
  
  
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
            <h6>{'History'}
              <span className='top-inner-text'>
                <span className='top-inner-time'> </span>
              </span>
            </h6>
            {shiftDetails.map((request, index) => (
              <div className="main-view-box-leave" key={index}>
                
                <div className="detail-box-leave" >
                  {request.ModifiedDate && (
                    <div className="top-box-other-text top-box-other-text-detail">
                      Submitted on <span>{request.ModifiedDate}</span> by <span>{request.CreatedBy}</span>
                    </div>
                  )}
                  {request.newshift && (
                    <div className={`top-box-leave-right leave-${'recalled'} shift-history-status`}>{request.newshift}</div>
                  )}
                  {request.applicableDate && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Applicable Date :</span> <span className="end_text_d">{request.applicableDate}</span>
                    </div>
                  )}
                  
                  {request.oldshift && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Previous Shift</span> : <span className="end_text_d">{request.oldshift}</span>
                    </div>
                  )}

                  {request.newshift && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">New Shift</span> : <span className="end_text_d">{request.newshift}</span>
                    </div>
                  )}

                  {request.shiftTime && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Shift Time</span> : <span className="end_text_d">{request.shiftTime}</span>
                    </div>
                  )}
            
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AttendenceHistroy;
