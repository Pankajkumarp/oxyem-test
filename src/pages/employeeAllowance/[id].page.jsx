import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import DataTable from './DataTable';
export default function employeeAllowance({ showOnlylist }) {
    const router = useRouter();
    const [empID, setempID] = useState("");
    useEffect(() => {
        if (router.query.id) {
            setempID(router.query.id)
        }
    }, [router.query.id]);


    return (
        <>
            <div className="main-wrapper leave_dashborad_page">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Employee Allowance"} />
                        <div className="row mb-4">
                            <DataTable empID={empID} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
