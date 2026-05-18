export default function ProjectIndicator({ projindicator }) {
  let colorClass = "bg-secondary"; // default unknown gray


   if (projindicator === "risk") {
    colorClass = "bg-warning"; // yellow
  } else if (projindicator === "delayed") {
    colorClass = "bg-danger"; // red
  }else{
     colorClass = "bg-success"; // green
  }

  return (
    <span
      className={`risk-indicator-status ${colorClass}`}      
      title={projindicator}
    ></span>
  );
}
