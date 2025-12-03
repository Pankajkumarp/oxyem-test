import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Drawer from 'react-modern-drawer'

import 'react-modern-drawer/dist/index.css'


const AttendenceHistroy = ({ isOpen, closeModal, isHistroyId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [actionDetails, setDetails] = useState([]);
  
  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/permission/viewHistory`, { params: { idGroup: id } });
      if (response && response.data && response.data.data && response.data.data.action) {
        setDetails(response.data.data.action);
      }
    } catch (error) {
      // console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAttendanceDetails(isHistroyId);
    }
  }, [isOpen, isHistroyId]);


  // Function to capitalize the first letter of the status
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Function to modify the status when it is 'Requiredaddinfo'
  const getStatusText = (status) => {
    return status === 'RequiredAddInfo' ? 'Required Additional Information' : capitalizeFirstLetter(status);
  };

  // Sorting the actionDetails array by actionOn in descending order
  const sortedActionDetails = actionDetails ? [...actionDetails].sort((a, b) => new Date(b.actionOn) - new Date(a.actionOn)) : [];
  
  return (
    <Drawer open={isOpen} onClose={closeModal} direction='right' className='custom-drawer' overlayClassName='custom-overlay' >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
            <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
          </div>
          <div className="modal-body  oxyem-attendence-popup">
          <div className="mt-4">
      <h5>History</h5>
      {sortedActionDetails.length > 0 ? (
        sortedActionDetails.map((action, index) => (
          <div key={index} className="mb-3">
            <p className="top-box-other-text-detail claim-v-history">
              {action.actionOn ? `${getStatusText(action.status)} on ${action.actionOn}` : ''} by {action.actionBy || ''}
            </p>
          </div>
        ))
      ) : (
        <p>No history available.</p>
      )}
    </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AttendenceHistroy;
