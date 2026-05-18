import { Card, ProgressBar } from "react-bootstrap";

export default function ClaimStatusBar() {
  return (
    <Card className="p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-center">
          <div className="fw-bold">Submitted</div>
          <small>29-Aug-2025</small>
        </div>

        <ProgressBar now={100} className="flex-grow-1 mx-3" />

        <div className="text-center">
          <div className="fw-bold text-success">Paid</div>
          <small>02-Sep-2025</small>
        </div>
      </div>
    </Card>
  );
}
