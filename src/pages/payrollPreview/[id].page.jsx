import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
export default function payrollPreview() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [salarySlipData, setapiResponse] = useState({});
    const [showifo, setShowifo] = useState(false);


    const getProjectValue = async (id) => {
        try {

            const response = await axiosJWT.get(`${apiUrl}/payroll/viewSlip`, {
                params: {
                    'idSalary': id
                }
            });
            if (response) {
                const apiResponse = response.data.data
              //  const employeeType = apiResponse.employeeInfo.empType
                setapiResponse(apiResponse);
                setShowifo(true)
            }

        } catch (error) {

        }
    }
    useEffect(() => {
        const { id } = router.query; // Extract the "id" parameter from the query object
        if (id) {
            getProjectValue(id)
        }

    }, [router.query.id]);
    return (
        <>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Payroll Management"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                                            <div className="center-part">
                                                {showifo === true ? (
                                                    <div className="card-body oxyem-mobile-card-body">
                                                        <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="oxyem-payrollPreview-page">
                                                            <div className="payroll_header_section">
                                                                <div className="row align-items-center">
                                                                    <div className="col-md-6">
                                                                        <div className="payroll_header_text">
                                                                            <h4 className='text_heaader_1'>{salarySlipData.header.title}</h4>
                                                                            <p className='text_heaader_2'>{salarySlipData.header.month}</p>
                                                                            <p className='text_heaader_3'><span>PAN:</span> {salarySlipData.header.pan}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6 text-left">
                                                                        <h1 className='main_logo'><span>O</span>XYTAL</h1>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="payroll_emp_info_section">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <h5 className="payroll_emp_in_name">{salarySlipData.employeeInfo.name}</h5>
                                                                    </div>
                                                                    <div className="col-md-4 payroll_emp_in_all_text">
                                                                        <p><span>Designation:</span> {salarySlipData.employeeInfo.designation}</p>
                                                                        <p><span>Payment Method:</span> {salarySlipData.employeeInfo.paymentMethod}</p>
                                                                        <p><span>Paid Days:</span> {salarySlipData.employeeInfo.paidDays}</p>
                                                                        <p><span>Salary Month:</span> {salarySlipData.employeeInfo.salaryMonth}</p>
                                                                        <p><span>Employee Type:</span> {salarySlipData.employeeInfo.empType}</p>
                                                                    </div>
                                                                    <div className="col-md-4 payroll_emp_in_all_text">
                                                                        <p><span>Employee ID:</span> {salarySlipData.employeeInfo.employeeId}</p>
                                                                        <p><span>Joining Date:</span> {salarySlipData.employeeInfo.joiningDate}</p>
                                                                        <p><span>Paid On:</span> {salarySlipData.employeeInfo.paidOn}</p>
                                                                        <p><span>Status:</span> <span className={`paysilp_status_box oxyem-mark-${salarySlipData.employeeInfo.status}`}>{salarySlipData.employeeInfo.status}</span></p>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="payroll_emp_net_pay_box">
                                                                            <h5 className="card-title">Net Pay</h5>
                                                                            <p className="card-text">{salarySlipData.employeeInfo.netPay}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
     
   
                                                            <div className="payroll_salary_info_section">
                                                                <div className="row mt-4">
                                                                    {salarySlipData.employeeInfo.empType !== 'NonEmployee' ? (
    <>
                                                                    <div className="col-md-6">
                                                                        <table className="table payroll_salary_info_table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Earnings</th>
                                                                                    <th>Amounts</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {salarySlipData.earnings.map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{item.description}</td>
                                                                                        <td>{item.amount}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <table className="table payroll_salary_info_table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Deductions</th>
                                                                                    <th>Amounts</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {salarySlipData.deductions.map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{item.description}</td>
                                                                                        <td>{item.amount}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                     </>
                                                              ) : (
    <h6>Employee type is 'NonEmployee' - no Earning and Deduction information available.</h6>
)}
                                                                    <div className="col-md-12">
                                                                        <table className="table payroll_salary_info_table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Deduction Other Allowance</th>
                                                                                    <th>Amount</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {salarySlipData.deductionOtherAllowance.map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{item.name}</td>
                                                                                        <td>{item.attributeValue}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <div className="col-md-12">
                                                                        <table className="table payroll_salary_info_table">
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>Others</th>
                                                                                    <th>Amount</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {salarySlipData.otherAllowance.map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{item.name}</td>
                                                                                        <td>{item.attributeValue}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="payroll_netpay_info_section">
                                                                <div className="row">
                                                                    <div className="col-md-12 text-center">
                                                                        <h3>NET MONTH SALARY: {salarySlipData.netMonthSalary}</h3>
                                                                        <p>Net Month Salary = (Gross Earnings - Total Deductions + Reimbursements)</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className='text-center'><b>This is an online generated payslip and no attestation required</b></p>
                                                        </div>
                                                    </div>
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


        </>

    );
}
