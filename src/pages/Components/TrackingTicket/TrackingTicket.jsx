import React, { useEffect, useState } from 'react'
import { Tooltip } from 'react-tooltip';

export default function TrackingTicket({ ticketDetails }) {
  if (!ticketDetails) return null;
  console.log(ticketDetails,"params recieved")
  const [status, setStatusTrack] = useState('');

  useEffect(() => {
    setStatusTrack(ticketDetails.toLowerCase().trim());
  }, []);
// useEffect(() => {
//   if (ticketDetails?.status) {
//     setStatus(ticketDetails.status.toLowerCase().trim());
//   }
// }, [ticketDetails.status]);


  console.log(status, "this is status");


  // Determine the status classes based on ticket status
  const getStatusClass = (step) => {
    switch (status) {
      case 'submitted':
        return {
          circle: step === 'S' ? 'active' : step === 'I' ? 'next-pending' : 'pending',
          arrow: step === 'S' ? 'submitted-active' : 'step-arrow-pending',
        };
      case 'infoprovided':
        return {
          circle: step === 'S' ? 'active' : step === 'I' ? 'next-pending' : 'pending',
          arrow: step === 'S' ? 'submitted-active' : 'step-arrow-pending',
        };
      case 'onhold':
        return {
          circle: step === 'S' ? 'active' : step === 'I' ? 'next-pending' : 'pending',
          arrow: step === 'S' ? 'submitted-active' : 'step-arrow-pending',
        };
        case 'inforeq':
        return {
          circle: step === 'S' ? 'active' : step === 'I' ? 'next-pending' : 'pending',
          arrow: step === 'S' ? 'submitted-active' : 'step-arrow-pending',
        };
        case 'inprogress':
        return {
          circle: step === 'S' || step === 'I' ? 'active' : step === 'R' ? 'next-pending' : 'pending',
          arrow: step === 'S' ? 'submitted-active' : step === 'I' ? 'inprogress-active' : step === 'I' ? 'inProgress-active' : 'step-arrow-pending',
        };
      case 'resolved':
        return {
          circle: step === 'S' || step === 'I' || step === 'R' ? 'active' : step === 'C' ? 'next-pending' : 'pending',
          arrow: step === 'S' ? 'submitted-active' : step === 'I' ? 'inprogress-active' : step === 'I' ? 'resolved-active' : 'step-arrow-pending',
        };
      case 'closed':
        return {
          circle: 'active',
          arrow: step === 'S' ? 'submitted-active' : step === 'I' ? 'inprogress-active' : step === 'R' ? 'resolved-active' : 'step-arrow-pending',
        };
      default:
        return {
          circle: 'pending',
          arrow: 'pending',
        };
    }
  };
  

  // Ensure status is available and convert to lowercase for the container class
  const statusClass = status ? `oxyem-ticket-trking-${status.toLowerCase()}` : 'oxyem-ticket-trking-pending';
console.log(statusClass)
  return (
    <div className={`tracking-ticket-container ${statusClass}`}>

<div className="oxyem-tooltip-text">
  <div
    className={`step-circle ${getStatusClass('S').circle}`}
    data-tooltip-id="tooltip-submit"
    // data-tooltip-content={`${submittedBy}`}
    data-tooltip-content="Submitted"
  >
    S
  </div>
  <Tooltip id="tooltip-submit" type="dark" effect="solid" style={{ zIndex: '999' }} />
</div>

<div className={`step-arrow ${getStatusClass('S').arrow}`}></div>

<div className="oxyem-tooltip-text">
  <div
    className={`step-circle ${getStatusClass('I').circle}`}
     data-tooltip-id="tooltip-processed"

    data-tooltip-content="In Progress"
  >
    I
  </div>
  <Tooltip id="tooltip-processed" type="dark" effect="solid" style={{ zIndex: '999' }} />
</div>

<div className={`step-arrow ${getStatusClass('I').arrow}`}></div>

<div className="oxyem-tooltip-text">
  <div
    className={`step-circle ${getStatusClass('R').circle}`}
       data-tooltip-id="tooltip-processed"

    data-tooltip-content="Resolved"
  >
    R
  </div>
   <Tooltip id="tooltip-processed" type="dark" effect="solid" style={{ zIndex: '999' }} />
</div>

<div className={`step-arrow ${getStatusClass('R').arrow}`}></div>

<div className="oxyem-tooltip-text">
  <div
    className={`step-circle ${getStatusClass('C').circle}`}
    data-tooltip-id="tooltip-processed"
    data-tooltip-content="Closed"
  >
    C
  </div>
  <Tooltip id="tooltip-processed" type="dark" effect="solid" style={{ zIndex: '999' }} />
</div>


    </div>
  );
}
