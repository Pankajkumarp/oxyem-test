const CompletionBar = ({ value }) => {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="progress-container">
      <div
        className="progress-fill"
        style={{ width: `${safeValue}%` }}
      >
        {safeValue}%
      </div>
    </div>
  );
};

export default CompletionBar;
