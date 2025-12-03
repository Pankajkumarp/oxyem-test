import React from 'react';
import { Tooltip } from 'react-tooltip';

export default function TrackingClaim({ claimDetails }) {
  const { accountants, cfos, submittedBy, status } = claimDetails || {};

  // Function to generate a string containing HTML list
  // const generateListHtml = (items) => {
  //   if (items && items.length > 0) {
  //     return `<ul style="margin: 0; padding: 5px 0; list-style-type: none; text-align: left;">${items
  //       .map((item, index) => `<li>${index + 1}. ${item}</li>`)
  //       .join('')}</ul>`;
  //   }
  //   return '<ul><li>No data available</li></ul>';
  // };

  const generateListHtml = (items) => {
    if (Array.isArray(items) && items.length > 0) {
      return `<ul style="margin: 0; padding: 5px 0; list-style-type: none; text-align: left;">
        ${items.map((item, index) => `<li>${index + 1}. ${item}</li>`).join('')}
      </ul>`;
    } 
    
    if (typeof items === 'object' && items !== null && Object.keys(items).length > 0) {
      return `<ul style="margin: 0; padding: 5px 0; list-style-type: none; text-align: left;">
        ${Object.entries(items).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
      </ul>`;
    } 
    
    if (typeof items === 'string' || typeof items === 'number' || typeof items === 'boolean') {
      return `<p>${items}</p>`;
    }
    
    return '<p>No data available</p>';
  };

  // Determine the status classes based on claim status
  const getStatusClass = (step) => {
    switch (status) {
      case 'submitted':
        return {
          circle: step === 'S' ? 'active' : step === 'V' ? 'next-pending' : 'pending',
          arrow: step === 'S' ? 'submitted-active' : 'step-arrow-pending',
        };
        case 'info req':
        return {
          circle: step === 'S' ? 'active' : step === 'V' ? 'next-pending' : 'pending',
          arrow: step === 'S' ? 'submitted-active' : 'step-arrow-pending',
        };
      case 'verified':
        return {
          circle: step === 'S' || step === 'V' ? 'active' : step === 'A' ? 'next-pending' : 'pending',
          arrow: step === 'S' ? 'submitted-active' : step === 'V' ? 'verified-active' : 'step-arrow-pending',
        };
      case 'approved':
        return {
          circle: step === 'S' || step === 'V' || step === 'A' ? 'active' : 'next-pending',
          arrow: step === 'S' ? 'submitted-active' : step === 'V' ? 'verified-active' : step === 'A' ? 'approved-active' : 'step-arrow-pending',
        };
      case 'paid':
        return {
          circle: 'active',
          arrow: step === 'S' ? 'submitted-active' : step === 'V' ? 'verified-active' : step === 'A' ? 'approved-active' : 'step-arrow-pending',
        };
      default:
        return {
          circle: 'pending',
          arrow: 'pending',
        };
    }
  };
  

  // Ensure status is available and convert to lowercase for the container class
  const statusClass = status ? `oxyem-claim-trking-${status.toLowerCase()}` : 'oxyem-claim-trking-pending';

  return (
    <div className={`tracking-claim-container ${statusClass}`}>
<div className="step-arrow lr-line"></div>

<div className="oxyem-tooltip-text position-relative">
  <div
    className={`step-circle ${getStatusClass('S').circle}`}
    data-tooltip-id="tooltip-submit"
    data-tooltip-content={`${submittedBy}`}
  >
      {getStatusClass('S').circle === 'active' ? '✓' : ''}

  </div>
    <div className="step-title">Submitted</div>

  <Tooltip id="tooltip-submit" type="dark" effect="solid" style={{ zIndex: '999' }} />
</div>

<div className={`step-arrow ${getStatusClass('S').arrow}`}></div>

<div className="oxyem-tooltip-text position-relative">
  <div
    className={`step-circle ${getStatusClass('V').circle}`}
    data-tooltip-id="tooltip-verified"
    data-tooltip-html={generateListHtml(accountants)}
  >
    {getStatusClass('V').circle === 'active' ? '✓' : ''}

  </div>
    <div className="step-title">Verified</div>

  <Tooltip id="tooltip-verified" type="dark" effect="solid" html={true} style={{ zIndex: '999' }} />
</div>

<div className={`step-arrow ${getStatusClass('V').arrow}`}></div>

<div className="oxyem-tooltip-text position-relative">
  <div
    className={`step-circle ${getStatusClass('A').circle}`}
    data-tooltip-id="tooltip-approved"
    data-tooltip-html={generateListHtml(cfos)}
  >
    {getStatusClass('A').circle === 'active' ? '✓' : ''}

  </div>
    <div className="step-title">Approved</div>

  <Tooltip id="tooltip-approved" type="dark" effect="solid" html={true} style={{ zIndex: '999' }} />
</div>

<div className={`step-arrow ${getStatusClass('A').arrow}`}></div>

<div className="oxyem-tooltip-text position-relative">
  <div
    className={`step-circle ${getStatusClass('P').circle}`}
    data-tooltip-id="tooltip-processed"
    data-tooltip-content="Paid"
  >
    {getStatusClass('P').circle === 'active' ? '✓' : ''}

  </div>
    <div className="step-title">Paid</div>

  <Tooltip id="tooltip-processed" type="dark" effect="solid" style={{ zIndex: '999' }} />
</div>
<div className="step-arrow lr-line"></div>

    </div>
  );
}
