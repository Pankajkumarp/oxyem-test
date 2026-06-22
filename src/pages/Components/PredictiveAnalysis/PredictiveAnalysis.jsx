// components/PredictiveWarning.jsx
import { FaExclamationTriangle, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";

export default function PredictiveWarning({
  missingDaysCount = 1,
  upcomingNoAttendanceDays = 3,
}) {
  return (
    <div
      className="card border-0 shadow-sm fw-semibold mb-1 insight-text"
      style={{
        background: "linear-gradient(135deg, #fff7e6, #fff1cc)",
        borderRadius: "12px",
      }}
    >
      {/* Header */}
      <div className="card-header bg-transparent border-0 d-flex align-items-center justify-content-between pb-0">
        <div className="d-flex align-items-center gap-2">
          <FaExclamationTriangle className="text-warning" />
          <h6 className="mb-0 fw-semibold">Predictive Warning</h6>
        </div>
      </div>

      {/* Body */}
      <div className="card-body pt-2 ">
        <ul className="list-unstyled mb-3 predictive-p">
          <li className="d-flex align-items-start gap-2 mb-2 ">
            <FaExclamationTriangle className="text-warning mt-1" />
            <span className="text-muted insight-text predictive-p">
              If you miss <strong>{missingDaysCount}</strong> more day this
              month, it may impact payroll.
            </span>
          </li>

          <li className="d-flex align-items-start gap-2 mb-2">
            <FaInfoCircle className="text-primary mt-1" />
            <span className="text-muted predictive-p">
              Consider applying regularization.
            </span>
          </li>

          <li className="d-flex align-items-start gap-2">
            <FaCalendarAlt className="text-secondary mt-1" />
            <span className="text-muted predictive-p">
              <strong>{upcomingNoAttendanceDays}</strong> upcoming working days
              have no attendance entries.
            </span>
          </li>
        </ul>

        {/* CTA 
        <div className="text-end">
          <button
            className="btn btn-primary btn-sm px-3"
            onClick={onRegularize}
          >
            Regularize Days
          </button>
        </div>*/}
      </div>
    </div>
  );
}
