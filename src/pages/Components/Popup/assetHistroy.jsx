import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'


const AssetHistroy = ({ isOpen, closeModal, isviewId }) => {
  const assetHistory = {
      "Type": "Employee Asset Alloction Histroy",
      "leavestatus": "updated",
      "leaveRequests": [
          {
              "comment": "test",
              "startDate": "2024-08-06",
              "status": "submitted",
              "submittedBy": "pankaj.kumar@oxytal.com",
              "submittedOn": "28 Aug 2024",
              "endDate": "2024-08-06"
          },
          {
              "comment": "test",
              "status": "updated",
              "submittedBy": "pankaj.kumar@oxytal.com",
              "submittedOn": "04 Sep 2024",
              "startDate": "2024-08-06",
              "endDate": "2024-08-06",
              "previousAllocation": "Pankaj kumar",
              "newAllocation": "Anoop Sharma"
          }
      ]
  }
  useEffect(() => {
    if (isOpen) {
      //getAttendanceDetails(isviewId);
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

          <div className="modal-body" id="assetshistroy">
            <div className="main-view-box-leave">
              <div className="top-box-leave">
                <h5 className="text_top_l">{assetHistory.Type}</h5>
                <div className={`top-box-leave-right leave-${assetHistory.leavestatus}`}>{assetHistory.leavestatus}</div>
              </div>
              {(assetHistory.leaveRequests || []).map((request, index) => (
                <div className="detail-box-leave" key={index}>
                  {request.submittedOn && (
                    <div className="top-box-other-text top-box-other-text-detail">
                      Allocated on <span>{request.submittedOn}</span> by <span>{request.submittedBy}</span>
                    </div>
                  )}
                  {request.status && (
                    <div className={`top-box-leave-right leave-${request.status}`}>{request.status}</div>
                  )}
                  {request.previousAllocation && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Previous Allocation</span> : <span className="end_text_d">{request.previousAllocation}</span>
                    </div>
                  )}
                  {request.newAllocation && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">New Allocation</span> : <span className="end_text_d">{request.newAllocation}</span>
                    </div>
                  )}
                  {request.submitFor && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Submit for</span> : <span className="end_text_d">{request.submitFor}</span>
                    </div>
                  )}
                  {request.startDate && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">Start Date :</span> <span className="end_text_d">{request.startDate}</span>
                    </div>
                  )}
                  {request.endDate && (
                    <div className="top-box-other-text">
                      <span className="start_text_d">End Date :</span><span className="end_text_d">{request.endDate}</span>
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

export default AssetHistroy;
