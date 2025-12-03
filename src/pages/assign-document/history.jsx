import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { FaHistory } from "react-icons/fa";
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
const assignDocuHistory = ({ isOpen, closeModal, isDoc }) => {

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [docummentHistoryData, setDocummentHistory] = useState([]);
  const [status, setStatus] = useState("");
  const getDocumentDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/docuSign/history`, {
        params: { id: id }
      });

      if (response && response.data && response.data.data) {
        const information = response.data.data.action
        setDocummentHistory(information)
        if (information.length > 0) {
          setStatus(information[0].status);
        }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (isOpen) {
      getDocumentDetails(isDoc);
      document.body.classList.add("hide-body-scroll");
    } else {
      document.body.classList.remove("hide-body-scroll");
      setStatus("")
      setDocummentHistory([])
    }
  }, [isOpen, isDoc]);

  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay'
    >
      <div className="modal-dialog modal-lg histroy-process-modal">
        
        <div className="modal-content main-view-box-leave">
          <div className="modal-header detail-box-leave">
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
            <h4 className="modal-title space-top" id="myLargeModalLabel"><FaHistory /> Document History {status ?<div className={`postion-right top-box-leave-right leave-${status}`}>{status}</div>:null}</h4>
          </div>
          <div className="modal-body " id="dochistroy">
            {docummentHistoryData.length === 0 ? (
              <p className="empty-v">No history found.</p>
            ) : (
              docummentHistoryData.map((item, index) => (
                <div className="detail-box-leave" key={index}>
                  {item.actionOn && (
                    <div className="top-box-other-text top-box-other-text-detail">
                      Submitted on <span>{item.actionOn}</span> by <span>{item.actionBy}</span>
                    </div>
                  )}
                  {item.status && (
                    <div className={`top-box-leave-right leave-${item.status}`}>{item.status}</div>
                  )}
                  <p><strong>Comment:</strong> {item.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default assignDocuHistory;
