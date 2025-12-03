
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from './NewFormSecTab.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegClock, FaTimes } from "react-icons/fa";
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
import { FaRegCheckCircle} from "react-icons/fa";
export default function addPayrollemp({ payrollForm }) {
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const data = router.query.data;
    const [showForm, setshowForm] = useState(false);
    const [AdduserContent, setAdduserContent] = useState([]);
    const [tdsAmount, setTdsAmount] = useState("");
    const [salaryAmount, setsalaryAmount] = useState("");
    const [idsalary, setIdSalary] = useState(null);

    useEffect(() => {
        // Get current month and year in the format MM/YYYY
        const currentYear = new Date().getFullYear();
        const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
        const currentMonthYear = `${currentYear}-${currentMonth}`
        // Check if applicableFrom is empty
        const updatedContent = { ...payrollForm };
        const section = updatedContent.section[0];
        const subsection = section.Subsection[0];
        const fields = subsection.fields.map(field => {
            if (field.name === 'applicableFrom' && !field.value) {
                return { ...field, value: currentMonthYear };
            }
            return field;
        });

        // Update the content
        subsection.fields = fields;
        setAdduserContent(updatedContent);
        setshowForm(true)
    }, [payrollForm]);

    const [userdetail, setUserdetail] = useState({});
    const [previewData, setPreviewData] = useState({});
    
    function extractFields(data) {
        const result = {};
        data.section.forEach(section => {
            section.fields.forEach(field => {
                result[field.name] = field.attributeValue;
            });
        });
        return result;
    }

    function extractFields(data) {
        const result = {};
        result.isWithoutActualTax = false
        result.idSalary = idsalary
        result.isFor = "NonEmployee"
       // result.employeeType = responseData.netSalary

        if(idsalary !== null && idsalary !== undefined && idsalary !== "") {
            result.isWithoutActualTax = false;
        }
        data.section.forEach(section => {
            section.fields.forEach(field => {
                result[field.name] = field.attributeValue;
            });
    
            result.deductionOtherAllowance = section.deductionOtherAllowance.map(allowance => ({
                name: allowance.name,
                attributeValue: allowance.attributeValue
            }));
    
            // Collect otherAllowance as an array
            result.otherAllowance = section.otherAllowance.map(allowance => ({
                name: allowance.name,
                attributeValue: allowance.attributeValue
            }));

        });
        return result;
    }
    
    const getsubmitformdata = async (newArray, value) => {
        console.log(newArray,value);
        const updatedArray = {
            ...newArray,
            section: newArray.section
                .filter(section => section.SectionName !== "Preview") // Exclude Preview section
                .map((section) => {
                    section.fields = section.fields.filter((field) => {
                        return field.name !== "deductionOtherAllowance" && field.name !== "otherAllowance";
                    });
                    return section;
                }),
        };
        // Mapping values
        updatedArray.section = updatedArray.section.map((section) => {
            section.deductionOtherAllowance = value.deductions;
            section.otherAllowance = value.earning;
            return section;
        });
        // Convert section values to arrays
        const result = extractFields(updatedArray);
        // Sending to API
        submitformdata(result);
    };
    

    const submitformdata = async (value) => {
        console.log(value);

        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        try {
            const response = await axiosJWT.post(`${apiUrl}/payroll/reCalculateTax`, value);
            const apiresponse = response.data || "";
            const apiresponsemessage = response.data.message || "";
            const message = apiresponsemessage;
            const errormessage = 'Error connecting to the backend. Please try after Sometime.';
    
            if (response) {
                // toast.success(({ id }) => (
                //     <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                //         <FaRegCheckCircle style={{
				//			fontSize: '35px',
				//			marginRight: '10px',
				//			color: '#4caf50'
					//	}} />
                //         <span dangerouslySetInnerHTML={{ __html: message }}></span>
                //         <button onClick={() => toast.dismiss(id)} style={{ background: 'none', border: 'none', color: '#4caf50', marginLeft: 'auto', cursor: 'pointer' }} ><FaTimes /></button>
                //     </div>
                // ), {
                //     icon: null,
                //     duration: 7000,
                //     style: { border: '1px solid #4caf50', padding: '8px', color: '#4caf50' },
                // });
                // router.push('/payrollManagement')
                setPreviewData(apiresponse.data);
                console.log(apiresponse.data);
            } else {
                // toast.error(({ id }) => (
                //     <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                //         <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                //         <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
                //         <button onClick={() => toast.dismiss(id)} style={{ background: 'none', border: 'none', color: '#FF000F', marginLeft: 'auto', cursor: 'pointer' }} > <FaTimes /></button>
                //     </div>
                // ), {
                //     icon: null,
                //     duration: 7000,
                //     style: { border: '1px solid #FF000F', padding: '8px', color: '#FF000F' },
                // });
            }
        } catch (error) {
            toast.error('Error connecting to the backend. Please try after Sometime.');
        }
    };
    
    

    const getChangessField = async (value) => {
        const filteredFields = value[0].fields.filter(item => item.name === "idEmployee" || item.name === "applicableFrom");

        const result = {};
        filteredFields.forEach(item => {
            if (item.name === "applicableFrom" && !item.value) {
                const currentYear = new Date().getFullYear();
                const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
                result[item.name] = `${currentYear}-${currentMonth}`;
            } else {
                result[item.name] = item.value && typeof item.value === 'object' ? item.value.value : item.value || "";
            }
        });
        setUserdetail(result)
    };
	const [errorMessage, seterrorMessage] = useState("");

    useEffect(() => {
        if (userdetail.idEmployee && userdetail.applicableFrom) {
            const getgraphData = async () => {
				seterrorMessage("")
                try {
                    const response = await axiosJWT.get(`${apiUrl}/payroll/getBoaWithDeductionsForSalary`, {
                        params: {
                            "idEmployee": userdetail.idEmployee,
                            "applicableMonth": userdetail.applicableFrom
                        }
                    });
                    if (response) {
						if(response.data.errorMessage){
                            seterrorMessage(response.data.errorMessage)
							window.scrollTo(0, 0);
                        }
                        const responseData = response.data.data
						if(responseData.tds){
                            setTdsAmount(responseData.tds)
                        }
                       
                        setsalaryAmount(responseData.netSalary)
                        setIdSalary(responseData.idSalary);
                        // Create a deep copy of the current AdduserContent state
                        const updatedContent = { ...AdduserContent };
                        
                        if (responseData === undefined) {
                            // Iterate over the sections and fields to update their values
                            updatedContent.section.forEach(section => {
                                section.Subsection.forEach(subsection => {
                                    subsection.fields.forEach(field => {
                                        // Skip updating the field if its name is 'idEmployee' or 'applicableMonth'
                                        if (field.name !== 'idEmployee' && field.name !== 'applicableFrom') {
                                            field.value = "0";
                                            field.isDisabled = true;
                                        }
                                    });
                                });
                            });


                            // Update the state with the modified content
                            setAdduserContent(updatedContent);
                        } else {
                            updatedContent.section.forEach(section => {
                                section.Subsection.forEach(subsection => {
                                    subsection.fields.forEach(field => {
                                        // Skip updating the field if its name is 'idEmployee' or 'applicableMonth'
                                        if (field.name !== 'idEmployee' && field.name !== 'applicableFrom') {
                                            if (field.name === 'tds') {
                                                // Check if the field's name matches a key in responseData
                                                if (responseData[field.name] !== undefined) {
                                                    // Update the value of the field with the corresponding value from responseData
                                                    field.value = responseData[field.name] || "0"; // If empty, set to "0"
                                                } else {
                                                    // If the responseData is empty or doesn't contain the key, set the value to "0"
                                                    field.value = "0";
                                                }
                                            } else {
                                                if (responseData[field.name] !== undefined) {
                                                    // Update the value of the field with the corresponding value from responseData
                                                    field.value = responseData[field.name] || "0"; // If empty, set to "0"
                                                    field.isDisabled = true;
                                                } else {
                                                    // If the responseData is empty or doesn't contain the key, set the value to "0"
                                                    field.value = "0";
                                                    field.isDisabled = true;
                                                }

                                            }
                                        }
                                    });
                                });
                            });

                            const idSalaryField = updatedContent.section[0].Subsection[0].fields.find(field => field.name === 'idSalary');
                            if (idSalaryField) {
                                idSalaryField.value = responseData.idSalary;
                            }
                            // Update the state with the modified content
                            setAdduserContent(updatedContent);
                        }
                    }
                } catch (error) {}
            };
            getgraphData();
        }
    }, [userdetail.idEmployee, userdetail.applicableFrom]);

    const onClose = async () => { seterrorMessage("") }
    const tdsoveridevalue = async (value) => { submitformdata(value); }

    return (
        <>
    <Head>
        <title>{pageTitles.PayrollAddPayroll}</title>
        <meta name="description" content={pageTitles.PayrollAddPayroll} />
    </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <Breadcrumbs maintext={"Add Payroll"} />
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="oxyem-pay-page">
													{errorMessage !== "" ? (<div className="alert alert-danger alert-dismissible fade show" role="alert">{errorMessage}  <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></div>) : (null)}
                                                        {showForm === true ? (
                                                            <SecTab
                                                                AdduserContent={AdduserContent}
                                                                getsubmitformdata={getsubmitformdata}
                                                                getChangessField={getChangessField}
                                                                pagename={"addPayRollNonemp"}
                                                                tdsAmount={tdsAmount}
                                                                salaryAmount={salaryAmount}
                                                                previewData={previewData}
                                                                tdsoveridevalue={tdsoveridevalue}
                                                                
                                                            />
                                                        ) : (null)}
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
            </div>

            <Toaster
                position="top-right"
                reverseOrder={false}

            />
        </>

    );
}
export async function getServerSideProps(context) {

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const payrollForm = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'addPayrollNonEmp' }, context);
    return {
        props: { payrollForm },
    }
}

