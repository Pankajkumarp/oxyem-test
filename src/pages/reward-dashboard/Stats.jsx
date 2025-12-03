import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { RiInformationLine } from "react-icons/ri";
import { axiosJWT } from '../Auth/AddAuthorization';

export default function Stats({apipath}) {
  const [data, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/reward/${apipath}`);
      setStats(response.data.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchStats(apipath);
  }, [apipath]);

  return (
    <div className="row g-3">
      <div className="col-lg-4 col-md-12 col-sm-6">
        <div className="p-3 border rounded shadow-sm h-100 d-flex flex-column">
          <p className="fs-2 fw-bold">{data ? data.receivedPoints : 0}</p>
          <p className="text-secondary flex-grow-1">
            <b>Congrats!</b><br />Recognition Received
          </p>
        </div>
      </div>

      <div className="col-lg-4 col-md-12 col-sm-6">
        <div className="p-3 border rounded shadow-sm h-100 d-flex flex-column">
          <p className="fs-2 fw-bold d-flex align-items-center justify-content-between">
            <span>{data ? data.totalPoints : 0}</span>
            <span className="d-flex align-items-center">
              <RiInformationLine 
                data-tooltip-id="info-tooltip"
                data-tooltip-content={`How you can improve your rewards Points?\n\n1. Every award has some points associated. Collect as many rewards as you can.\n\n2. Appreciate your team members and colleagues for their work done and support.\n\n3. Learn more articles and quizzes on Skolrup.`}
                className="ms-2 text-secondary"
                style={{ cursor: 'pointer' }} 
              />
            </span>
          </p>
          <p className="text-secondary flex-grow-1">
            <b>Well Done!</b><br />Rewards Points Collected
          </p>
        </div>
      </div>

      <div className="col-lg-4 col-md-12 col-sm-6">
        <div className="p-3 border rounded shadow-sm h-100 d-flex flex-column">
          <p className="fs-2 fw-bold">{data ? data.submittedPoints : 0}</p>
          <p className="text-secondary flex-grow-1">
            <b>Good Work!</b><br />You appreciated your team members and colleagues
          </p>
        </div>
      </div>

      {/* Tooltip Component */}
      <Tooltip 
        id="info-tooltip" 
        place="top" 
        effect="solid"
        multiline
        style={{ whiteSpace: 'pre-line', maxWidth: '350px', zIndex: '200', backgroundColor: '#9a91d8' }} 
      />
    </div>
  );
}
