import React from 'react';

export default function ticketdetail({ ticketDetails }) {

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/ /g, '-');
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <ul className="personal-info-header-right claim-detail-v-page top-details">
          {ticketDetails?.CreatedBy && (
            <li>
              <div className="title">Submitted By :</div>
              <div className="text">{ticketDetails.CreatedBy}</div>
            </li>
          )}
              {ticketDetails?.CreatedDate && (
                <li>
                  <div className="title">Raised Date :</div>
                  <div className="text">{formatDate(ticketDetails.CreatedDate)}</div>
                </li>
              )}
              
              {ticketDetails?.moduleName && (
                <li>
                  <div className="title">Module Name :</div>
                  <div className="text">{ticketDetails.moduleName}</div>
                </li>
              )}
        </ul>
      </div>

      <div className="col-md-6">
        <ul className="personal-info-header-right claim-detail-v-page top-details">
          {ticketDetails?.submittedFor && (
            <li>
              <div className="title">Submitted For :</div>
              <div className="text">{ticketDetails.submittedFor}</div>
            </li>
          )}
          {ticketDetails?.ticketNo && (
            <li>
              <div className="title">Ticket Number :</div>
              <div className="text">{ticketDetails.ticketNo}</div>
            </li>
          )}
          {ticketDetails?.path && (
            <li>
              <div className="title">Path :</div>
              <div className="text">{ticketDetails.path}</div>
            </li>
          )}
          {(ticketDetails?.title || ticketDetails?.moduleName) && (
                <li>
                  <div className="title">Title :</div>
                  <div className="text">{ticketDetails.title || ticketDetails.moduleName}</div>
                </li>
              )}
          
        </ul>
      </div>
    </div>
  );
}
