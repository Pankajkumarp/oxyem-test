import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Drawer from 'react-modern-drawer';

//import styles 👇
import 'react-modern-drawer/dist/index.css';

const AssetHistory = ({ isOpen, closeModal, isHistroyId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [assetHistory, setAssetHistory] = useState([]);
  const [currentStatus, setStatus] = useState('');

  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/asset/viewHistory`, { params: { id: id , isFor:'asset'} });
      if (response && response.data && response.data.data && response.data.data.action) {
        setAssetHistory(response.data.data.action);
        setStatus(response.data.data.status);
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
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
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>

          <div className="modal-body" id="assetshistroy">
            <div className="main-view-box-leave">
              <div className="top-box-leave">
                <h5 className="text_top_l">Asset History</h5>
                <div 
                    style={{ width: currentStatus.toLowerCase() === 'decommissioned' ? '22%' : undefined,
                              padding: '5px 2px'
                            }} 
                    className={`top-box-leave-right oxyem-mark-${currentStatus.toLowerCase()}`}
                >
                  {currentStatus}
                </div>

              </div>
              {(assetHistory || []).map((action, index) => (
                <div className="detail-box-leave" key={index}>
                  {action.actionDate && (
                    <div className="top-box-other-text top-box-other-text-detail">
                      {action.actionOn} <span>on {action.actionDate}</span> by {action.actionBy}
                    </div>
                  )}
                  {action.status && (
                    <div 
                    style={{ width: action.status.toLowerCase() === 'decommissioned' ? '22%' : undefined,
                      padding: '5px 2px'
                    }} 
                    className={`top-box-leave-right oxyem-mark-${action.status.toLowerCase()}`}>{action.status}</div>
                  )}
                  {action.allocationStartDate && (
                    <div className="top-box-other-text">
                      Allocation Start Date: <span>{action.allocationStartDate}</span>
                    </div>
                  )}
                  {action.allocationEndDate && (
                    <div className="top-box-other-text">
                      Allocation End Date: <span>{action.allocationEndDate}</span>
                    </div>
                  )}
                  {action.allocationTo && (
                    <div className="top-box-other-text">
                      Allocation To: <span>{action.allocationTo}</span>
                    </div>
                  )}
                  {action.allocationWas && (
                    <div className="top-box-other-text">
                      Allocation Was: <span>{action.allocationWas}</span>
                    </div>
                  )}
                  {Object.keys(action.updatedFields || {}).length > 0 && (
                    <div className="">
                 <p style={{fontWeight:'600'}}> Updated Fields: </p>
                      {Object.entries(action.updatedFields).map(([field, value]) => (
                        <div key={field}>
                          {field}: <span>{value}</span>
                        </div>
                      ))}
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

export default AssetHistory;
