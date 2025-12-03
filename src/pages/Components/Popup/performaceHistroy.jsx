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


const performaceHistroy = ({ isOpen, closeModal, performanceId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [performanceValue, setPerformanceValue] = useState([]);
  const [StatusType, setStatusType] = useState();

  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/performance/history`, {
        params: {
          idReview: id,
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
      getAttendanceDetails(performanceId);
      document.body.classList.add("hide-body-scroll");
    } else {
      document.body.classList.remove("hide-body-scroll");
    }
  }, [isOpen, performanceId]);




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
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body">
            <div className="main-view-box-leave main-view-box-perform">
              <div className="top-box-leave">
                <h5 className="text_top_l">Performance History</h5>
                <div className={`top-box-leave-right leave-${(StatusType || '').replace(/\s+/g, '-').toLowerCase()}`}>
                  {StatusType}
                </div>

              </div>
              {(performanceValue || []).map((request, index) => {
                const hasSpecificUpdatedValues =
                  request.updatedValues &&
                  Object.keys(request.updatedValues).length === 5 &&
                  'markAsClosed' in request.updatedValues &&
                  'rating' in request.updatedValues;

                return (
                  <div className="detail-box-leave detail-box-opportunity" key={index}>
                    {hasSpecificUpdatedValues && request.status === 'Goal Updated' && request.addedOn && request.addedBy && (
                      <div className="top-box-other-text top-box-other-text-detail">
                        Goal updated on <span>{request.addedOn}</span> by <span>{request.addedBy}</span>
                      </div>
                    )}
                    {!hasSpecificUpdatedValues && request.submittedOn && (
                      <div className="top-box-other-text top-box-other-text-detail">
                        Created on <span>{request.submittedOn}</span> by <span>{request.submittedBy}</span>
                      </div>
                    )}

                    {!hasSpecificUpdatedValues && request.addedOn && (
                      <div className="top-box-other-text top-box-other-text-detail">
                        Added New Goal <span>{request.addedOn}</span> by <span>{request.addedBy}</span>
                      </div>
                    )}
                    {request.status && (
                      <div className={`top-box-leave-right leave-${request.status.replace(/\s+/g, '-').toLowerCase()}`}>
                        {request.status}
                      </div>
                    )}
                    {request.updatedValues && (
                      <div className="update-details_peforme">
                        <p>Updated Values:</p>
                        <table>
                          <thead>
                            <tr>
                              {Object.keys(request.updatedValues).map((key) => (
                                <th key={key}>{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {Object.values(request.updatedValues).map((value, index) => (
                                <td key={index}>{value?.toString() || 'N/A'}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                );
              })}


            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default performaceHistroy;
