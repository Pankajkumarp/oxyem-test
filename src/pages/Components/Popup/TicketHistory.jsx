import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";
import moment from "moment-timezone";
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";

const getCurrentTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};


const TicketHistory = ({ isOpen, closeModal, isHistroyId }) => {
  // const timeZone = getCurrentTimeZone();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [ticketDetails, setTicketDetails] = useState([]);

  const [statusMap, setStatusMap] = useState({});
  
  // 🔹 Fetch status list
  const fetchStatuses = async () => {
    try {
      const res = await axiosJWT.get(`${apiUrl}/dropdowns`, { params: { "isFor": "ticket_status" } });
      if (res?.data?.data) {
        const map = {};
        res.data.data.forEach((s) => {
          map[s.id] = s.name; // { "uuid": "submitted", ... }
        });
        setStatusMap(map);
      }
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };
  
  // 🔹 Updated getStatusText
  const getStatusText = (status) => {
    if (!status) return "Submitted";
  
    // Check in statusMap (id → name)
    if (statusMap[status]) {
      return capitalizeFirstLetter(statusMap[status]);
    }
  
    // Fallback
    return capitalizeFirstLetter(status);
  };

  // 🔹 API call to get ticket history
  const getTicketDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/ticket/ticketDetails`, {
        params: { idTicket: id },
      });

      if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.actionDetails
      ) {
        setTicketDetails(response.data.data.actionDetails);
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

    useEffect(() => {
    fetchStatuses(); 
  }, []);
  
  // 🔹 Fetch when drawer opens
  useEffect(() => {
    if (isOpen) {
      getTicketDetails(isHistroyId);
    }
  }, [isOpen, isHistroyId]);

  // 🔹 Sort actions by latest first
  const sortedActionDetails = ticketDetails
    ? [...ticketDetails].sort(
        (a, b) => new Date(b.actionOn) - new Date(a.actionOn)
      )
    : [];

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
            <h4 className="modal-title" id="myLargeModalLabel">
              Ticket History
            </h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>

          <div className="modal-body oxyem-attendence-popup">
            {sortedActionDetails && sortedActionDetails.length > 0 ? (
              sortedActionDetails.map((action, index) => (
                <div key={index} className="mb-3">
                  <p className="top-box-other-text-detail claim-v-history">
                    {action.actionOn
                      ? `${getStatusText(action.status)} on ${action.actionOn}`
                      : ""}{" "}
                    by {action.actionBy || ""}
                  </p>
                  <p>
                    <strong>Comments :</strong>{" "}
                    {action.comment || "No comments provided."}
                  </p>
                </div>
              ))
            ) : (
              <p>No history available.</p>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default TicketHistory;
