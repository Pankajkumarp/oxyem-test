import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { Toaster, toast } from 'react-hot-toast';
import moment from 'moment-timezone';
import SecTab from '../Components/Employee/SecTab';
import { FaRegClock, FaTimes, FaRegCheckCircle} from "react-icons/fa";
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function updateProjection({ updateProjectionData }) {
    const [FormInputData, setFormInputData] = useState(updateProjectionData);
    const [financialTable, setFinancialTable] = useState({});

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [errorMessage, setErrorMessage] = useState("");
    const [showButton, setshowButton] = useState(false);
    const mergeFormWithResponse = (form, finalProjection) => {
        // Function to update form fields with corresponding API data
        const updateFieldsWithAPIData = (fields, apiData) => {
            return fields.map(field => {
                // Check if the field is 'idProjection' and update its value using the 'id' from the 'Income' array
                if (field.name === 'idProjection') {
                    // Find the 'id' in the 'Income' array
                    const idData = apiData.find(data => data.description === 'id');

                    if (idData) {
                        return {
                            ...field,
                            value: idData.amount // Set the 'id' as the value
                        };
                    }
                }

                // Update isDisabled to false if editable is true
                if (field.editable) {
                    field = {
                        ...field,
                        isDisabled: false
                    };
                }

                // Find the matching data in API response based on description
                const match = apiData.find(data => data.description === field.label);

                if (match) {
                    return {
                        ...field,
                        value: match.amount // Update the value with API response amount
                    };
                }

                return field; // Return the field as is if no match is found
            });
        };

        // Map through each section and subsection of the form
        const updatedForm = form.map(section => {
            const updatedSubsections = section.Subsection.map(subsection => {
                // Find matching data in finalProjection
                const apiData = finalProjection[subsection.name];

                if (apiData) {
                    // Update the fields with matching API data
                    return {
                        ...subsection,
                        fields: updateFieldsWithAPIData(subsection.fields, apiData)
                    };
                }

                return subsection; // Return subsection as is if no matching API data is found
            });

            return {
                ...section,
                Subsection: updatedSubsections
            };
        });

        return updatedForm;
    };

    const fetchData = async (empId) => {
        setshowButton(false)
        try {
            const response = await axiosJWT.post(`${apiUrl}/payroll/taxProjection`, {
                "idEmployee": empId,
                "financialYear": getCurrentFinancialYear(),
				"isFor":"edit"
            });

            if (response && response.data) {
                const finalProjection = response.data.data.finalProjection;

                if (finalProjection && Object.keys(finalProjection).length > 0) {
                    setFinancialTable(finalProjection);
                    setErrorMessage("");
                    const updatedFormData = mergeFormWithResponse(FormInputData.section, finalProjection);
                    setFormInputData(prevState => ({
                        ...prevState,
                        section: updatedFormData
                    }));

                    setshowButton(true)
                } else {
                    setFormInputData(updateProjectionData)
                    setErrorMessage("No financial data available");
                    setshowButton(false)
                }
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    // Get the current financial year dynamically
    const getCurrentFinancialYear = () => {
        const currentDate = moment();
        const currentYear = currentDate.year();
        return currentDate.month() >= 3 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;
    };

    const handleGetEmpDetail = async (value) => {

        fetchData(value ? value.value : "")
    };

    const [taxDeduction, settaxDeduction] = useState({});

    const handleGetproject = async (value) => {
        const extractedData = {
            idEmployee: value.idEmployee ? value.idEmployee.value : "",
            incomeFromHouse: value.incomeFromHouse,
            incomeFromBusiness: value.incomeFromBusiness,
            capitalGains: value.capitalGains,
            incomeFromOtherSource: value.incomeFromOtherSource
        };
        settaxDeduction(extractedData);
    };

    const handlegetUpdatedata = async () => {
        try {
            const response = await axiosJWT.post(`${apiUrl}/payroll/taxProjection`, {
                "idEmployee": taxDeduction.idEmployee,
                "financialYear": getCurrentFinancialYear(),
                "incomeFromHouse": taxDeduction.incomeFromHouse,
                "incomeFromBusiness": taxDeduction.incomeFromBusiness,
                "capitalGains": taxDeduction.capitalGains,
                "incomeFromOtherSource": taxDeduction.incomeFromOtherSource,
            });

            if (response && response.data) {
                const finalProjection = response.data.data.finalProjection;

                if (finalProjection && Object.keys(finalProjection).length > 0) {
                    setFinancialTable(finalProjection);
                    setErrorMessage("");
                    const updatedFormData = mergeFormWithResponse(FormInputData.section, finalProjection);
                    setFormInputData(prevState => ({
                        ...prevState,
                        section: updatedFormData
                    }));
                } else {

                    setErrorMessage("No financial data available");
                }
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const convertToExpectedFormat = (value, financialYear) => {
        const fields = value.section[0].fields;
        const result = fields.reduce((acc, field) => {
            acc[field.name] = field.attributeValue;
            return acc;
        }, {});

        result.financialYear = financialYear;

        return result;
    };
    const getsubmitformdata = async (value) => {
        const financialYear = getCurrentFinancialYear()
        const convertedData = convertToExpectedFormat(value, financialYear);
        try {
            const response = await axiosJWT.post(`${apiUrl}/payroll/updateTaxProjection`, convertedData);
            const message = 'You have successfully <strong>Update </strong> Tax Projection!';
            const errormessage = 'Error connecting to the backend. Please try after Sometime.';
            if (response && response.data) {
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
                setFormInputData(updateProjectionData)
            }else{
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <FaRegCheckCircle style={{
							fontSize: '35px',
							marginRight: '10px',
							color: '#4caf50'
						}} />
                        <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
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
                        border: '1px solid #FF000F',
                        padding: '8px',
                        color: '#FF000F',
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    return (
        <>
        <Head>
        <title>{pageTitles.PayrollTaxDeduction}</title>
        <meta name="description" content={pageTitles.PayrollTaxDeduction} />
    </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid" id="taxprojection">
                        <Breadcrumbs maintext={"Tax Deduction"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                <div className="card flex-fill comman-shadow oxyem-index">
                                    <div className="center-part">
                                        <div className="card-body oxyem-mobile-card-body">
                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                {errorMessage !== "" ? (
                                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">{errorMessage}</div>
                                                ) : (null)}
                                                {showButton ? (
                                                    <div className="text-end w-100">
                                                        <div className="row align-items-center notify_with_button">
                                                            <div className="col-md-7">
                                                                <div className="alert alert-warning alert-dismissible fade show" role="alert">Please click on calculate button to get the latest projection based on input value</div>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <button onClick={handlegetUpdatedata} className="btn btn-primary">Calculate</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (null)}

                                                <SecTab AdduserContent={FormInputData} getsubmitformdata={getsubmitformdata} handleGetEmpDetail={handleGetEmpDetail} pagename={"updateProjection"} handleGetproject={handleGetproject} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
export async function getServerSideProps(context) {

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const updateProjectionData = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'updateProjection' }, context);
    return {
        props: { updateProjectionData },
    }
}