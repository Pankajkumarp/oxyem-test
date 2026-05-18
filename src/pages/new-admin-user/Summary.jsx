import React from "react";

export default function Summary({
  company,
  legal,
  leave,
  modules,
  onBack,
  issummary,
  onSubmit,
}) {
  return (
    <div className="card flex-fill comman-shadow oxyem-index summary-new-user">
      <div className="card-body">
        <h3 className="mb-4">Review & Submit</h3>
        <section className="mb-4 custom-summary-section">
          <h5 className="mb-4">🏢 Company Identity</h5>
          <ul className="list-unstyled">
            <li><strong>Legal Name:</strong> {company.companyLegalName}</li>
            <li><strong>Brand Name:</strong> {company.brandName || "-"}</li>
            <li><strong>Industry:</strong> {company.industry}</li>
            <li><strong>Company Type:</strong> {company.companyType}</li>
            <li><strong>Incorporation Year:</strong> {company.incorporationYear || "-"}</li>
            <li><strong>Website:</strong> {company.website || "-"}</li>
            <li><strong>Description:</strong> {company.companyDescription || "-"}</li>
            <li>
              <strong>Logo:</strong>{" "}
              {company.companyLogo ? company.companyLogo.name : "Not uploaded"}
            </li>
          </ul>
        </section>
        <section className="mb-4 custom-summary-section">
          <h5 className="mb-4">⚖️ Legal & Address</h5>
          <ul className="list-unstyled">
            <li><strong>Country:</strong> {legal.registeredCountry}</li>
            <li><strong>Registration No:</strong> {legal.registrationNumber}</li>
            <li><strong>Tax ID:</strong> {legal.taxId || "-"}</li>
            <li><strong>GST / VAT / EIN:</strong> {legal.gstVatEin || "-"}</li>
            {legal.pan && <li><strong>PAN:</strong> {legal.pan}</li>}
            <li><strong>Address:</strong> {legal.registeredAddress}</li>
            <li>
              <strong>Location:</strong>{" "}
              {legal.city}, {legal.stateProvince} - {legal.postalCode}
            </li>
          </ul>
        </section>
        <section className="mb-4 custom-summary-section">
          <h5 className="mb-4">🌴 Leave Policy</h5>
          <ul className="list-unstyled">
            {leave.birthdayLeaveEnabled && (
              <li>🎂 Birthday Leave: {leave.birthdayLeaveCount} days</li>
            )}
            {leave.earnedLeaveEnabled && (
              <li>📅 Earned Leave: {leave.earnedLeaveCount} days</li>
            )}
            {leave.paidLeaveEnabled && (
              <li>💼 Paid Leave: {leave.paidLeaveCount} days</li>
            )}
            {leave.maternityLeaveEnabled && (
              <li>🤰 Maternity Leave: {leave.maternityLeaveCount} days</li>
            )}
          </ul>
        </section>

        <section className="mb-4 custom-summary-section">
          <h5 className="mb-4">🧩 Assigned Modules</h5>
          {modules.length > 0 ? (
            <ul>
              {modules.map((mod, i) => (
                <li key={i}><span className="text-[#16A34A] font-bold">✔</span> {mod}</li>
              ))}
            </ul>
          ) : (
            <p>No modules selected</p>
          )}
        </section>
        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button className="btn btn-success" onClick={onSubmit} disabled={!issummary}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
