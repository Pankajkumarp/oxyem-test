import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { PiWarningOctagonThin } from "react-icons/pi";


export default function ClaimVerificationPanel() {

  const [decision, setDecision] = useState("approve");
  const [reason, setReason] = useState("Lack of actual invoice");
  const [comments, setComments] = useState("");

  return (
    <div className="card shadow-sm border-0 rounded-4">

      <div className="card-body">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-semibold">Verification & Decision</h5>

          <button className="btn btn-outline-primary btn-sm rounded-3">
            <i className="bi bi-plus-circle me-1"></i>
            Add Decision Option
          </button>
        </div>

        {/* Decision tabs */}
        <ul className="nav nav-pills mb-3">

          <li className="nav-item">
            <button
              onClick={() => setDecision("approve")}
              className={`nav-link ${decision === "approve" ? "active" : ""}`}
            >
              <i className="bi bi-check-circle me-1"></i>
              Approve
            </button>
          </li>

          <li className="nav-item">
            <button
              onClick={() => setDecision("info")}
              className={`nav-link ${decision === "info" ? "active" : ""}`}
            >
              <i className="bi bi-chat-dots me-1"></i>
              Need More Info
            </button>
          </li>

          <li className="nav-item">
            <button
              onClick={() => setDecision("warning")}
              className={`nav-link ${decision === "warning" ? "active" : ""}`}
            >
              <i className="bi bi-exclamation-triangle me-1"></i>
              Flag
            </button>
          </li>

          <li className="nav-item">
            <button
              onClick={() => setDecision("reject")}
              className={`nav-link ${decision === "reject" ? "active" : ""}`}
            >
              <i className="bi bi-x-circle me-1"></i>
              Reject
            </button>
          </li>

        </ul>

        {/* Verify amount */}
        <div className="mb-3">
          <span className="fw-semibold">Verify Amount:&nbsp;</span>
          <span className="text-success fw-bold">₹ 500</span>
        </div>

        {/* Risk/Validation cards */}
        <div className="mb-3">

          <div className="p-3 rounded-3 mb-2 border alert alert-success">
            <div className="d-flex justify-content-between">
              <div>
                
                <strong>Invoice validated electronically</strong>
                <div className="small text-muted">
                  Claimed amount ₹1200 is as per policy
                </div>
              </div>

              <span className="badge bg-success">Valid</span>
            </div>
          </div>

          <div className="p-3 rounded-3 border bg-warning">
            <div className="d-flex justify-content-between">
              <div>
                
                <strong>Claim amount exceeds policy limit</strong>
                <div className="small text-muted">
                  Pending service amount: ₹10,000
                </div>
              </div>

              <span className="badge bg-danger">Invalid</span>
            </div>
          </div>

        </div>

        {/* Reason dropdown */}
        <div className="mb-3">
          <label className="fw-semibold mb-1">Reason</label>
          <select
            className="form-select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option>Lack of actual invoice</option>
            <option>Policy limit exceeded</option>
            <option>Duplicate Claim</option>
            <option>Insufficient documents</option>
          </select>
        </div>

        {/* Comments */}
        <div className="mb-4">
          <label className="fw-semibold mb-1">Additional Comments:</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Type comments here"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        {/* Action buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light">Cancel</button>
          <button className="btn btn-outline-primary">Request Info</button>
          <button className="btn btn-primary">Verify</button>
          <button className="btn btn-danger">Reject</button>
        </div>

      </div>

    </div>
  );
}
