import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import SecTab from '../../Components/Employee/SecTab';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
import { format } from 'date-fns';

import Head from 'next/head';
import pageTitles from '../../../common/pageTitles';
import { fetchWithToken } from '../../Auth/fetchWithToken';
import { FaRegCheckCircle} from "react-icons/fa";
export default function User({ leaveFormdata }) {

  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formContent, setFormContent] = useState(leaveFormdata);

  console.log("formContent", formContent)

  console.log("formContent", formContent)
  const convertArrayToObject = (data) => {
    if (!Array.isArray(data) || data.length === 0 || !data[0] || !Array.isArray(data[0].fields)) {
      return {};
    }

    return data[0].fields.reduce((acc, field) => {
      if (field && field.name && field.hasOwnProperty('attributeValue')) {
        acc[field.name] = field.attributeValue;
      }
      return acc;
    }, {});
  };

  const [empInfo, setEmpInfo] = useState({});

  const [salaryStructue, setSalaryStructue] = useState([]);
  const [monthlySalary, setmonthlySalary] = useState("");


  // const calculateSalaries = (monthlySalary, salaryData) => {
  //   let basicSalary;
  // 
  //   const updatedData = salaryData.map(item => {
  //     let existingBOAwithpf, existingBOAwithoutpf;
  // 
  //     if (item.fixedamount) {
  //       existingBOAwithpf = parseFloat(item.fixedamount).toFixed(2);
  //       existingBOAwithoutpf = parseFloat(item.fixedamount).toFixed(2);
  //     } else {
  //       const percentageWithPf = parseFloat(item.pfyes) / 100;
  //       const percentageWithoutPf = parseFloat(item.pfno) / 100;
  // 
  //       if (item.name === "basicSalary") {
  //         basicSalary = parseFloat(monthlySalary) * percentageWithPf;
  //         existingBOAwithpf = basicSalary.toFixed(2);
  //         existingBOAwithoutpf = basicSalary.toFixed(2);
  //       } else if (item.name === "DA+HRA") {
  //         existingBOAwithpf = (basicSalary * 0.4).toFixed(2);
  //         existingBOAwithoutpf = (basicSalary * 0.4).toFixed(2);
  //       } else if (item.name === "projectAllowance") {
  //         existingBOAwithpf = (parseFloat(monthlySalary) * percentageWithPf).toFixed(2);
  //         existingBOAwithoutpf = (parseFloat(monthlySalary) * percentageWithoutPf).toFixed(2);
  //       } else if (item.name === "pfemployee" || item.name === "pfCompany") {
  //         existingBOAwithpf = (basicSalary  * percentageWithPf).toFixed(2);
  //         existingBOAwithoutpf = (basicSalary  * percentageWithoutPf).toFixed(2);
  //       } else {
  //         existingBOAwithpf = (parseFloat(monthlySalary) * percentageWithPf).toFixed(2);
  //         existingBOAwithoutpf = (parseFloat(monthlySalary) * percentageWithoutPf).toFixed(2);
  //       }
  //     }
  // 
  //     return {
  //       ...item,
  //       existingBOAwithpf,
  //       existingBOAwithoutpf,
  //     };
  //   });
  // 
  //   // Calculate total monthly with and without PF
  //   let totalMonthlyWithPf = 0;
  //   let totalMonthlyWithoutPf = 0;
  // 
  //   updatedData.forEach(item => {
  //     if (item.isEditable !== false && item.name !== 'specialAllowance') {
  //       totalMonthlyWithPf += parseFloat(item.existingBOAwithpf);
  //       totalMonthlyWithoutPf += parseFloat(item.existingBOAwithoutpf);
  //     }
  //   });
  // 
  //   totalMonthlyWithPf = totalMonthlyWithPf.toFixed(2);
  //   totalMonthlyWithoutPf = totalMonthlyWithoutPf.toFixed(2);
  // 
  //   // Update 'otherAllowance' with the remaining amount
  //   updatedData.forEach(item => {
  //     if (item.name === "specialAllowance") {
  //       item.existingBOAwithpf = (parseFloat(monthlySalary) - totalMonthlyWithPf).toFixed(2);
  //       item.existingBOAwithoutpf = (parseFloat(monthlySalary) - totalMonthlyWithoutPf).toFixed(2);
  //     }
  //   });
  // 
  //   // Update total monthly and annual salary
  //   totalMonthlyWithPf = 0;
  //   totalMonthlyWithoutPf = 0;
  // 
  //   updatedData.forEach(item => {
  //     if (item.isEditable !== false) {
  //       totalMonthlyWithPf += parseFloat(item.existingBOAwithpf);
  //       totalMonthlyWithoutPf += parseFloat(item.existingBOAwithoutpf);
  //     }
  //   });
  // 
  //   updatedData.forEach(item => {
  //     if (item.name === "totalMonthlySalary") {
  //       item.existingBOAwithpf = totalMonthlyWithPf.toFixed(2);
  //       item.existingBOAwithoutpf = totalMonthlyWithoutPf.toFixed(2);
  //     }
  // 
  //     if (item.name === "totalAnnualSalary") {
  //       item.existingBOAwithpf = (totalMonthlyWithPf * 12).toFixed(2);
  //       item.existingBOAwithoutpf = (totalMonthlyWithoutPf * 12).toFixed(2);
  //     }
  //   });
  // 
  //   return updatedData;
  // };
  //
  // useEffect(() => {
  //   const updatedSalaryData = calculateSalaries(monthlySalary, data.initialSalaryData);
  //   setSalaryStructue(updatedSalaryData)
  // }, [monthlySalary]);

  const [showtable, setShowtable] = useState(true);

    const revisedSalarieswithoutpf = (monthlySalary, salaryData) => {

    let basicSalary;
    let medicalAllowance = 1600;
    let conveyanceAllowance = 1250;
    let daHRA;
    let projectAllowances;

    const updatedData = salaryData.map(item => {
      let revisedBOA;

      if (item.fixedamount) {
        revisedBOA = parseFloat(item.fixedamount).toFixed(2);
      } else {
        const percentageWithoutPf = parseFloat(item.pfno) / 100;

        if (item.name === "basicSalary") {
          basicSalary = parseFloat(monthlySalary) * percentageWithoutPf;
          revisedBOA = basicSalary.toFixed(2);
        } else if (item.name === "daHRA") {
          daHRA = (basicSalary * 0.4).toFixed(2);
          revisedBOA = daHRA;
        } else if (item.name === "projectAllowances") {
          projectAllowances = (parseFloat(monthlySalary) * percentageWithoutPf).toFixed(2);
          revisedBOA = projectAllowances;
        } else if (item.name === "pfEmployee" || item.name === "pfcompany") {
          revisedBOA = (basicSalary * percentageWithoutPf).toFixed(2);
        } else {
          revisedBOA = (parseFloat(monthlySalary) * percentageWithoutPf).toFixed(2);
        }
      }

      return {
        ...item,
        revisedBOA,
      };
    });

    // Calculate total monthly with and without PF
    let totalMonthlyWithoutPf = 0;

    updatedData.forEach(item => {
      if (item.isEditable !== false && item.name !== 'specialAllowance') {
        totalMonthlyWithoutPf += parseFloat(item.revisedBOA);

      }
    });

    totalMonthlyWithoutPf = totalMonthlyWithoutPf.toFixed(2);


    // Update 'otherAllowance' with the remaining amount
    updatedData.forEach(item => {
      if (item.name === "specialAllowance") {
        item.revisedBOA = (parseFloat(monthlySalary) - totalMonthlyWithoutPf).toFixed(2);
      }
    });
    // Check if "specialAllowance" is negative or less than 0
    updatedData.forEach(item => {
      if (item.name === "specialAllowance") {
        let specialAllowanceValue = parseFloat(item.revisedBOA);
        if (specialAllowanceValue < 0) {

          // Adjust "projectAllowances" and set "specialAllowance" to 0
          let totalAllowances = medicalAllowance + conveyanceAllowance + basicSalary + parseFloat(daHRA);
          let adjustedProjectAllowances = parseFloat(monthlySalary) - totalAllowances;
          updatedData.forEach(adjustedItem => {
            if (adjustedItem.name === "projectAllowances") {
              adjustedItem.revisedBOA = adjustedProjectAllowances.toFixed(2);
            }
          });

          item.revisedBOA = "0.00"; // Set "specialAllowance" to 0
        }
      }
    });
    // Update total monthly and annual salary
    totalMonthlyWithoutPf = 0;

    updatedData.forEach(item => {
      if (item.isEditable !== false) {
        totalMonthlyWithoutPf += parseFloat(item.revisedBOA);
      }
    });

    updatedData.forEach(item => {
      if (item.name === "totalMonthlySalary") {
        item.revisedBOA = totalMonthlyWithoutPf.toFixed(2);
      }

      if (item.name === "totalAnnualSalary") {
        item.revisedBOA = (totalMonthlyWithoutPf * 12).toFixed(2);
      }
    });

    return updatedData;
  };
  const revisedSalarieswithpf = (monthlySalary, salaryData) => {
    let basicSalary;
    let medicalAllowance = 1600;
    let conveyanceAllowance = 1250;
    let daHRA;
    let projectAllowances;
    let pfEmployee;
    let pfcompany;

    const updatedData = salaryData.map(item => {
      let revisedBOA;

      if (item.fixedamount) {
        revisedBOA = parseFloat(item.fixedamount).toFixed(2);
      } else {
        const percentageWithPf = parseFloat(item.pfyes) / 100;

        if (item.name === "basicSalary") {
          basicSalary = parseFloat(monthlySalary) * percentageWithPf;
          revisedBOA = basicSalary.toFixed(2);
        } else if (item.name === "daHRA") {
          daHRA = (basicSalary * 0.4).toFixed(2);
          revisedBOA = daHRA;
        } else if (item.name === "projectAllowances") {
          revisedBOA = (parseFloat(monthlySalary) * percentageWithPf).toFixed(2);
        } else if (item.name === "pfEmployee") {
          pfEmployee = (basicSalary * percentageWithPf).toFixed(2);
          revisedBOA = pfEmployee;
        }  else if (item.name === "pfcompany") {
          pfcompany = (basicSalary * percentageWithPf).toFixed(2);
          revisedBOA = pfcompany;
        }else {
          revisedBOA = (parseFloat(monthlySalary) * percentageWithPf).toFixed(2);
        }
      }

      return {
        ...item,
        revisedBOA,
      };
    });

    // Calculate total monthly with and without PF
    let totalMonthlyWithPf = 0;

    updatedData.forEach(item => {
      if (item.isEditable !== false && item.name !== 'specialAllowance') {
        totalMonthlyWithPf += parseFloat(item.revisedBOA);
      }
    });

    totalMonthlyWithPf = totalMonthlyWithPf.toFixed(2);

    // Update 'otherAllowance' with the remaining amount
    updatedData.forEach(item => {
      if (item.name === "specialAllowance") {
        item.revisedBOA = (parseFloat(monthlySalary) - totalMonthlyWithPf).toFixed(2);
      }
    });
    // Check if "specialAllowance" is negative or less than 0
    updatedData.forEach(item => {
      if (item.name === "specialAllowance") {
        let specialAllowanceValue = parseFloat(item.revisedBOA);
        if (specialAllowanceValue < 0) {

          // Adjust "projectAllowances" and set "specialAllowance" to 0
          console.log("pfEmployee", pfEmployee)
          console.log("pfcompany", pfcompany)
          let totalAllowances = medicalAllowance + conveyanceAllowance + basicSalary + parseFloat(daHRA) + parseFloat(pfEmployee) + parseFloat(pfcompany);
          console.log("totalAllowances", totalAllowances)
          let adjustedProjectAllowances = parseFloat(monthlySalary) - totalAllowances;
          updatedData.forEach(adjustedItem => {
            if (adjustedItem.name === "projectAllowances") {
              adjustedItem.revisedBOA = adjustedProjectAllowances.toFixed(2);
            }
          });

          item.revisedBOA = "0.00"; // Set "specialAllowance" to 0
        }
      }
    });
    // Update total monthly and annual salary
    totalMonthlyWithPf = 0;

    updatedData.forEach(item => {
      if (item.isEditable !== false) {
        totalMonthlyWithPf += parseFloat(item.revisedBOA);
      }
    });

    updatedData.forEach(item => {
      if (item.name === "totalMonthlySalary") {
        item.revisedBOA = totalMonthlyWithPf.toFixed(2);
      }

      if (item.name === "totalAnnualSalary") {
        item.revisedBOA = (totalMonthlyWithPf * 12).toFixed(2);
      }
    });

    return updatedData;
  };
  
  const handleIncrementChange = (value, isEligibleForPF) => {
    const newIncrement = parseFloat(value);
    const incrementAmount = (monthlySalary / 100) * newIncrement;
    const newSalary = monthlySalary + incrementAmount;
    if (isEligibleForPF === false) {
      const updatedSalaryData = revisedSalarieswithoutpf(newSalary, salaryStructue)
      setSalaryStructue(updatedSalaryData)
    } else {
      const updatedSalaryData = revisedSalarieswithpf(newSalary, salaryStructue)
      setSalaryStructue(updatedSalaryData)
    }
  }
  const handleIncrementMonthChange = (value, isEligibleForPF) => {
    const newSalary = value;
    if (isEligibleForPF === false) {
      const updatedSalaryData = revisedSalarieswithoutpf(newSalary, salaryStructue)
      setSalaryStructue(updatedSalaryData)
    } else {
      const updatedSalaryData = revisedSalarieswithpf(newSalary, salaryStructue)
      setSalaryStructue(updatedSalaryData)
    }
  }
  const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
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
      if (convertedData.salaryamount === "") {
        //setmonthlySalary(0)
        handleIncrementMonthChange(0, convertedData.isEligibleForPF)
      } else {
        handleIncrementMonthChange(currentvalue, convertedData.isEligibleForPF)
      }

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

      if (convertedData.appraisalPercent !== "No") {
        if (convertedData.percentageIncreament === "") {
          handleIncrementChange(0, convertedData.isEligibleForPF)
        } else {
          handleIncrementChange(convertedData.percentageIncreament, convertedData.isEligibleForPF)
        }
      } else {
        handleIncrementChange(0, convertedData.isEligibleForPF)
      }
    }
    console.log("FormData", convertedData);
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
  const [error, setError] = useState(null);
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
if(response.data.errorMessage){
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

      setError(error.message || 'Failed to fetch options');
    }
  };

  useEffect(() => {
    if (empInfo && empInfo.idEmployee) {
      fetchOptions();
    }
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

                            <SecTab AdduserContent={formContent} pagename={"create_allowance"} getsubmitformdata={getsubmitformdata} loaderSubmitButton={SubmitButtonLoading}/>
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