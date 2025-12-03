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


const goalHistroy = ({ isOpen, closeModal, goalNameId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [performanceValue, setPerformanceValue] = useState([]);

  const [StatusType, setStatusType] = useState();
  console.log("performanceValue", performanceValue)
  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/performance/goalNamehistory`, {
        params: {
          idGoalMaster: id,
        },
      });
      if (response && response.data && response.data.data) {
        setStatusType(response.data.data.status)
        setPerformanceValue(response.data.data.action)
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAttendanceDetails(goalNameId);
      document.body.classList.add("hide-body-scroll");
    } else {
      document.body.classList.remove("hide-body-scroll");
    }
  }, [isOpen, goalNameId]);




  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay'
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body">
            <div className="main-view-box-leave main-view-box-perform">
              <div className="top-box-leave">
                <h5 className="text_top_l">Goal Histroy</h5>
                <div className={`top-box-leave-right leave-${(StatusType || '').replace(/\s+/g, '-').toLowerCase()}`}>
                  {StatusType}
                </div>

              </div>
              {performanceValue.length === 0 ? (
                <div className="no-history-message">No history available</div>
              ) : (
                performanceValue.map((item, index) => (
                  <div key={index} className="detail-box-leave detail-box-opportunity">
                    <div className="top-box-other-text top-box-other-text-detail">
                      {index === performanceValue.length - 1 ? (
                        <>Created on <span>{item.submittedOn}</span> by <span>{item.submittedBy}</span></>
                      ) : (
                        <>Edited on <span>{item.submittedOn}</span> by <span>{item.submittedBy}</span></>
                      )}
                    </div>
                    {item.status && (
                      <div className={`top-box-leave-right leave-${item.status.replace(/\s+/g, '-').toLowerCase()}`}>
                        {item.status}
                      </div>
                    )}
                  </div>
                ))
              )}

            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default goalHistroy;
