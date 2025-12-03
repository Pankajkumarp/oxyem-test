import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import Rating from 'react-rating';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
const AssetHistory = ({ isOpen, closeModal ,isHistroyId}) => {
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [assetHistoryData, setAssetHistory] = useState([]);
  const [currentStatus, setStatus] = useState('');
  const [questions, setQuestions] = useState([]);
  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/jobs/viewHistory`, {
        params: { id: id, isFor: 'onboardhistory' }
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
            <h4 className="modal-title" id="myLargeModalLabel">Profile Dashboard History</h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body" id="assetshistroy">
            {isLoading ? (
              <span className="loader"></span>
            ) : (
              <div className="main-view-box-leave">
                {assetHistoryData.map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="detail-box-job-history">
                      <div className="top-box-job-history">
                        <div className="row">
                          <div className="col-md-9">
                          <p className="text_top_l"> {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : ""} on {item.date} { item.by !== '' ? `by ${item.by}`  :'' }</p>
                          <div>Stage : <span className="history-onboard-stage">{item.action === 'O' ? "Offer Letter" : 
                              item.action === 'S' ? "Shortlisted" : 
                              item.action === 'TI' ? "Technical Interview" : 
                              item.action === 'MI' ? "Management Interview" : 
                              item.action === 'A' ? "Applied" : 
                              item.action.charAt(0).toUpperCase() + item.action.slice(1).toLowerCase()}
                              </span>
                          </div>
                          </div>

                          <div className="col-md-3">
                          {item.status && (
                          <div className={`top-box-leave-right oxyem-mark-${item.status}`}>
                            {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : ""}
                          </div>
                        )}
                          </div>
                          
                        </div>
                        
                        
                        {item.role && (
                          <div className="row">
                            <div className="col-md-4">Role</div>
                            <div className="col-md-5">{item.role}</div>
                            {/* <div className="col-md-3"><div className={`top-box-leave-right oxyem-mark-${item.action}`}>{item.action}</div></div> */}
                          </div>
                        )}

                      </div>
                      {item.ratings && item.ratings.map((rating, rIndex) => {
  const matchedQuestion = questions.find(q => q.idQuestion === rating.question);
  const questionText = matchedQuestion ? matchedQuestion.value : "Question not found";

  return (
    <div key={rIndex} className="top-box-other-text top-box-other-job-star rating_star_input">
      <h5 className="">{questionText}</h5>
      <Rating
        initialRating={rating.rating}
        emptySymbol={<FaRegStar className='sk-rating-empty' />}
        fullSymbol={<FaStar />}
        fractions={2}
        stop={10}
        readonly
      />
    </div>
  );
})}


                    </div>
                    <hr />
                  </React.Fragment>
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
