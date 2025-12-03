import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablenew.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
export default function employeeAllowance({ showOnlylist }) {
    const router = useRouter();
    const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const columnss = [
        { "lebel": "Sr No", "name": "srNo", "issort": false },
        { "lebel": "Id", "name": "id", "isfilter": false, "issort": false },
        { "lebel": "Employee Name", "name": "employeeName", "isfilter": true, "issort": true },
        { "lebel": "Active From", "name": "activeFrom" },
        { "lebel": "Basic Salary", "name": "basicSalary" },
        { "lebel": "DA+HRA", "name": "HRA" },
        { "lebel": "Project Allce.", "name": "projectAllowance" },
        { "lebel": "Conveyance", "name": "ctc" },
        { "lebel": "Medical", "name": "medicalAllowance" },
        { "lebel": "Special Allow", "name": "specialAllowances" },
        { "lebel": "PF Employee", "name": "pfEmployee" },
        { "lebel": "PF Company", "name": "pfCompany" },
        { "lebel": "Monthly Amt", "name": "totalAmount" },
        { "lebel": "Status", "name": "status", "isfilter": true, "issort": true }
    ];
    const data = [
        [
            { "name": "srno", "value": 1 },
            { "name": "id", "value": "03b0c1a0-1b3a-4580-9599-d3d903eacbcf" },
            { "name": "employeeName", "value": "Pankaj Kumar" },
            { "name": "activeFrom", "value": "Aug 2023" },
            { "name": "basicSalary", "value": "₹ 10500" },
            { "name": "HRA", "value": "₹ 4200" },
            { "name": "projectAllowance", "value": "₹ 12250" },
            { "name": "Conveyance", "value": "₹ 1600" },
            { "name": "medicalAllowance", "value": "₹ 1250" },
            { "name": "specialAllowances", "value": "₹ 5200" },
            { "name": "pfEmployee", "value": "₹ 0" },
            { "name": "pfCompany", "value": "₹ 0" },
            { "name": "totalAmount", "value": "₹ 35000" },
            { "name": "status", "value": "inactive" }
        ],
        [
            { "name": "srno", "value": 2 },
            { "name": "id", "value": "aee4bc82-a4d2-4afb-910a-fd802a99fba6" },
            { "name": "employeeName", "value": "Anoop Sharma" },
            { "name": "activeFrom", "value": "Aug 2023" },
            { "name": "basicSalary", "value": "₹ 15000" },
            { "name": "HRA", "value": "₹ 6000" },
            { "name": "projectAllowance", "value": "₹ 17500" },
            { "name": "Conveyance", "value": "₹ 1600" },
            { "name": "medicalAllowance", "value": "₹ 1250" },
            { "name": "specialAllowances", "value": "₹ 8650" },
            { "name": "pfEmployee", "value": "₹ 0" },
            { "name": "pfCompany", "value": "₹ 0" },
            { "name": "totalAmount", "value": "₹ 50000" },
            { "name": "status", "value": "active" }
        ],
		[
            { "name": "srno", "value": 3 },
            { "name": "id", "value": "aee4bc82-a4d2-4afb-910a-fd802a99fba6" },
            { "name": "employeeName", "value": "Amit Kumar" },
            { "name": "activeFrom", "value": "Aug 2023" },
            { "name": "basicSalary", "value": "₹ 15000" },
            { "name": "HRA", "value": "₹ 6000" },
            { "name": "projectAllowance", "value": "₹ 17500" },
            { "name": "Conveyance", "value": "₹ 1600" },
            { "name": "medicalAllowance", "value": "₹ 1250" },
            { "name": "specialAllowances", "value": "₹ 8650" },
            { "name": "pfEmployee", "value": "₹ 0" },
            { "name": "pfCompany", "value": "₹ 0" },
            { "name": "totalAmount", "value": "₹ 50000" },
            { "name": "status", "value": "pending" }
        ]
    ];

    const allowncedata = [
        {
            description: "Basic Salary",
            name: "basicSalary",
            existingBOAwithpf: "15000.00",
            existingBOAwithoutpf: "15000.00",
            revisedBOA: "",
            pfyes: "30%",
            pfno: "30%",
            isEditable: true
        },
        {
            description: "DA+HRA",
            name: "DA+HRA",
            existingBOAwithpf: "6000.00",
            existingBOAwithoutpf: "6000.00",
            revisedBOA: "",
            pfyes: "40%",
            pfno: "40%",
            isEditable: true
        },
        {
            description: "Project Allowance",
            name: "projectAllowance",
            existingBOAwithpf: "12500.00",
            existingBOAwithoutpf: "17500.00",
            revisedBOA: "",
            pfyes: "25%",
            pfno: "35%",
            isEditable: true
        },
        {
            description: "Conveyance Allowance",
            name: "conveyanceAllowance",
            existingBOAwithpf: "1600.00",
            existingBOAwithoutpf: "1600.00",
            revisedBOA: "",
            pfyes: "0%",
            pfno: "0%",
            fixedamount: "1600.00",
            isEditable: true
        },
        {
            description: "Medical Allowance",
            name: "medicalAllowance",
            existingBOAwithpf: "1250.00",
            existingBOAwithoutpf: "1250.00",
            revisedBOA: "",
            pfyes: "0%",
            pfno: "0%",
            fixedamount: "1250.00",
            isEditable: true
        },
        {
            description: "Special Allowance",
            name: "specialAllowance",
            existingBOAwithpf: "10050.00",
            existingBOAwithoutpf: "8650.00",
            revisedBOA: "",
            pfyes: "25%",
            pfno: "20%",
            isEditable: true
        },
        {
            description: "PF Employee",
            name: "pfemployee",
            existingBOAwithpf: "1800.00",
            existingBOAwithoutpf: "00.00",
            revisedBOA: "",
            pfyes: "12%",
            pfno: "0%",
            isEditable: true
        },
        {
            description: "PF Company",
            name: "pfCompany",
            existingBOAwithpf: "1800.00",
            existingBOAwithoutpf: "00.00",
            revisedBOA: "",
            pfyes: "12%",
            pfno: "0%",
            isEditable: true
        },
        {
            description: "Total Monthly Salary",
            name: "totalMonthlySalary",
            existingBOAwithpf: "50000.00",
            existingBOAwithoutpf: "50000.00",
            revisedBOA: "",
            isEditable: false
        },
        {
            description: "Total Annual Salary",
            name: "totalAnnualSalary",
            existingBOAwithpf: "600000.00",
            existingBOAwithoutpf: "600000.00",
            revisedBOA: "",
            isEditable: false
        }
    ]

    return (
        <>

            <div className="main-wrapper leave_dashborad_page">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Employee Allowance"} />
                        <div className="row mb-4">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className="payroll_emp_info_section">
                                                            <div className="row align-items-center emp_payroll_main">
                                                                <div className="allownce_inerr_text"><span>Last appraisal  : 30 March 2023</span></div>
                                                                <div className="col-md-12">
                                                                    <h5 className="payroll_emp_in_name">Anoop Kumar</h5>
                                                                </div>
                                                                <div className="col-md-12 payroll_emp_in_all_text">
                                                                    <p>Designation: Senior Software Developer</p>
                                                                    <p>Department: Computer Programmer</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='allownce_table_emp'>
                                                            <table className="table-input-oxyem ">
                                                                <tbody>
                                                                    {allowncedata.map((row, index) => (
                                                                        <tr
                                                                            key={index}
                                                                            className={
                                                                                row.name === "totalAnnualSalary" ? 'annualSalary' :
                                                                                    row.name === "totalMonthlySalary" ? 'monthlySalary' :
                                                                                        ''
                                                                            }
                                                                        >
                                                                            <td className='title'>{row.description}</td>
                                                                            <td>{row.existingBOAwithoutpf}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title={""}
                                                            data={data}
                                                            columnsdata={columnss}
															pagename={"basketofallow"}
                                                        />
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
