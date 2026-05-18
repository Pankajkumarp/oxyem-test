import React, { useState, useEffect } from 'react';
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

export default function PreviewPopupComponent({ isOpen, closeModal, previewData, idEmployee, applicableFrom }) {
    const [inputData, setInputData] = useState(previewData || {});
    const [showInfo, setShowInfo] = useState(false)
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("hide-body-scroll");
        } else {
            document.body.classList.remove("hide-body-scroll");
        }
    }, [isOpen]);
    useEffect(() => {
        setInputData(previewData || {});
        setShowInfo(true);
    }, [previewData]);
    const transformedData = {
        netMonthSalary: inputData.netSalary || 0,
        earnings: [
            { description: "Basic Salary", amount: inputData.basicSalary || 0 },
            { description: "DA HRA", amount: inputData.daHRA || 0 },
            { description: "Conveyance Allowance", amount: inputData.conveyanceAllowance || 0 },
            { description: "Project Allowances", amount: inputData.projectAllowances || 0 },
            { description: "Special Allowance", amount: inputData.specialAllowance || 0 },
            { description: "Medical Allowances", amount: inputData.medicalAllowances || 0 },
        ],
        deductions: [
            { description: "TDS", amount: inputData.tds || 0 },
            { description: "ESI", amount: inputData.esi || 0 },
            { description: "Provident Fund", amount: inputData.providentFund || 0 },
            { description: "Loss of pay", amount: inputData.lop || 0 },

        ],
        currency: inputData.currency || '',
        otherAllowance: Array.isArray(inputData?.otherAllowance)
            ? inputData.otherAllowance
            : [],

        deductionOtherAllowance: Array.isArray(inputData?.deductionOtherAllowance)
            ? inputData.deductionOtherAllowance
            : [],
    };
    const totalEarnings =
        Number(inputData?.basicSalary || 0) +
        Number(inputData?.daHRA || 0) +
        Number(inputData?.conveyanceAllowance || 0) +
        Number(inputData?.projectAllowances || 0) +
        Number(inputData?.specialAllowance || 0) +
        Number(inputData?.medicalAllowances || 0) +
        (Array.isArray(inputData?.otherAllowance)
            ? inputData.otherAllowance.reduce(
                (sum, item) => sum + Number(item?.attributeValue || 0),
                0
            )
            : 0);

    const totalDeductions =
        Number(inputData?.tds || 0) +
        Number(inputData?.esi || 0) +
        Number(inputData?.providentFund || 0) +
        Number(inputData?.lop || 0) +
        (Array.isArray(inputData?.deductionOtherAllowance)
            ? inputData.deductionOtherAllowance.reduce(
                (sum, item) => sum + Number(item?.attributeValue || 0),
                0
            )
            : 0);

    const calculatedNetSalary = totalEarnings - totalDeductions;
    const hasOtherAllowance =
  Array.isArray(transformedData?.otherAllowance) &&
  transformedData.otherAllowance.length > 0;

const hasOtherDeduction =
  Array.isArray(transformedData?.deductionOtherAllowance) &&
  transformedData.deductionOtherAllowance.length > 0;

const earningsColClass =
  hasOtherAllowance && !hasOtherDeduction
    ? "col-md-12"
    : "col-md-6";

