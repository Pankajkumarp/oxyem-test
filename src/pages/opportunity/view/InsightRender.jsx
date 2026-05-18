import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer'
import { MdInsights } from "react-icons/md";
import { Tooltip } from "react-tooltip";
export default function InsightRender({ isOpen, closeModal, loading, aiRisks }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer-preview custom-drawer-preview-insight'
      overlayClassName='custom-overlay' // Apply the custom overlay class
    >
      <div className="modal-dialog oxyem-user-time-select">
        <div className="modal-content">
          <div className="modal-header-insight">
            <h4 className="modal-title-insight" id="myLargeModalLabel" ><MdInsights /> AI-Powered Deal Insights</h4>
            <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
          </div>
          <div className="modal-body">
            {!loading ? (
              <div className="insight-row">
                {aiRisks?.dealHealth && (
                  <div className="insigth-progress-bar">
                    <div
                      className="oxyem-progress-ring"
                      style={{
                        "--value": Math.trunc(aiRisks.dealHealth ?? 0),
                      }}
                    >
                      <span>
                        {Math.trunc(aiRisks.dealHealth ?? 0)}%
                      </span>
                    </div>
                    <p> Deal Health</p>
                  </div>
                )}

                {aiRisks.deliveryRisks?.length > 0 && (
                  <div className="main-box-b">
                    <h6 className="insight-main-heading mt-2">🚚 Delivery Risks</h6>
                    {aiRisks.deliveryRisks.map((item, i) => (
                      <RiskCard key={`delivery-${i}`} {...item} />
                    ))}
                  </div>
                )}
                {aiRisks.NextSteps?.length > 0 && (
                  <div className="mt-3 main-box-b">
                    <h6 className="insight-main-heading mt-2">📌 Next Steps</h6>
                    {aiRisks.NextSteps.map((item, i) => (
                      <RiskCard key={`next-${i}`} {...item} />
                    ))}
                  </div>
                )}
                {aiRisks.PredictPoints?.length > 0 && (
                  <div className="main-box-b mt-3">
                    <h6 className="insight-main-heading mt-2">🔮 Predictive Risks</h6>
                    {aiRisks.PredictPoints.map((item, i) => (
                      <RiskCard key={`predict-${i}`} {...item} />
                    ))}
                  </div>
                )}
                {aiRisks?.summary && (
                  <p className="text-muted mb-3 mt-3">{aiRisks.summary}</p>
                )}
                {aiRisks?.CostAnalysis && (
                  <div className=" alert-info-ai">
                    <strong>Cost Analysis:</strong> {aiRisks.CostAnalysis}
                  </div>
                )}
              </div>
            ) : (<div className="loader-ai-box"><div className="loader-ai"></div><p>Insight data is loading, please wait…</p></div>)}
          </div>
        </div>
        <Tooltip id="my-tooltip-p" place="top" />
      </div>
    </Drawer>
  );
}
function RiskCard({ title, risk, mitigation, severity }) {
  const colorMap = {
    High: "risk-high-m",
    Medium: "risk-medium-m",
    Low: "risk-low-m",
  };

  const iconMap = {
    High: "🔴",
    Medium: "🟠",
    Low: "🟢",
  };

  return (
    <div className={`card-insight ${colorMap[severity]}`}>
      <div className="card-header d-flex justify-content-between">
        <span className="main-tittle-in mt-2" data-tooltip-content={severity}
                                                                                data-tooltip-id={`my-tooltip-p`}>{iconMap[severity]} {title}</span>
      </div>
      <div className="card-body-insight">
        <p><strong>Risk:</strong> {risk}</p>
        <p className="mb-0"><strong>Mitigation:</strong> {mitigation}</p>
      </div>
    </div>
  );
}

