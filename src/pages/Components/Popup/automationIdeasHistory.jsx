import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import Drawer from 'react-modern-drawer'

import 'react-modern-drawer/dist/index.css'
import ClaimHistory from "../Automation/claimhistory.jsx";

const AttendenceHistroy = ({ isOpen, closeModal, isHistroyId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [Details, setDetails] = useState([]);
  
  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/automationIdea/viewHistory`, { params: { idAutomationIdea: id } });
      if (response && response.data && response.data.data && response.data.data.action) {
        setDetails(response.data.data.action);
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

  
  return (
    <Drawer open={isOpen} onClose={closeModal} direction='right' className='custom-drawer' overlayClassName='custom-overlay' >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
            <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
          </div>
          <div className="modal-body  oxyem-attendence-popup">
            <ClaimHistory actionDetails={Details}/>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AttendenceHistroy;
