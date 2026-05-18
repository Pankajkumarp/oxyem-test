import React from "react";

export default function LeaveAnalyticsHeader({
  title = "Annual Leave Chart",
  usedPercentage = 42,
  peakMonth = "October",
  leaveType = "Earned Leave",
  allocatedDays = 20,
  alertsText = "2 holidays expired"
}) {
  return (
    <div className="leave-analytics-header">
      {/* Left Section */}
      <div className="d-flex flex-column">
        <div className="header-title d-flex align-items-center gap-2">
          <i className="bi bi-graph-up-arrow text-primary"></i>
          <span>{title}</span>
        </div>

        <div className="header-insight d-flex align-items-center gap-2">
          <i className="bi bi-gear-fill text-muted small"></i>
          <span>
            You&apos;ve used{" "}
            <strong className="text-success">{usedPercentage}%</strong> of your
            annual leave.
          </span>
          <span className="text-muted">
            Most leaves taken in <strong>{peakMonth}</strong>.
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className="filter-pill">
          <i className="bi bi-calendar-check me-1"></i>
          {allocatedDays} Days
        </span>

        <span className="filter-pill">
          {leaveType}
          <i className="bi bi-chevron-down ms-1"></i>
        </span>

        <span className="filter-pill text-warning">
          <i className="bi bi-exclamation-circle me-1"></i>
          {alertsText}
        </span>
      </div>
    </div>
  );
}
