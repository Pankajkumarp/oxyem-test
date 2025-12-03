import React from "react";
import { Tooltip } from "react-tooltip";

export default function Tracking({ claimDetails }) {
  const { accountants, cfos, submittedBy, status } = claimDetails || {};

  const generateListHtml = (items) => {
    if (Array.isArray(items) && items.length > 0) {
      return `<ul style="margin: 0; padding: 5px 0; list-style-type: none; text-align: left;">
        ${items.map((item, index) => `<li>${index + 1}. ${item}</li>`).join("")}
      </ul>`;
    }

    if (typeof items === "object" && items !== null && Object.keys(items).length > 0) {
      return `<ul style="margin: 0; padding: 5px 0; list-style-type: none; text-align: left;">
        ${Object.entries(items).map(([key, value]) => `<li>${key}: ${value}</li>`).join("")}
      </ul>`;
    }

    if (typeof items === "string" || typeof items === "number" || typeof items === "boolean") {
      return `<p>${items}</p>`;
    }

    return "<p>No data available</p>";
  };

  const getStatusClass = (step) => {
    switch (status) {
      case "Submitted":
        return {
          circle: step === "S" ? "active" : step === "V" ? "next-pending" : "pending",
          arrow: step === "S" ? "submitted-active" : "step-arrow-pending",
        };
      case "Inprogress":
        return {
          circle: step === "S" || step === "V" ? "active" : step === "A" ? "next-pending" : "pending",
          arrow: step === "S" ? "submitted-active" : "verified-active",
        };
      case "On Hold":
        return {
          circle: step === "S" || step === "V" || step === "A" ? "active" : "next-pending",
          arrow:
            step === "S"
              ? "submitted-active"
              : step === "V"
              ? "verified-active"
              : step === "A"
              ? "approved-active"
              : "step-arrow-pending",
        };
      case "Approved":
        return {
          circle: "active",
          arrow: step === "S" ? "submitted-active" : step === "V" ? "verified-active" : "approved-active",
        };
      default:
        return { circle: "pending", arrow: "pending" };
    }
  };

  const statusClass = status ? `oxyem-claim-trking-${status.toLowerCase()}` : "oxyem-claim-trking-pending";

  return (
    <div className={`tracking-claim-container ${statusClass}`} id="automation-step-circle">
      <div className="step-arrow lr-line"></div>

      {/* Submitted */}
      <div className="oxyem-tooltip-text position-relative">
        <div className={`step-circle ${getStatusClass("S").circle}`} data-tooltip-id="tooltip-submit" data-tooltip-content={submittedBy}>
          {getStatusClass("S").circle === "active" ? "✓" : ""}
        </div>
        <div className="step-title">Submitted</div>
        <Tooltip id="tooltip-submit" type="dark" effect="solid" style={{ zIndex: "999" }} />
      </div>

      <div className={`step-arrow ${getStatusClass("S").arrow}`}></div>

      {/* Inprogress */}
      <div className="oxyem-tooltip-text position-relative">
        <div
          className={`step-circle ${getStatusClass("V").circle}`}
          data-tooltip-id="tooltip-progress"
          // data-tooltip-html={generateListHtml(accountants)}
          data-tooltip-content={"Inprogress"}
        >
          {getStatusClass("V").circle === "active" ? "✓" : ""}
        </div>
        <div className="step-title">Inprogress</div>
        <Tooltip id="tooltip-progress" type="dark"  effect="solid" style={{ zIndex: "999" }} />
      </div>

      <div className={`step-arrow ${getStatusClass("V").arrow}`}></div>

      {/* On Hold */}
      <div className="oxyem-tooltip-text position-relative">
        <div
          className={`step-circle ${getStatusClass("A").circle}`}
          data-tooltip-id="tooltip-hold"
          // data-tooltip-html={generateListHtml(cfos)}
          data-tooltip-content={"On Hold"}
        >
          {getStatusClass("A").circle === "active" ? "✓" : ""}
        </div>
        <div className="step-title">On Hold</div>
        <Tooltip id="tooltip-hold" type="dark"  effect="solid" style={{ zIndex: "999" }} />
      </div>

      <div className={`step-arrow ${getStatusClass("A").arrow}`}></div>

      {/* Approved */}
      <div className="oxyem-tooltip-text position-relative">
        <div className={`step-circle ${getStatusClass("P").circle}`}
        data-tooltip-id="tooltip-approved"
          // data-tooltip-html={generateListHtml(cfos)}
          data-tooltip-content={"Approved"}
        >
          {getStatusClass("P").circle === "active" ? "✓" : ""}
        </div>
        <div className="step-title">Approved</div>
        <Tooltip id="tooltip-approved" type="dark"  effect="solid" style={{ zIndex: "999" }} />

      </div>

      <div className="step-arrow lr-line"></div>
    </div>
  );
}