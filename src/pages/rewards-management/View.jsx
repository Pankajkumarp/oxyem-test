import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { axiosJWT } from "../Auth/AddAuthorization";
import Profile from "./profile";
import { BsEmojiFrown } from "react-icons/bs";
const AssetHistory = ({ isOpen, closeModal, isHistroyId }) => {
  const [rewards, setRewards] = useState([]);
  const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const fetchOptions = async (id) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(
        `${apiUrl}/reward/submittedReward?idReward=${id}`
      );
      setRewards(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    setRewards([]);
    if (isHistroyId) {
      fetchOptions(isHistroyId);
    }
  }, [isHistroyId]);

  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction="right"
      className="custom-drawer"
      overlayClassName="custom-overlay"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
          <h4 className="modal-title">{rewards.length > 0 ? rewards[0].rewardType : ""}</h4>

            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <hr />
          <div className="modal-body" id="rewards-management">
  {rewards.length > 0 ? (
    rewards.map((reward, index) => (
      <div key={reward.id} className="p-2 rounded-lg bg-blue-100 flex items-center justify-between mb-0 relative">
        <div className="border ml-4 flex-1 reward-profile">
        <span className="top-0 end-0 p-2 reward-management-top-date">
          {reward.date}
        </span>
          <span className="oxyem-custom-table-profile p-3">
            
            <Profile
              name={reward.employeeName}
              imageurl={`${baseImageUrl}/${reward.profilePicPath}` || ""}
              size={"60"}
              profilelink={`${reward.profilePicPath}` || ""}
              role={reward.roleName}
              designation={reward.department}
            />
          </span>
        </div>
        
      </div>
    ))
  ) : (
    <p className=""><BsEmojiFrown  size={25} color="#932fdd"/> There is no record found.</p>
  )}
</div>

        </div>
      </div>
    </Drawer>
  );
};

export default AssetHistory;
