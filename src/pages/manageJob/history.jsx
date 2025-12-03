import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Drawer from 'react-modern-drawer';

import 'react-modern-drawer/dist/index.css';

const AssetHistory = ({ isOpen, closeModal, isHistroyId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [assetHistory, setAssetHistory] = useState([]);
  const [currentStatus, setStatus] = useState('');
  const [hasData, setHasData] = useState(true); // Tracks if there's any history data

  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/jobs/viewHistory`, {
        params: { id: id, isFor: 'joblist' }
      });

      if (response && response.data && response.data.data) {
        const history = response.data.data.data;
        if (Array.isArray(history) && history.length > 0) {
          setAssetHistory(history);
          setStatus(history[0]?.status || '');
          setHasData(true);
        } else {
          setAssetHistory([]);
          setStatus('');
          setHasData(false); // No history data
        }
      }
    } catch (error) {
      
      setAssetHistory([]);
      setStatus('');
      setHasData(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAttendanceDetails(isHistroyId);
      document.body.classList.add("hide-body-scroll");
    } else {
      document.body.classList.remove("hide-body-scroll");
      setAssetHistory([]);
      setStatus('');
      setHasData(true);
    }
  }, [isOpen, isHistroyId]);

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
            <h4 className="modal-title" id="myLargeModalLabel">Job History</h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>

          <div className="modal-body" id="assetshistroy">
            <div className="main-view-box-leave">
              <div className="top-box-leave">
                {currentStatus && (
                  <div
                    style={{
                      width: currentStatus.toLowerCase() === 'decommissioned' ? '22%' : undefined,
                      padding: '5px 2px'
                    }}
                    className={`top-box-leave-right oxyem-mark-${currentStatus.toLowerCase()}`}
                  >
                    {currentStatus}
                  </div>
                )}
              </div>

              {hasData ? (
                (assetHistory || []).map((action, index) => (
                  <div className="detail-box-leave" key={index}>
                    <div className="top-box-other-text top-box-other-text-detail">
                    {action?.status.charAt(0).toUpperCase() + action?.status.slice(1).toLowerCase()} on {action?.actionOn}<br/> by {action?.actionBy}
                
              </div>
                    
                    <div
                      style={{
                        width: action.status.toLowerCase() === 'decommissioned' ? '22%' : undefined,
                        padding: '5px 2px'
                      }}
                      className={`top-box-leave-right oxyem-mark-${action?.status.toLowerCase()}`}
                    >
                      {action?.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-history-message">
                  <hr/>
                  <p>No history available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AssetHistory;
