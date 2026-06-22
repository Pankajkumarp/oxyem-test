import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { ToastNotification } from '../Components/EmployeeDashboard/Alert/ToastNotification';

export default function PayrollPreview({ previewData, fields }) {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [inputData, setInputData] = useState(previewData || {});
    const [showInfo, setShowInfo] = useState(false);
    const [loader, setloader] = useState(false);
    

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInputData(previewData || {});
        setShowInfo(true);
    }, [previewData]);

    const transformedData = {
        netMonthSalary: inputData.netSalary || 0,
        // earnings: [
        //     { description: "Basic Salary", amount: inputData.basicSalary || 0 },
        //     { description: "DA HRA", amount: inputData.daHRA || 0 },
        //     { description: "Conveyance Allowance", amount: inputData.conveyanceAllowance || 0 },
        //     { description: "Project Allowances", amount: inputData.projectAllowances || 0 },
        //     { description: "Special Allowance", amount: inputData.specialAllowance || 0 },
        //     { description: "Medical Allowances", amount: inputData.medicalAllowances || 0 },
        // ],
        // deductions: [
        //     { description: "TDS", amount: inputData.tds || 0 },
        //     { description: "ESI", amount: inputData.esi || 0 },
        //     { description: "Provident Fund", amount: inputData.providentFund || 0 },
        //     { description: "Loss of pay", amount: inputData.lop || 0 },
            
        // ],
        currency:inputData.currency || '',
        otherAllowance: inputData.otherAllowance || [],
        deductionOtherAllowance: inputData.deductionOtherAllowance || [],
        // netMonthSalaryc: inputData.otherAllowance - inputData.deductionOtherAllowance,
       
        
    };


    const handleSubmit = async (buttonval) => {
        if (buttonval === 'cancel') {
            router.push('/payrollManagement');
        } else {
            setloader(true);
            // Check if inputData contains otherAllowance and is an array
            const otherAllowanceArray = Array.isArray(inputData.otherAllowance) ? inputData.otherAllowance : [];
    
            // Transform the otherAllowance array
            const transformedOtherAllowance = otherAllowanceArray.map(item => ({
                name: item.name,
                attributeValue: item.attributeValue
            }));
    
            // Update the inputData with the transformed otherAllowance
            const updatedData = {
                ...inputData,
                status: buttonval,
                isFor: "NonEmployee",
                otherAllowance: transformedOtherAllowance
            };
    
            try {
                const response = await axiosJWT.post(`${apiUrl}/payroll/generateSalaryDetails`, updatedData);
                if (response.status === 200) {
                   ToastNotification({ message: response.data.message });
                    router.push('/payrollManagement');
                } else {
                    // Handle non-200 status codes
                }
            } catch (error) {
                // Handle error
                console.error(error);
            }
        }
    };
    
    

    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-12 col-xl-12">
                    <div className="row">
                        <div className="col-12 col-lg-12 col-xl-12 d-flex">
                            <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                                <div className="center-part">
                                    {showInfo && (
                                        <div className="card-body oxyem-mobile-card-body">
                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="oxyem-payrollPreview-page">
                                                <div className="payroll_salary_info_section">
                                                    <div className="row mt-4">
                                                        {/* <div className="col-md-12">
                                                            <table className="table payroll_salary_info_table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Earnings</th>
                                                                        <th>Amounts</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {transformedData.earnings.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td>{item.description}</td>
                                                                            <td>{transformedData.currency} {item.amount}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div> */}
                                                        {/* <div className="col-md-6">
                                                            <table className="table payroll_salary_info_table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Deductions</th>
                                                                        <th>Amounts</th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {transformedData.deductions.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td>{item.description}</td>
                                                                            <td>{transformedData?.currency} {item.amount}</td>
                                                                            <td>
                                                                                {item.description === "TDS" && (
                                                                                    <FaEdit style={{ cursor: 'pointer', color: 'var(--theme-pending-color-text)' }} onClick={openEditModal} />
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div> */}
                                                        {transformedData.deductionOtherAllowance.length > 0 && (
                                                            <div className="col-md-12">
                                                                <table className="table payroll_salary_info_table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Deduction Other Allowance</th>
                                                                            <th>Amount</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {transformedData.deductionOtherAllowance.map((item, index) => (
                                                                            <tr key={index}>
                                                                                <td>{item.name}</td>
                                                                                <td>{transformedData?.currency} {item.attributeValue}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                        {transformedData.otherAllowance.length > 0 && (
                                                            <div className="col-md-12">
                                                                <table className="table payroll_salary_info_table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Others</th>
                                                                            <th>Amount</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {transformedData.otherAllowance.map((item, index) => (
                                                                            <tr key={index}>
                                                                                <td>{item.name}</td> {/* Adjusted to display the label */}
                                                                                <td>{transformedData?.currency} {item.attributeValue}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                        
                                                    </div>
                                                </div>
                                                <div className="payroll_netpay_info_section">
                                                    <div className="row">
                                                        <div className="col-md-12 text-center">
                                                            <h3>NET MONTH SALARY: {transformedData?.currency} {transformedData.netMonthSalary}</h3>
                                                            <p>Net Month Salary = (Earning - Deduction)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!loader ? 
                 <div className="text-end w-100">
                    {fields.buttons.map((buttonval, fieldIndex) => (
                        <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} onClick={() => handleSubmit(buttonval.value)} disabled={loader} >{buttonval.label}</button>
                    ))}
                </div>
                :
                    <div className="text-end w-100">
                        <button type="submit" className={`btn btn-primary`} disabled={loader} >
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                        </button>
                    </div>
                }
            </div>
        </>
    );
}
