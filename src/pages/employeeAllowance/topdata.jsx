import React from 'react';
export default function TopData({data, allocationInfo,Heading}) {
    const formatLabel = (label) => label.replace(/([A-Z])/g, ' $1').replace('PF ', 'PF (');
    const renderSection = (sectionData, sectionTitle) => (
        <div className="container-custom-boi box" key={sectionTitle}>
            <h3>{sectionTitle}</h3>
            <h4>{sectionData.total}</h4>
            <hr />
            {Object.keys(sectionData).filter(key => key !== 'total').map(key => (
                <p key={key}>
                    <span className="label">{formatLabel(key)}</span> 
                    <span className="semi">:</span> 
                    <span className="value">{sectionData[key]}</span>
                </p>
            ))}
        </div>
    );

    const renderFinalSection = (finalData) => {
      const keys = Object.keys(finalData);
      return (
          <div className="container-custom-boi box final" id='boi-final-box' key="final">
              {keys.map((key, index) => (
                  <div key={key}>
                      <h3>{key.replace(/([A-Z])/g, ' $1')}</h3>
                      <h4 className="total">{finalData[key]}</h4>
                      {index < keys.length - 1 && <hr />} {/* Render <hr /> for all items except the last one */}
                  </div>
              ))}
          </div>
      );
  };
  
    return (
        <div className="container-custom-boi container-custom">
          <div className="row">
            <div className="col-md-4">
            {allocationInfo.length === 0 ? (
            <p></p>
            ) : (
            <div className="container-custom-boi box-empinfo">
              {Heading !== "" ?
              <div className="text-center">
                <p className='boi-view-heading'>{Heading}</p>
              </div>
            : <></>}
            {allocationInfo
              .sort((a, b) => {
                const aLabel = Object.keys(a)[0];
                const bLabel = Object.keys(b)[0];
                if (aLabel === "Last Appraisal") return -1;
                if (bLabel === "Last Appraisal") return 1;
                  return 0;
              })
              .map((item, index) => {
              // Extract key and value from the object
              const [label] = Object.keys(item);
              const value = item[label];

              return (
                <div key={index}>
                    {label === "Last Appraisal" && (
                      <div className="allownce_inerr_text-boi mb-3">
                        <span>BOA Effective: {value}</span>
                      </div>
                    )}
                  <div className="col-md-12 payroll_emp_in_name">
                    {label === "Employee Name" && (
                      <h5 className="">{value}</h5>
                    )}
                  </div>
                  <div className="col-md-12 payroll_emp_in_all_text">
                    {(label === "Designation" || label === "Department") && (
                      <h6>{value}</h6>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
      )}

            
        </div>

            <div className="col-md-8">
              <div className="row">
                {Object.keys(data).filter(key => key !== 'final').map((sectionKey) => (
                  <div className="col-md-6" key={sectionKey}>
                    {renderSection(data[sectionKey], sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1))}
                  </div>
                ))}
                {data.final && (
                  <div className="col-md-6">
                    {renderFinalSection(data.final)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    );
}