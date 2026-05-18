import { FaRegClock } from "react-icons/fa";

export default function CheckInCheckoutButton({
  punchMode,
  onSubmit,
  currentTime,
  isClient,
  formatDate,
}) {
  const isCheckIn = punchMode === "";

  return (
    <div
      className={`attendence-button ${
        isCheckIn ? "attendence-checkin" : "attendence-checkout"
      }`}
      role="button"
      onClick={onSubmit}
    >
      {/* Label */}
      <span>{isCheckIn ? "Check IN" : "Check OUT"}</span>

      {/* Time & Date */}
      {isClient && currentTime && (
        <>
          <span>
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span>{formatDate(currentTime)}</span>
        </>
      )}

      {/* Icon */}
      <span className="oxyem-background-bg">
        <FaRegClock />
      </span>
    </div>
  );
}
