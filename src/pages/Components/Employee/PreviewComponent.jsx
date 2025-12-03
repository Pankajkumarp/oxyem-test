import React from 'react';
import { IoDownloadOutline } from "react-icons/io5";

export default function PreviewComponent({ data, submitformdata, setDocuments ,loaderSubmitButton}) {

  const personalInfoSection = data.section.find(section => section.SectionName === "Personal Information");
  const personalInfoSubsection = personalInfoSection.Subsection.find(subsection => subsection.SubsectionName === "Personal Information");
  const experienceField = personalInfoSubsection.fields.find(field => field.name === "experience");
  const hasExperience = experienceField ? experienceField.value : false;

  return (
    <form onSubmit={submitformdata}>
      <div className="row">
        {data.section.map((section, index) => {
          // Skip rendering the preview section
          if (section.isPreviewtype) return null;

          // Conditionally skip the Prior Work Experience section based on the experience value
          if (section.SectionName === "Prior Work Experience" && !hasExperience) {
            return null;
          }

          if (section.isDocumentstype) {
            return (
              <div className="col-md-6 mb-4" key={index}>
                <h6>{section.SectionName}</h6>
                <table className="table align-middle mb-0 table-striped mt-3">
                  <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>Document Name</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {setDocuments.map((document, docIndex) => (
                      <tr key={docIndex}>
                        <td>{docIndex + 1}</td>
                        <td>{document.type.label}</td>
                        <td>
                          {document.files.length > 0 ? (
                            <a href={URL.createObjectURL(document.files[0])} download>
                              <IoDownloadOutline size={20} />
                            </a>
                          ) : (
                            <span>No files uploaded</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          return section.Subsection.map((subsection, subIndex) => {
            const firstName = subsection.fields.find(field => field.name === 'firstName')?.value || '';
            const middleName = subsection.fields.find(field => field.name === 'middleName')?.value || '';
            const lastName = subsection.fields.find(field => field.name === 'lastName')?.value || '';
            const experience = subsection.fields.find(field => field.name === 'experience')?.value || '';

            return (
              <div key={subIndex} className="col-md-6 mb-4">
                <div className="card profile-box flex-fill">
                  <div className="card-body">
                    <h3 className="card-title">{subsection.SubsectionName}</h3>
                    <ul className="personal-info">
                      {firstName || middleName || lastName ? (
                        <li>
                          <div className="title">Full Name</div>
                          <div className="text">{`${firstName} ${middleName} ${lastName}`.trim()}</div>
                        </li>
                      ) : null}
                      {subsection.fields.map((field, fieldIndex) => {
                        if (field.name === 'firstName' || field.name === 'middleName' || field.name === 'lastName') {
                          return null;
                        }

                        if (field.name === 'experience') {
                          return (
                            <li key={fieldIndex}>
                              <div className="title">{field.label}</div>
                              <div className="text">{experience ? 'Yes' : 'No'}</div>
                            </li>
                          );
                        }

                        if (typeof field.value === 'object' && field.value !== null) {
                          return (
                            <li key={fieldIndex}>
                              <div className="title">{field.label}</div>
                              <div className="text">{field.value.label || field.value.value}</div>
                            </li>
                          );
                        }

                        return (
                          <li key={fieldIndex}>
                            <div className="title">{field.label}</div>
                            <div className="text">{field.value !== "" ? field.value : <>&nbsp;</>}</div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>
      {loaderSubmitButton ? (
<>
<div className="float-end">
        <button type="button" className="btn btn-primary mb-2 ms-2" onClick={submitformdata}>
          <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div></button>
      </div>
</>
      ) : 
      
      <div className="float-end">
        <button type="button" className="btn btn-primary mb-2 ms-2" onClick={submitformdata}>Submit</button>
      </div>

      }
      
    </form>
  );
}
