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
        currency: inputData.currency || '',
        otherAllowance: inputData.otherAllowance || [],
        deductionOtherAllowance: inputData.deductionOtherAllowance || []
    };
    const totalEarnings =
        (inputData.otherAllowance || []).reduce(
            (sum, item) => sum + Number(item.attributeValue || 0),
            0
        );

    const totalDeductions =
        (inputData.deductionOtherAllowance || []).reduce(
            (sum, item) => sum + Number(item.attributeValue || 0),
            0
        );

    const calculatedNetSalary = totalEarnings - totalDeductions;
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
                                                    <div className="row mt-4">
                                                        <div
                                                            className={
                                                                transformedData?.deductionOtherAllowance?.length > 0
                                                                    ? "col-md-6"
                                                                    : "col-md-12"
                                                            }
                                                        >

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
                                                                            {transformedData?.otherAllowance.map((item, index) => (
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

                                                        <div
                                                            className={
                                                                transformedData?.otherAllowance?.length > 0
                                                                    ? "col-md-6"
                                                                    : "col-md-12"
                                                            }
                                                        >
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
                                                                            {transformedData?.deductionOtherAllowance.map((item, index) => (
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
