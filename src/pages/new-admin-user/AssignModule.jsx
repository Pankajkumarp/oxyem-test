import { MdGroupAdd } from "react-icons/md";

const MODULES = [
  { id: "attendance", label: "Attendance" },
  { id: "leave", label: "Leave" },
  { id: "holiday", label: "Holiday" },
  { id: "payroll", label: "Payroll" },
  { id: "invoice", label: "Invoice" },
  { id: "performance", label: "Performance" },
  { id: "project", label: "Project" },
  { id: "employeeDashboard", label: "Employee Dashboard" }
];

export default function AssignModule({
  moduleIds,
  setModuleIds,
  onBack,
  onNext
}) {
  const handleChange = (moduleId) => {
    setModuleIds((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <div className="card flex-fill comman-shadow oxyem-index">
      <div className="center-part">
        <div className="card-body">
          <div className="col-12 mx-auto card border" id="sk-create-page">

            <div className="group-description-text mb-4">
              <MdGroupAdd />
              <div className="core-text">
                <h3>Assign Modules</h3>
                <p>Select modules to assign to this group</p>
              </div>
            </div>

            <div className="row">
              {MODULES.map((module) => (
                <div key={module.id} className="col-md-3 mb-3">
                  <div className="form-check module-checkbox">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={module.id}
                      checked={moduleIds.includes(module.id)}
                      onChange={() => handleChange(module.id)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={module.id}
                    >
                      {module.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button className="btn btn-secondary" onClick={onBack}>
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={onNext}
              >
                Next
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
