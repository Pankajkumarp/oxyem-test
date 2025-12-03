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


const pricingHistroy = ({ isOpen, closeModal, opportunityId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [opportunityValue, setOpportunityValue] = useState([]);
  const [StatusType, setStatusType] = useState();

  const getInvoiceDetail = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/opportunity/viewInvoiceHistory`, {
        params: {
          id: id,
        },
      });
      if (response && response.data && response.data.data) {
        setStatusType(response.data.data.status)
        setOpportunityValue(response.data.data.action)
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getInvoiceDetail(opportunityId);
      document.body.classList.add("hide-body-scroll");
    } else {
      document.body.classList.remove("hide-body-scroll");
    }
  }, [isOpen, opportunityId]);




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
            <div className="main-view-box-leave main-view-box-opportunity">
              <div className="top-box-leave">
                <h5 className="text_top_l">Invoice Edit Histroy</h5>
                <div className={`top-box-leave-right leave-${StatusType}`}>{StatusType}</div>
              </div>
              {(opportunityValue || []).map((request, index) => (
                <div className="detail-box-leave detail-box-invoice" key={index}>
                  {request.submittedOn && (
                    <div className="top-box-other-invo">
                      {request.sectionName}
                      {request.sectionName === 'Submitted' && (
                        " on"
                      )}
                      {request.sectionName !== 'Submitted' && (
                        index >= opportunityValue.length - 2 ? ' Created on' : ' Edit on'
                      )}
                      <span>{request.submittedOn}</span> by <span>{request.submittedBy}</span>
                    </div>
                  )}
                  {request.status && (
                    <div className={`top-box-leave-right leave-${request.status}`}>{request.status}</div>
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

export default pricingHistroy;
