import React, { useEffect, useState } from "react";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";

const TicketHistorySection = ({ ticketId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [ticketActions, setTicketActions] = useState([]);

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

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

  // 🔹 Fetch history from API
  const fetchTicketHistory = async (id) => {
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
        setTicketActions(response.data.data.actionDetails);
      }
    } catch (error) {
      console.error("Error fetching ticket history:", error);
    }
  };

  useEffect(() => {
  fetchStatuses(); 
}, []);

  useEffect(() => {
    if (ticketId) {
      fetchTicketHistory(ticketId);
    }
  }, [ticketId]);

  // 🔹 Sort actions by latest first
  const sortedTicketActions = ticketActions
    ? [...ticketActions].sort(
        (a, b) => new Date(b.actionOn) - new Date(a.actionOn)
      )
    : [];
  return (
    <div className="mt-4">
      <h5>Ticket History</h5>
      {sortedTicketActions.length > 0 ? (
        sortedTicketActions.map((action, index) => (
          <div key={index} className="mb-3">
            <p className="top-box-other-text-detail claim-v-history">
              {action.actionOn
                ? `${getStatusText(action.status)} on ${action.actionOn}`
                : ""}{" "}
              by {action.actionBy || ""}
            </p>
            <p>
              <strong>Remarks :</strong>{" "}
              {action.comment || "No remarks provided."}
            </p>
          </div>
        ))
      ) : (
        <p>No ticket history available.</p>
      )}
    </div>
  );
};

export default TicketHistorySection;
