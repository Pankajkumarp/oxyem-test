import { FcInternal } from "react-icons/fc";

export default function TopSectionHeading({
  headingH1,
  headingH2,
  Icon,
}) {
  return (
    <div className="d-flex align-items-center gap-3">
      {/* Icon */}
      <div className="chart-icon" aria-hidden="true">
         {Icon ? <Icon /> : <FcInternal />}

      
      </div>

      {/* Text */}
      <div className="insight-text">
        <h2 className="h2-common mb-0">{headingH1}</h2>

        {headingH2 && (
          <p className="p-supporting-text mb-0">
            {headingH2}
          </p>
        )}
      </div>
    </div>
  );
}
