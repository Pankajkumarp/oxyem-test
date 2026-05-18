import React from "react";
import { Card } from "react-bootstrap";

export default function ClaimSidebarPanel() {
  return (
    <div className="claim-sidebar-v2">
      <Card className="shadow-sm mb-3 border-0">
        <Card.Body>
          <h5 className="fw-bold mb-3">Claim Guidelines</h5>

          <div className="d-flex d-flex-custom justify-content-between mb-2">
            <span>Allowed Internet Expense <br></br>Claim Limit</span>
            <span className="fw-bold font-large-card">₹ 500</span>
          </div>
          <div className="d-flex d-flex-custom justify-content-between mb-2">
            <span>Maximum Claim Date</span>
            <span className="fw-bold font-large-card">90 days prior</span>
          </div>

          <div className="mb-2 d-flex-middle">
            <span>Allowable Currencies</span>
            <div className="mt-1">
                
                <span className="badge bg-light text-dark me-1">AUD</span>
              <span className="badge bg-light text-dark me-1">INR</span>
            
              <span className="badge bg-light text-dark me-1">EUR</span>
              <span className="badge bg-light text-dark me-1">GBP</span>
                <span className="badge bg-light text-dark me-1">USD</span>
            </div>
          </div>

          <div className="mt-2 d-flex-custom-top">
            <span className="fw-semibold">Required Documents</span>
            <div>Invoice • Receipt</div>
          </div>
        </Card.Body>
      </Card>

      {/* Quick Tips */}
      <Card className="shadow-sm mb-3 border-0">
        <Card.Body>
          <h6 className="fw-bold mb-3">Quick Tips</h6>

          <ul className="list-unstyled ps-1">
            <li className="mb-1">
              <span className="li-icon">✅</span> <span class="li-text"><b>Submit original, legible receipts </b>showing vendor name, date, and amount.</span>
            </li>
            <li className="mb-1">
              <span className="li-icon">✅</span> <span class="li-text"><b>Claim only eligible expenses </b>as per company policy and approved categories.</span>
            </li>
            <li className="mb-1">
              <span className="li-icon">✅</span> <span class="li-text"><b>Submit claims within the allowed period </b>from the expense date.</span>
            </li>
             
            <li className="mb-1">
              <span className="li-icon">✅</span> <span class="li-text"><b>Duplicate or split claims are strictly prohibited</b> and will be rejected.</span>
            </li>
          </ul>

          <div className="alert alert-success p-2 small">
            ✔ All entries must comply with the claim policy to avoid rejection.
            <div>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h6 className="fw-bold">
            <span className="text-success">✔</span> Similar Claim
          </h6>
          <p className="small mb-2">
            A similar claim for<span className="fw-bold font-large-card remaining-balance"> ₹ 7,500</span> was submitted last month. Please ensure
            this is not a duplicate submission.
          </p>
        </Card.Body>
      </Card>
      </div>
  );
}
