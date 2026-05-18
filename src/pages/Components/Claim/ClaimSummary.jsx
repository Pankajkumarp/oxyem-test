
import React from "react";

export default function ClaimSummary({claimDetails}) {
  return (
    <div className="card shadow-sm border-0 rounded-1 card-bg-gray claim-summary">
      <div className="card-body">

        <h5 className="fw-semibold mb-3">Claim Summary</h5>

        <div className="p-3 border rounded-1 card-bg-white ">

          {/* Claim Number */}
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">Claim Number</span>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold">{claimDetails.claimNumber}</span>
              <i className="bi bi-check2-square text-primary"></i>
            </div>
          </div>

          {/* Submitted Date */}
          <div className="d-flex justify-content-between mb-2 text-muted">
            <span>Submitted Date</span>
            <span>{claimDetails.submittedDate}</span>
          </div>

          {/* Submitted By */}
          <div className="d-flex justify-content-between mb-2">
            <span>Submitted</span>
            <span>{claimDetails.submittedBy}</span>
          </div>

          {/* Claim Type */}
          <div className="d-flex justify-content-between mb-2">
            <span>Claim Type</span>
            <span>{claimDetails.claimName}</span>
          </div>

          {/* Claimed Amount */}
          <div className="d-flex justify-content-between mb-2">
            <span>Claimed Amount</span>
            <span>{claimDetails.currsymbol} {claimDetails.claimAmount ? claimDetails.claimAmount : ''}</span>
          </div>

           {/* Claim Month */}
          <div className="d-flex justify-content-between mb-2">
            <span>Claim Month</span>
            <span>{claimDetails.claimMonth}</span>
          </div>

          <hr />

          {/* Status */}
          <div className="d-flex justify-content-between align-items-center">
            <span>Status</span>
 
            <span className="badge bg-success px-3 py-2 ">
            {claimDetails.status}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
