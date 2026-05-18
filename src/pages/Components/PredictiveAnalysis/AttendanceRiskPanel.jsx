import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaCalendarAlt,
} from "react-icons/fa";

export default function AttendanceRiskPanel({
  missingDays = 1,
  lateCheckinDay = "Friday",
  missingCheckoutDay = "Friday",
}) {
  return (
    <div className="row g-3">
      {/* Predictive Warning */}
      <div className="col-md-4 ">
        <div className="card-header bg-transparent border-0 fw-semibold bg-warning ">
          Predictive Warning
        </div>

        <div className="card card-analysis-h border-0 shadow-sm ">
          <div className="card-body predictive-p">
            <div className="d-flex align-items-start gap-2 mb-3 predictive-p">
              <FaExclamationTriangle className="text-warning mt-1" />
              <span className="text-muted">
                If you miss <strong>{missingDays}</strong> more day this month,
                it may impact payroll.
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <FaCheckCircle />
              <span className="text-muted">
                <strong>{missingDays}</strong> day missing attendance
              </span>
              <FaArrowUp className="ms-auto text-primary" />
            </div>

            <div className="d-flex align-items-start gap-2">
              <FaCalendarAlt className="text-secondary mt-1" />
              <span className="text-muted predictive-p">
                <strong>{missingDays}</strong> upcoming working days have no
                attendance entries.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Days At Risk */}
      <div className="col-md-4">
        <div className="card-header bg-transparent border-0 fw-semibold bg-risk-danger">
          Upcoming Days At Risk
        </div>
        <div className="card card-analysis-h border-0 shadow-sm">
          <div className="card-body predictive-p">
            <div className="d-flex align-items-start gap-2 mb-3">
              <FaExclamationTriangle className="text-warning mt-1" />
              <span>
                <strong>1 day late check-in</strong>
                <br />
                <small className="text-muted">next {lateCheckinDay}</small>
              </span>
            </div>

            <div className="d-flex align-items-start gap-2">
              <FaClock className="text-warning mt-1" />
              <span>
                <strong>Missing checkouts</strong>
                <br />
                <small className="text-muted">next {missingCheckoutDay}</small>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Highlights */}
      <div className="col-md-4">
        <div className="card-header bg-transparent border-0 fw-semibold bg-alert-success">
          Highlights
        </div>

        <div className="card-body predictive-p">
          <div className="d-flex align-items-start gap-2 mb-3 predictive-p">
            <FaExclamationTriangle className="text-warning mt-1" />
            <span className="text-muted">
              If you miss <strong>{missingDays}</strong> more day this month, it
              may impact payroll.
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <FaCheckCircle />
            <span className="text-muted">
              <strong>{missingDays}</strong> day missing attendance
            </span>
            <FaArrowUp className="ms-auto text-primary" />
          </div>

          <div className="d-flex align-items-start gap-2">
            <FaCalendarAlt className="text-secondary mt-1" />
            <span className="text-muted predictive-p">
              <strong>{missingDays}</strong> upcoming working days have no
              attendance entries.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
