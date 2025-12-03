import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/table';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaPlus } from "react-icons/fa6";
import { Tooltip } from 'react-tooltip'
import { CiFloppyDisk } from "react-icons/ci";

export default function Index() {
    const router = useRouter();
    
    const openDetailpopup = async () => {
        setIsModalOpen(true);
    };

    const handleHistoryClick = async (id) => {
        setIsHistroyId(id);
        openDetailpopup();
    };

    const onViewClick = (id) => {
        router.push(`/claim/${id}`);
    };

    const onDeleteClick = (id) => {
        // Delete action implementation
    };

    const handlerecallvalueClick = async (id) => {
        setIsRecallId(id);
        openRecallpopup();
    };

    const openRecallpopup = async () => {
        setIsModalOpenRe(true);
    };

    const columnData = [
        { lebel: 'Sr No', name: 'srno' },
        { lebel: 'Id', name: 'id', isfilter: false, issort: false },
        { name: 'EmployeeName', lebel: 'Employee Name', isfilter: true, issort: true },
        { name: 'EmployeeNumber', lebel: 'Employee Number', isfilter: true, issort: true },
        { name: 'Department', lebel: 'Department', isfilter: true, issort: true },
        { name: 'Role', lebel: 'Role/Designation', isfilter: true, issort: true },
        { name: 'JoiningDate', lebel: 'Joining Date', isfilter: false, issort: false },
        { name: 'EmailAddress', lebel: 'Email Address', isfilter: true, issort: true },
        { name: 'Experience', lebel: 'No. of Experience', isfilter: true, issort: true },
        { name: 'currentrole', lebel: 'Exp. in current role', isfilter: true, issort: true },
        { name: 'Status', lebel: 'Status', isfilter: false, issort: false },
        
    ];

    const mockData = [
        [
            {
                "name": "srno",
                "value": 1
            },
            {
                "name": "id",
                "value": "1234abc"
            },
            {
                "name": "EmployeeName",
                "value": "Sumit Kumar"
            },
            {
                "name": "EmployeeNumber",
                "value": "123"
            },
            {
                "name": "Department",
                "value": "Hr"
            },
            {
                "name": "Role",
                "value": "Hr"
            },
            {
                "name": "JoiningDate",
                "value": "21-Aug-2024"
            },
            {
                "name": "EmailAddress",
                "value": "Ajay@oxytal.com"
            },
            {
                "name": "Experience",
                "value": "3 Years"
            },
            {
                "name": "currentrole",
                "value": "Hr"
            },
            // {
            //     "name": "documents",
            //     "value": [
            //         {
            //             "type": "viewImage",
            //             "isEnable": true
            //         }
            //     ]
            // },
            {
                "name": "status",
                "value": "Inactive"
            },
        ],
    ];
    

    return (
        <>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext="Employee Report"/>
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                {/* <div className="row">
  <div className="col d-flex justify-content-end">
    <Link href={'/stock-management/generate-report'} data-tooltip-id="my-tooltip-breadcrumb" data-tooltip-content={"Generate report"}>
      <CiFloppyDisk size={20}/>
    </Link>
  </div>
</div> */}

                                            
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title=""
                                                            data={mockData}
                                                            columnsdata={columnData}
                                                            onViewClick={onViewClick}
                                                            onDeleteClick={onDeleteClick}
                                                            handleApprrovereq=""
                                                            onHistoryClick={handleHistoryClick}
                                                            handlerecallvalueClick={handlerecallvalueClick}
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
            <Tooltip id="my-tooltip-breadcrumb" style={{ zIndex: 99999 }} />
        </>
    );
}
