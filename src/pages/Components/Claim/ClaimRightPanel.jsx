import { useState } from "react";
import TopSectionHeading from "../common/Heading/TopSectionHeading.jsx";
import { LiaHistorySolid } from "react-icons/lia";
import { RxActivityLog } from "react-icons/rx";

export default function ClaimRightPanel() {
  const [activeTab, setActiveTab] = useState("all");

  const data = [
    {
      id: 1,
      claim: "REG1072",
      amount: "₹ 400",
      status: "Approved",
      claimMonth: "Mar25",
    },
    {
      id: 2,
      claim: "REG1076",
      amount: "₹ 400",
      status: "Pending",
      claimMonth: "Apr25",
    },
    {
      id: 3,
      claim: "REG1056",
      amount: "₹ 400",
      status: "Verified",
      claimMonth: "May25",
    },
    {
      id: 4,
      claim: "REG1059",
      amount: "₹ 800",
      status: "Rejected",
      claimMonth: "Jun25",
    },
    {
      id: 5,
      claim: "REG1050",
      amount: "₹ 600",
      status: "Paid",
      claimMonth: "Jul25",
    },
    {
      id: 6,
      claim: "REG1056",
      amount: "₹ 400",
      status: "Approved",
      claimMonth: "Mar25",
    },
    {
      id: 7,
      claim: "REG1022",
      amount: "₹ 500",
      status: "Rejected",
      claimMonth: "Mar25",
    },
  ];

  const badgeClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success-subtle text-success";
      case "Paid":
        return "bg-success-subtle text-success";
      case "Pending":
        return "bg-warning-subtle text-warning";
      case "Verified":
        return "bg-info-subtle text-info";
      case "Rejected":
        return "bg-danger-subtle text-danger";
      default:
        return "bg-secondary-subtle text-dark";
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-1 claim-summary">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <TopSectionHeading
            headingH1={"Recent Activity"}
            headingH2={""}
            Icon={RxActivityLog}
          />
        </div>

        {/* Metrics Summary */}
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="p-3 rounded-1 border">
              <div className="fw-semibold">Pending Decisions</div>
              <h4 className="mt-1">4</h4>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 rounded-1 border">
              <div className="fw-semibold">Approved Amount</div>
              <h4 className="mt-1">₹ 1,200</h4>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 rounded-1 border">
              <div className="fw-semibold">Aging Claims</div>
              <h4 className="mt-1">2</h4>
            </div>
          </div>
        </div>

        <TopSectionHeading
          headingH1={"Claim History"}
          headingH2={""}
          Icon={LiaHistorySolid}
        />

        {/* Tabs */}
        <ul className="nav nav-tabs mb-2 claim-summary">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Claims
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "approved" ? "active" : ""}`}
              onClick={() => setActiveTab("approved")}
            >
              Approved
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "paid" ? "active" : ""}`}
              onClick={() => setActiveTab("paid")}
            >
              Paid
            </button>
          </li>
        </ul>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Claim</th>
                <th>Claim Month</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.id}</td>
                  <td>{row.claim}</td>
                  <td>{row.claimMonth}</td>
                  <td>{row.amount}</td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 ${badgeClass(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            Rows per page:
            <select className="form-select d-inline-block w-auto ms-2">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span>1–10 of 12</span>
            <button className="btn btn-light btn-sm rounded-circle">
              <i className="bi bi-chevron-left" />
            </button>
            <button className="btn btn-light btn-sm rounded-circle">
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
