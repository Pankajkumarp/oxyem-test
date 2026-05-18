import React from "react";
import { Card } from "react-bootstrap";

export default function ClaimSidebarPanel() {
  return (
    <div className="container-fluid">
      {/* Claim Guidelines */}
      <Card className="shadow-sm mb-3 border-0">
        <Card.Body>
          <h5 className="fw-bold mb-3">Claim Guidelines</h5>

          <div className="d-flex justify-content-between mb-2">
            <span>Allowed Internet Expense <br></br>Claim Limit</span>
            <span className="fw-bold">₹ 500</span>
          </div>
{/** 
          <div className="d-flex justify-content-between mb-2">
            <span>Remaining Balance</span>
            <span className="fw-bold text-success">₹ 7,500</span>
          </div>
*/}
          <div className="d-flex justify-content-between mb-2">
            <span>Maximum Claim Date</span>
            <span className="fw-bold">90 days prior</span>
          </div>

          <div className="mb-2">
            <span>Allowable Currencies</span>
            <div className="mt-1">
                
                <span className="badge bg-light text-dark me-1">AUD</span>
              <span className="badge bg-light text-dark me-1">INR</span>
            
              <span className="badge bg-light text-dark me-1">EUR</span>
              <span className="badge bg-light text-dark me-1">GBP</span>
                <span className="badge bg-light text-dark me-1">USD</span>
            </div>
          </div>

          <div className="mt-2">
            <span className="fw-semibold">Required Documents</span>
            <div>Invoice • Receipt</div>
          </div>
        </Card.Body>
      </Card>

      {/* Quick Tips */}
      <Card className="shadow-sm mb-3 border-0">
        <Card.Body>
          <h6 className="fw-bold mb-2">Quick Tips</h6>

          <ul className="list-unstyled ps-1">
            <li className="mb-1">
              ✅ <b>Submit original, legible receipts </b>showing vendor name, date, and amount.
            </li>
            <li className="mb-1">
              ✅ <b>Claim only eligible expenses </b>as per company policy and approved categories.
            </li>
            <li className="mb-1">
              ✅ <b>Submit claims within the allowed period </b>from the expense date.
            </li>
             
            <li className="mb-1">
              ✅ <b>Duplicate or split claims are strictly prohibited</b> and will be rejected.
            </li>
          </ul>

          <div className="alert alert-success p-2 small">
            ✔ All entries must comply with the claim policy to avoid rejection.
            <div>
              <a href="/claim-policy" className="text-primary small" target="_blank">
                View Claim Policy
              </a>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Need Help 
      <Card className="shadow-sm mb-3 border-0">
        <Card.Body>
          <div className="d-flex align-items-center mb-2">
            <img
              src="/user.png"
              alt="User"
              width="36"
              height="36"
              className="rounded-circle me-2"
            />
            <div>
              <div className="fw-bold">Need Help?</div>
              <small>Chat with our support team</small>
            </div>
          </div>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your message…"
            />
            <button className="btn btn-primary">➤</button>
          </div>
        </Card.Body>
      </Card>
*/}
      {/* Similar Claim */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h6 className="fw-bold">
            <span className="text-success">✔</span> Similar Claim
          </h6>
          <p className="small mb-2">
            A similar claim for<b> ₹ 7,500</b> was submitted last month. Please ensure
            this is not a duplicate submission.
          </p>
          <a href="#" className="text-primary small">
            Review claim
          </a>
        </Card.Body>
      </Card>
    </div>
  );
}
