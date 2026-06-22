import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

const ClaimHistory = ({ actionDetails }) => {

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const getStatusText = (status) => {
    return status === 'RequiredAddInfo'
      ? 'Required Additional Information'
      : capitalizeFirstLetter(status);
  };

  const sortedActionDetails = actionDetails
    ? [...actionDetails].sort(
        (a, b) => new Date(b.actionOn) - new Date(a.actionOn)
      )
    : [];
  return (
    <div className="mt-4">
      <h5>History</h5>
      {sortedActionDetails.length > 0 ? (
        sortedActionDetails.map((action, index) => (
          <div key={index} className="mb-3">
            <p className="top-box-other-text-detail claim-v-history">
              {action.actionOn ? `${getStatusText(action.status)} on ${action.actionOn}` : ''} by {action.actionBy || ''}
            </p>
            {action.comment && <div
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(action.comment),
    }}
  />}

          </div>
        ))
      ) : (
        <p>No history available.</p>
      )}
    </div>
  );
};

export default ClaimHistory;
