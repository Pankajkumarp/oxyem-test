import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import Rating from 'react-rating';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
const AssetHistory = ({ isOpen, closeModal ,isHistroyId ,datafor}) => {
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [assetHistoryData, setAssetHistory] = useState([]);
  const [currentStatus, setStatus] = useState('');
  const [questions, setQuestions] = useState([]);
  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/reward/viewHistory`, {
        params: { id: id, isFor: 'rewardHistory' }
      });

      if (response && response.data && response.data.data) {
        const history = response.data.data.data;
        if (Array.isArray(history) && history.length > 0) {
          setAssetHistory(history);
          setStatus(history[0]?.status || '');
        } else {
          setAssetHistory([]);
          setStatus('');
        }
      }
    } catch (error) {
      
      setAssetHistory([]);
      setStatus('');
      
    }
  };

  const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/jobs/onboardQuestions`);
        setQuestions(response.data.data || []);
      } catch (error) {
        setError(error.message || 'Failed to fetch options');
      }
    };

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
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
            <h4 className="modal-title" id="myLargeModalLabel">Reward History</h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <hr />
          <div className="modal-body" id="assetshistroy">
            {isLoading ? (
              <span className="loader"></span>
            ) : assetHistoryData.length === 0 ? (
              <p className="text-gray-500">No History Available</p>
            
            ) : (
              <div className="main-view-box-leave">
                {assetHistoryData.map((item, index) => (
                  <div key={index}>
                    <div className="detail-box-job-history">
                      <div className="top-box-job-history">
                        <div className="row">
                          <div className="col-md-12">
                          <p className="text_top_l">{item.actionReceived === datafor ?  item.actionReceived.charAt(0).toUpperCase() + item.actionReceived.slice(1).toLowerCase() : item.actionSubmitted === datafor ? item.actionSubmitted.charAt(0).toUpperCase() + item.actionSubmitted.slice(1).toLowerCase() : '' } on {item.date} by {item.by}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AssetHistory;
