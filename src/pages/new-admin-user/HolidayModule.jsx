import { FaUmbrellaBeach } from "react-icons/fa";

export default function HolidayModule({
    birthdayLeaveEnabled,
    setBirthdayLeaveEnabled,
    birthdayLeaveCount,
    setBirthdayLeaveCount,

    earnedLeaveEnabled,
    setEarnedLeaveEnabled,
    earnedLeaveCount,
    setEarnedLeaveCount,

    paidLeaveEnabled,
    setPaidLeaveEnabled,
    paidLeaveCount,
    setPaidLeaveCount,

    maternityLeaveEnabled,
    setMaternityLeaveEnabled,
    maternityLeaveCount,
    setMaternityLeaveCount,
    onBack,
    onNext
}) {
    return (
        <div className="card flex-fill comman-shadow oxyem-index leave-configure-module">
            <div className="center-part">
                <div className="card-body">
                    <div className="col-12 mx-auto card border" id="sk-create-page">
                        <div className="group-description-text mb-4">
                            <FaUmbrellaBeach />
                            <div className="core-text">
                                <h3>Holiday / Leave Configuration</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <LeaveRow
                                    label="Birthday Leave"
                                    enabled={birthdayLeaveEnabled}
                                    setEnabled={setBirthdayLeaveEnabled}
                                    count={birthdayLeaveCount}
                                    setCount={setBirthdayLeaveCount}
                                />
                            </div>
                            <div className="col-md-3">
                                {/* Earned Leave */}
                                <LeaveRow
                                    label="Earned Leave"
                                    enabled={earnedLeaveEnabled}
                                    setEnabled={setEarnedLeaveEnabled}
                                    count={earnedLeaveCount}
                                    setCount={setEarnedLeaveCount}
                                />
                            </div>
                            <div className="col-md-3">
                                {/* Paid Leave */}
                                <LeaveRow
                                    label="Paid Leave"
                                    enabled={paidLeaveEnabled}
                                    setEnabled={setPaidLeaveEnabled}
                                    count={paidLeaveCount}
                                    setCount={setPaidLeaveCount}
                                />
                            </div>
                            <div className="col-md-3">
                                <LeaveRow
                                    label="Maternity Leave"
                                    enabled={maternityLeaveEnabled}
                                    setEnabled={setMaternityLeaveEnabled}
                                    count={maternityLeaveCount}
                                    setCount={setMaternityLeaveCount}
                                />

                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <button
                            className="btn btn-secondary"
                            onClick={() => onBack()}
                        >
                            Back
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => onNext()}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}

/* ===============================
   Reusable Leave Row Component
================================ */

function LeaveRow({ label, enabled, setEnabled, count, setCount }) {
    return (
        <div className="border rounded p-3 mb-3">

            <div className="d-flex justify-content-between align-items-center">
                <label className="form-label mb-0">{label}</label>

                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                    />
                </div>
            </div>

            {enabled && (
                <div className="mt-2">
                    <input
                        type="number"
                        className="form-control"
                        min="0"
                        placeholder={`Enter ${label} count`}
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                    />
                </div>
            )}

        </div>
    );
}
