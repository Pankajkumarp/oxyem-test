import React from 'react';
import parse from 'html-react-parser';

const ClaimHistory = ({ actionDetails }) => {

  // Function to capitalize the first letter of the status
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Function to modify the status when it is 'Requiredaddinfo'
  const getStatusText = (status) => {
    return status === 'RequiredAddInfo' ? 'Required Additional Information' : capitalizeFirstLetter(status);
  };

  // Sorting the actionDetails array by actionOn in descending order
  const sortedActionDetails = actionDetails ? [...actionDetails].sort((a, b) => new Date(b.actionOn) - new Date(a.actionOn)) : [];

  return (
    <div className="mt-4">
      <h5>History</h5>
      {sortedActionDetails.length > 0 ? (
        sortedActionDetails.map((action, index) => (
          <div key={index} className="mb-3">
            <p className="top-box-other-text-detail claim-v-history">
              {action.actionOn ? `${getStatusText(action.status)} on ${action.actionOn}` : ''} by {action.actionBy || ''}
            </p>
            {action.comment && <p>{parse(action.comment)}</p>}

          </div>
        ))
      ) : (
        <p>No history available.</p>
      )}
    </div>
  );
};

export default ClaimHistory;
