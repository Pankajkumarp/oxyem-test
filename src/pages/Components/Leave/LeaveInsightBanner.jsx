import { FcOrgUnit } from "react-icons/fc";
import { FcBookmark } from "react-icons/fc";

export default function LeaveInsightBanner({
  totalLeaves,
  remainingLeaves,
  birthdayCominginDays,
  LOP,
}) {
  // Calculate leave used %
  const usedLeaves = totalLeaves - remainingLeaves;
  const percentage = Math.round((usedLeaves / totalLeaves) * 100);

  return (
    <div className="leave-insight-banner d-flex align-items-center justify-content-start gap-5 ">
      {/* Annual Leave Section */}
      <div className="d-flex align-items-center gap-3">
        <div className="insight-icon">
          <i className="bi bi-bar-chart-fill"></i>
          <FcOrgUnit />
        </div>

        <div className="insight-text">
          <div className="fw-semibold mb-1">
            You&apos;ve used <span className="text-success">{percentage}%</span>{" "}
            of your annual leave.
          </div>

          {/* Bootstrap Progress Bar */}
          <div
            className="progress mb-1"
            style={{ height: "10px", width: "200px" }}
          >
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${percentage}%` }}
              aria-valuenow={percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>

          <div className="text-muted small">
            {remainingLeaves} leaves remaining out of {totalLeaves}.<br />
            {remainingLeaves >= 20 ? (
              <div>You haven’t used your earned leave yet.</div>
            ) : (
              <div>
                {" "}
               {/* Most leaves taken in <strong>{peakMonth}</strong>. */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Birthday Leave Section */}
      <div className="d-flex align-items-center gap-3 insight-ml-41">
        <div className="insight-icon">
          <i className="bi bi-bar-chart-fill"></i>
          🎉
        </div>

        <div className="insight-text">
          <div className="fw-semibold">
            {birthdayCominginDays <= 15 && birthdayCominginDays != 0 ? (
              <div>
                Your birthday is coming up. Birthday leave is ready to use.
              </div>
            ) : birthdayCominginDays >= 15 ? (
              <div>You haven’t used your birthday leave yet.</div>
            ) : (
              <div>You’ve already taken your birthday leave this year.</div>
            )}
          </div>
        </div>
      </div>

      {/* LOP Leave Section */}
      {LOP > 0 ? (
        <div className="d-flex align-items-center gap-3 insight-ml-41">
          <div className="insight-icon">
            <i className="bi bi-bar-chart-fill"></i>
            <FcBookmark />
          </div>

          <div className="insight-text">
            <div className="fw-semibold">
              <div>
                <strong>{LOP}</strong> days of unpaid leave (LOP) were applied
                due to insufficient leave balance.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
