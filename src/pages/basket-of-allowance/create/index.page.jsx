/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../../Auth/AddAuthorization';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import SecTab from '../../Components/Employee/SecTab';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
import { format } from 'date-fns';

import Head from 'next/head';
import pageTitles from '../../../common/pageTitles';
import { fetchWithToken } from '../../Auth/fetchWithToken';
import { FaRegCheckCircle } from "react-icons/fa";
export default function User({ leaveFormdata }) {

  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formContent, setFormContent] = useState(leaveFormdata);

  const convertArrayToObject = (data) => {
    if (!Array.isArray(data) || data.length === 0 || !data[0] || !Array.isArray(data[0].fields)) {
      return {};
    }

    return data[0].fields.reduce((acc, field) => {
      // eslint-disable-next-line no-prototype-builtins
      if (field && field.name && field.hasOwnProperty('attributeValue')) {
        acc[field.name] = field.attributeValue;
      }
      return acc;
    }, {});
  };

  const [empInfo, setEmpInfo] = useState({});

  const [salaryStructue, setSalaryStructue] = useState([]);
  const [monthlySalary, setmonthlySalary] = useState("");
  const [showtable, setShowtable] = useState(true);
  const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
  
  const fetchcalculateValue = async (convertedData) => {
    const { idEmployee, applicableFrom, currencyType, ...rest } = convertedData;

    const hasOtherValues = Object.values(rest).some(
      val => val !== "" && val !== null && val !== undefined
    );
    if (idEmployee && applicableFrom && currencyType && hasOtherValues) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
       const formattedData = Object.fromEntries(
        Object.entries(convertedData).map(([key, value]) => {
          if (typeof value === "boolean") {
            return [key, value ? "Yes" : "No"];
          }
          return [key, value];
        })
      );
      const response = await axiosJWT.get(`${apiUrl}/payroll/calculateBoa`, {
        params: formattedData
      });
        if (response) {
          const data = response.data.data
          setSalaryStructue(data.initialSalaryData)
        }

      } catch (error) {
console.error(error)
      }
    }
  };
  const getsubmitformdata = async (value) => {
    const convertedData = convertArrayToObject(value.section);
    setEmpInfo(convertedData)
    const currentvalue = parseFloat(convertedData.salaryamount);
    setmonthlySalary(currentvalue)

    if (convertedData.appraisalPercent === "No") {
      if (convertedData.appraisalPercent === "No") {
        formContent.section[0].Subsection[0].fields.forEach(field => {
          if (field.name === 'salaryamount') {
            field.isDisabled = false;
          }
        });
        setFormContent({ ...formContent });
      }
      if (convertedData.appraisalPercent === "No") {
        formContent.section[0].Subsection[0].fields.forEach(field => {
          if (field.name === 'percentageIncreament') {
            field.isDisabled = true;
            field.value = 0;
          }
        });
        setFormContent({ ...formContent });
      }
      fetchcalculateValue(convertedData)

    } else {

      if (convertedData.appraisalPercent !== "No") {
        formContent.section[0].Subsection[0].fields.forEach(field => {
          if (field.name === 'salaryamount') {
            field.isDisabled = true;
            field.value = monthlySalary;
          }
        });
        setFormContent({ ...formContent });
      }

      if (convertedData.appraisalPercent !== undefined) {
        formContent.section[0].Subsection[0].fields.forEach(field => {
          if (field.name === 'percentageIncreament') {
            field.isDisabled = !convertedData.appraisalPercent;
          }
        });
        setFormContent({ ...formContent });
      }

      fetchcalculateValue(convertedData)
    }
  };

  const currentDate = new Date(); // Get the current date
  const currentMonth = format(currentDate, 'yyyy-MM'); // Format the current date
  const validateSalarayDetail = (salarayDetail) => {
    return salarayDetail.every((item) => {
      if (item.name === "conveyanceAllowance" || item.name === "medicalAllowances") {
        return item.fixedamount !== "";
      } else {
        return item.revisedBOA !== "";
      }
    });
  };
  const [validationErrors, setValidationErrors] = useState("");
  const onClose = async () => {
    setValidationErrors("")
  }
  const handleDataSave = async () => {
    setSubmitButtonLoading(true)
    const salarayDetail = salaryStructue.map((item) => {
      const { name, currentAllowance, revisedBOA, fixedamount } = item;
      return { name, currentAllowance, revisedBOA, fixedamount };
    });
    const isValid = validateSalarayDetail(salarayDetail);

    if (!isValid) {
      // Show an error message or alert
      setValidationErrors("Please fill in all required fields in the salary detail section.");
      window.scrollTo(0, 0);
      return;
    }
    const payload = {
      "idEmployee": empInfo.idEmployee,
      "applicableFrom": empInfo && empInfo.applicableFrom !== "" ? empInfo.applicableFrom : currentMonth,
      "isEligibleForPF": empInfo.isEligibleForPF,
      "typeOfAppraisal": empInfo.appraisalPercent,
      "percentageIncreament": empInfo.percentageIncreament,
      "salarayDetail": salarayDetail,
      "currencyType": empInfo.currencyType,
    }
    try {
      const response = await axiosJWT.post(`${apiUrl}/payroll/addBoa`, payload);

      if (response) {
        const message = 'You have successfully <strong>add Allowance </strong>!';
        toast.success(({ id }) => (
          <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
            <FaRegCheckCircle style={{
              fontSize: '35px',
              marginRight: '10px',
              color: '#4caf50'
            }} />
            <span dangerouslySetInnerHTML={{ __html: message }}></span>
            <button
              onClick={() => toast.dismiss(id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4caf50',
                marginLeft: 'auto',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              <FaTimes />
            </button>
          </div>
        ), {
          icon: null, // Disable default icon
          duration: 7000,
          style: {
            border: '1px solid #4caf50',
            padding: '8px',
            color: '#4caf50',
          },
        });
        router.push(`/basket-of-allowance`);
        setSubmitButtonLoading(false)
      }
    } catch (error) {
      const errormessage = 'Error connecting to the backend. Please try after Sometime.';
      toast.success(({ id }) => (
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
          <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
          <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
          <button
            onClick={() => toast.dismiss(id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF000F',
              marginLeft: 'auto',
              cursor: 'pointer'
            }}
          >
            <FaTimes />
          </button>
        </div>
      ), {
        icon: null, // Disable default icon
        duration: 7000,
        style: {
          border: '1px solid #FF000F',
          padding: '8px',
          color: '#FF000F',
        },
      });
      console.error('Error:', error);
      setSubmitButtonLoading(false)
    }
  };

  const handleDataCancel = async () => {
    router.push(`/basket-of-allowance`);
  }
  const [tableHeader, setTableHeader] = useState([]);
  const [buttonType, setButtonType] = useState([]);
  const [showButton, setshowButton] = useState(false);
  const [lastAppraisalshow, setlastAppraisalshow] = useState(false);
  const [lastAppraisal, setlastAppraisal] = useState("");
  const fetchOptions = async () => {
    setValidationErrors("")
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/payroll/getBoaByEmployee`, {
        params: {
          idEmployee: empInfo.idEmployee,
          applicableFrom: empInfo && empInfo.applicableFrom !== "" ? empInfo.applicableFrom : currentMonth
        }
      });
      if (response) {
        if (response.data.errorMessage) {
          setValidationErrors(response.data.errorMessage)
        }
        const data = response.data.data
        const dataTotal = response.data.data.empData.totalAmmount
        setmonthlySalary(dataTotal)
        const datappraisal = response.data.data.empData.typeAppraisal
        const isEligiblePF = response.data.data.empData.isEligiblePF
        setTableHeader(data.headers)
        setSalaryStructue(data.initialSalaryData)
        setlastAppraisal(data.empData.lastAppraisal)
        setShowtable(true)
        setlastAppraisalshow(true)
        setshowButton(true)
        setButtonType(data.button)

        formContent.section[0].Subsection[0].fields.forEach(field => {
          if (field.name === 'salaryamount') {
            field.value = dataTotal || 0;
            if (datappraisal === "" || datappraisal === "No") {
              field.isDisabled = false; // Set isDisabled to false if datappraisal is empty
            }
          }
          if (field.name === 'appraisalPercent') {
            field.value = datappraisal;
          }
          if (field.name === 'isEligibleForPF') {
            field.value = isEligiblePF;
          }
        });
        setFormContent({ ...formContent });
      }

    } catch (error) {
console.error(error)
    }
  };

  useEffect(() => {
    if (empInfo && empInfo.idEmployee) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchOptions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empInfo.idEmployee, empInfo.applicableFrom]);

  useEffect(() => {
    const mainElement = document.querySelector('body');
    if (mainElement) {
      mainElement.setAttribute('id', 'basketOfAll-module');
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute('id');
      }
    };
  }, []);
  return (
    <>
      <Head>
        <title>{pageTitles.BasketOfAllowanceAdd}</title>
        <meta name="description" content={pageTitles.BasketOfAllowanceAdd} />
      </Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Add Basket Of Allowance"} />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="oxyem_basketallownce_page">
                            {validationErrors !== "" ? (<div className="alert alert-danger alert-dismissible fade show" role="alert">{validationErrors}  <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></div>) : (null)}
                            <div className='allownce_inerr_text'>
                              {lastAppraisalshow ? (
                                <>
                                  {lastAppraisal && lastAppraisal !== "" ? (
                                    <span>Last appraisal  : {lastAppraisal}</span>
                                  ) : (
                                    <span> New Employee</span>
                                  )}
                                </>

                              ) : (null)}

                            </div>

                            <SecTab AdduserContent={formContent} pagename={"create_allowance"} getsubmitformdata={getsubmitformdata} loaderSubmitButton={SubmitButtonLoading} />
                            {showtable ? (
                              <div className='allownce_table'>
                                <table className="table-input-oxyem">
                                  <thead>
                                    <tr className='heading'>
                                      {tableHeader.map((header, index) => (
                                        <th key={index} scope="col">{header}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {salaryStructue.map((row, index) => (
                                      <tr
                                        key={index}
                                        className={
                                          row.name === "totalAnnualSalary" ? 'annualSalary' :
                                            row.name === "totalMonthlySalary" ? 'monthlySalary' :
                                              ''
                                        }
                                      >
                                        <td className='title'>{row.description}</td>
                                        <td>{row.currentBOA}</td>
                                        <td className='total_count'>
                                          {row.isEditable ? (
                                            <input type="text" className="form-control" value={row.revisedBOA} readOnly />
                                          ) : (
                                            row.revisedBOA
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (null)}
                            {showButton ? (

                              SubmitButtonLoading ? (
                                <div className="text-end w-100 oxyem-timesheet-popup-button">
                                  <button className="btn btn-primary" type="submit" disabled={SubmitButtonLoading}>
                                    <div className="spinner">
                                      <div className="bounce1"></div>
                                      <div className="bounce2"></div>
                                      <div className="bounce3"></div>
                                    </div>
                                  </button>
                                </div>
                              ) : (
                                <div className="text-end w-100 oxyem-timesheet-popup-button">
                                  {buttonType.map((btn, index) => (
                                    <button
                                      key={index} // Add a unique key for each button
                                      type={btn.type}
                                      className={`btn mx-2 ${btn.value === "cancel" ? "btn-oxyem" : "btn-primary"}`}
                                      disabled={!btn.isEnabled}
                                      onClick={
                                        btn.value === "submit"
                                          ? handleDataSave
                                          : btn.value === "cancel"
                                            ? handleDataCancel
                                            : null
                                      }
                                    >
                                      {btn.value}
                                    </button>
                                  ))}
                                </div>
                              )
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div >
      <Toaster
        position="top-right"
        reverseOrder={false}

      />
    </>

  );
}
export async function getServerSideProps(context) {

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const leaveFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'basketAllowance' }, context);
  return {
    props: { leaveFormdata },
  }
}