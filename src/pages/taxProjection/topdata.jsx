import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Taxdetail from "./taxdetail";
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import BarChart from './BarChart';
export default function TopData({data, allocationInfo ,heading ,topheader ,fullData}) {

    const [isModelOpen, setModelOpen] = useState(false);
    const [viewData, setViewData] = useState('');
    const [Heading, setHeading] = useState('');

    const formatLabel = (label) => label.replace(/([A-Z])/g, ' $1').replace('PF ', 'PF (');

    
    const handleViewClick = (key) => {
      if (key === 'Bonus') {
        fetchData('bonus')
        setHeading(key)
      } else if (key === 'Other Sources') {
        fetchData('other')
        setHeading(key)
      } else {
      }
  };

  const fetchData = async (value) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/payroll/viewOtherAllowances`, { params: { isFor: value } });
        if (response && response.data) {
            setViewData(response.data.data)
            setModelOpen(true);
        }
    } catch (error) {
    }
};
  
  const closeModal = () => {
    setModelOpen(false)
  };

    const renderSection = (sectionData, sectionTitle) => (
        <div className="container-custom-boi box" key={sectionTitle}>
            <h3>{sectionTitle}</h3>
            <h4>{sectionData.total}</h4>
            <hr />
            {Object.keys(sectionData).filter(key => key !== 'total').map(key => (
                <p key={key}>
                    <span className="label">{formatLabel(key)}</span> 
                    <span className="semi">:</span> 
                    <span className="value">{sectionData[key]} 

                {(key === 'Bonus' || key === 'Other Sources') && (
                    
                    <FaEye onClick={() => handleViewClick(key)} size={20} style={{cursor:'pointer' ,paddingLeft:'5px'}}/>
                )}
                </span>
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
                      {index < keys.length - 1 && <hr />}
                  </div>
              ))}
          </div>
      );
  };

  

    return (
      <>
      <Taxdetail isOpen={isModelOpen} closeModal={closeModal} viewData={viewData} Heading={Heading}/>
        <div className="container-custom-tax container-custom">

          {heading !=="" ?  
          <>
            <div className="text-center mb-4">
                <span className='tax-projection-heading'>{heading}</span>
            </div>

          <div className="design-only-employeeTax mb-3 row ">
            {Object.entries(topheader).map(([key, value], index) => (
              <div key={index} className="col-md-3 col-sm-6 col-xs-12">
              <div className="top-header-taxProjection mb-2">
                <h4 className='tax_value'>{value}</h4>
                <h6>{key}</h6>
                </div>
              </div>
            ))}
          </div>

          </>
          : <></> }

            <div className="payroll_emp_info_section">
                        <div className="row align-items-center emp_payroll_main">

                          {allocationInfo.map((item, index) => {
                            // Extract key and value from the object
                            const [label] = Object.keys(item);
                            const value = item[label];

                            return (
                              <div key={index}>
                                {label === "Last Appraisal" && (

                                  <div className="allownce_inerr_text">
                                    <span>{label}: {value}</span>
                                  </div>
                                )}
                                <div className="col-md-12">
                                  {label === "Employee Name" && (
                                    <h5 className="payroll_emp_in_name">{value}</h5>
                                  )}
                                </div>
                                <div className="col-md-12 payroll_emp_in_all_text">
                                  {(label === "Designation" || label === "Department") && (

                                    <p>{value}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

            <div className="row">
              <div className="col-lg-4 col-md-12 col-sm-6">
              <BarChart mygraphvalue={fullData.graph}/>
              </div>
              <div className="col-lg-8 col-md-12 col-sm-6">
                

              <div className="row">
                {Object.keys(data).filter(key => key !== 'final').map((sectionKey) => (
                  <div className="col-lg-6 col-md-12 col-sm-6" key={sectionKey}>
                    {renderSection(data[sectionKey], sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1))}
                  </div>
                ))}
                {data.final && (
                  <div className="col-lg-6 col-md-12 col-sm-6">
                    {renderFinalSection(data.final)}
                  </div>
                )}
              </div>
              </div> 
            </div>
        </div>
        </>
    );
}
