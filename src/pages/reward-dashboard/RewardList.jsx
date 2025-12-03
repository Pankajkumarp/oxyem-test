import React, { useEffect, useState, useRef } from "react";
import { GrDownload } from "react-icons/gr";
import { FaRegEye } from "react-icons/fa";
import { axiosJWT } from "../Auth/AddAuthorization";
import View from './View';

const RewardList = ({ viewMode }) => {
  const [rewards, setRewards] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastElementRef = useRef(null);
  const firstFetchRef = useRef(true); // Prevent duplicate fetch on viewMode change

  useEffect(() => {
    // Reset page and clear rewards only when viewMode changes
    setPage(0);
    setRewards([]);
    setHasMore(true);
    firstFetchRef.current = true; // Set flag to fetch only once after reset
  }, [viewMode]);

  useEffect(() => {
    if (firstFetchRef.current) {
      firstFetchRef.current = false;
      fetchRewards(0); // Fetch data only once when viewMode changes
    } else {
      fetchRewards(page);
    }
  }, [page]);

  const fetchRewards = async (currentPage) => {
    if (loading) return;

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const apiPath = viewMode === "submitted" ? "submittedReward" : "recievedReward";
      const response = await axiosJWT.get(`${apiUrl}/reward/${apiPath}?page=${currentPage}&limit=${limit}`);
      const newData = response.data.data;

      setRewards((prevRewards) => (currentPage === 0 ? newData : [...prevRewards, ...newData]));
      setHasMore(newData.length >= limit);
    } catch (error) {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loading || !hasMore) return;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (lastElementRef.current) {
      observerInstance.observe(lastElementRef.current);
    }

    return () => {
      if (lastElementRef.current) {
        observerInstance.unobserve(lastElementRef.current);
      }
    };
  }, [loading, hasMore]);

  const [isHistroyId, setHistroyId] = useState('');
      const [isModalOpen, setIsModalOpen] = useState(false);
      const handleViewReward = (id) => {
        setHistroyId(id);
        setIsModalOpen(true);
     };
  
    const closeDetailpopup = async () => {
      setHistroyId('');
      setIsModalOpen(false);
    };

    const handleDownloadClickWithPath = async (path) => {
    
        const filePath = path;
    
        try {
    
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/download`, {
                params: { filePath},
                responseType: 'blob', // Important for file download
            });
    
            // Create a URL for the file and download it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = getFileName(filePath);
            link.setAttribute('download', fileName); // or extract the file name from the response
            document.body.appendChild(link);
            link.click();
    
        } catch (error) {
            // console.error('Error downloading the file', error);
        }
    };
    
    const getFileName = (path) => {
      return path.substring(path.lastIndexOf('/') + 1);
    };

  return (
    <>
    <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"}  datafor={viewMode}/>
    <div className="row mt-4 g-3 reward-list">
      {rewards.map((reward, index) => (
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6" key={index}>
          <div className="p-3 border rounded shadow-sm position-relative">
            <span className="position-absolute top-0 start-0 text-white px-1  reward-point">
              Points: {reward.point}
            </span>
            <span className="position-absolute top-0 end-0 p-2">
              <GrDownload size={20} style={{ cursor: "pointer" }} onClick={() => handleDownloadClickWithPath(reward.certificatePath)}/>
            </span>
            <div className="text-center py-3">
              <span className="fs-1">
                <img
                  src={reward.badgetsUrl}
                  alt="award"
                  className="img-fluid badget"
                />
              </span>
              <p className="fw-semibold mt-2">{reward.rewardType}</p>
              <p className="mt-2 d-flex justify-content-between align-items-center">
                <span className="text-secondary">{reward.date}</span>
                  <FaRegEye size={20} style={{ color: "var(--theme-rewards-color)", cursor: "pointer" }} onClick={() => handleViewReward(reward.certificateUrl)} />
              </p>
            </div>
            <p className="text-secondary">{reward.certificateNo}</p>
          </div>
        </div>
      ))}
      {hasMore && <div ref={lastElementRef} className="h-10"></div>}
      {loading && (
        <p className="text-center mt-4">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </p>
      )}
    </div>
    </>
  );
};

export default RewardList;