const deductionColClass =
  hasOtherDeduction && !hasOtherAllowance
    ? "col-md-12"
    : "col-md-6";
    return (
        <Drawer
            open={isOpen}
            onClose={closeModal}
            direction='right'
            className='custom-drawer custom-drawer-w '
            overlayClassName='custom-overlay'
        >
            <div className="modal-header mb-2">
                <button className="oxyem-btn-close me-3" onClick={closeModal}>
                    <MdClose />
                </button>
            </div>
            <div className="row">
                <div className="col-12 col-lg-12 col-xl-12 px-0">
                    <div className="row">
                        <div className="col-12 col-lg-12 col-xl-12 d-flex">
                            <div className="card flex-fill comman-shadow oxyem-index payroll_page_main px-0">
                                <div className="center-part">
                                    {showInfo && (
                                        <div className="card-body oxyem-mobile-card-body">
                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="oxyem-payrollPreview-page">
                                                <div className="payslip">

                                                    {/* HEADER */}
                                                    <div className="payslip-header d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <h5 className="mb-1 fw-bold">Salary Slip</h5>
                                                            <div>Payslip For the Month of <span className='fw-bold text-capitalize'>{applicableFrom || '-'}</span></div>
                                                            <div>PAN: {inputData.panCard || ''}</div>
                                                        </div>
                                                        <div className="company-logo"><span>O</span>XYTAL</div>
                                                    </div>

                                                    {/* EMPLOYEE INFO */}
                                                    <div className="payslip-emp-info row mt-3">
                                                        <div className="col-md-9">
                                                            <div className="row">
                                                                <div className="col-6 pb-1">Employee Name:<span className='fw-bold text-capitalize'>{idEmployee?.label || '-'}</span></div>
                                                                <div className="col-6 pb-1">Employee ID: {inputData.empNumber || ''}</div>

                                                                <div className="col-6 pb-1">Designation: {idEmployee?.designation || ''}</div>
                                                                <div className="col-6 pb-1">Date Of Joining: {inputData?.dateOfJoining || ''}</div>

                                                                <div className="col-6 pb-1">Payment Method: Online</div>
                                                                <div className="col-6 pb-1">Paid Days: {inputData.paidDays || ''}</div>
                                                                <div className="col-6 pb-1">Salary Month: {applicableFrom || ''}</div>
                                                            </div>
                                                        </div>

                                                        {/* NET PAY BOX */}
                                                        <div className="col-md-3">
                                                            <div className="netpay-box text-center">
                                                                <div>Net Pay</div>
                                                                <h4>{transformedData.currency} {calculatedNetSalary || transformedData.netMonthSalary}</h4>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* EARNINGS + DEDUCTIONS */}
                                                    <div className="row mt-4">
                                                        <div className="col-md-6">
                                                            <table className="table payslip-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Earnings</th>
                                                                        <th className="text-end">Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {transformedData.earnings.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td>{item.description}</td>
                                                                            <td className="text-end">{transformedData.currency} {item.amount}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <table className="table payslip-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Deductions</th>
                                                                        <th className="text-end">Amount</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {transformedData.deductions.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td>{item.description}</td>
                                                                            <td className="text-end">{transformedData.currency} {item.amount}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className={earningsColClass}>
                                                            {transformedData?.otherAllowance?.length > 0 && (
                                                                <>
                                                                    <h5 className='fw-bold mt-4'>Other Allowance</h5>
                                                                    <table className="table payslip-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Earnings</th>
                                                                                <th className="text-end">Amount</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {Array.isArray(transformedData?.otherAllowance) &&
                                                                                transformedData.otherAllowance.map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{item?.name?.label || item?.name}</td>
                                                                                        <td className="text-end">{transformedData.currency} {item.attributeValue}</td>
                                                                                    </tr>
                                                                                ))}
                                                                        </tbody>
                                                                    </table>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className={deductionColClass}>
                                                            {transformedData?.deductionOtherAllowance?.length > 0 && (
                                                                <>
                                                                    <h5 className='fw-bold mt-4'>Other Deductions</h5>
                                                                    <table className="table payslip-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Deductions</th>
                                                                                <th className="text-end">Amount</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {Array.isArray(transformedData?.deductionOtherAllowance) &&
                                                                                transformedData.deductionOtherAllowance.map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{item?.name?.label || item?.name}</td>
                                                                                        <td className="text-end">{transformedData.currency} {item.attributeValue}</td>
                                                                                    </tr>
                                                                                ))}
                                                                        </tbody>
                                                                    </table>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* NET TOTAL */}
                                                    <div className="text-center mt-4 payslip-total">
                                                        <h3>NET MONTH SALARY: {transformedData.currency} {calculatedNetSalary || transformedData.netMonthSalary}</h3>
                                                        <p>Net Month Salary = (Gross Earnings - Total Deductions + Reimbursements)</p>
                                                    </div>

                                                    {/* FOOTER */}
                                                    <div className="payslip-footer text-center">
                                                        This is a computer-generated document. No signature or stamp is required.
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
            </div>
            <style>
                {`
.payslip {
    background: #fff;
    font-size: .75rem;
    line-height:1.75;
}
.payslip-header {
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
}
.company-logo {
    font-size: 2.25rem;
    font-weight: 700;
    letter-spacing: 2px;
}
.company-logo span{color: #f07c00;}
.payslip-emp-info {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
}
.netpay-box {
    border: 1px solid #ddd;
    padding: 25px 10px;
    background: #fafafa;
}
.netpay-box h4 {
    color: #f07c00;
    font-weight: bold;
    font-size:1rem;
}
.payslip-table thead {
    background: #e9ecef;
    font-weight: 600;
}
.payslip-table td {
    padding: 10px 8px;
}
.payslip-total h3 {
    letter-spacing: 1px;
    font-weight: 700;
}
.payslip-footer {
    border-top: 1px solid #ddd;
    margin-top: 20px;
    padding-top: 10px;
    font-size: 12px;
    text-align: left;
}
`}
            </style>
        </Drawer>
    );
}
