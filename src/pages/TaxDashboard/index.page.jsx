import React, { useState } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import { useRouter } from 'next/router';
import SelectComponent from '../Components/common/SelectOption/SelectComponent.jsx';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
export default function TaxDashboard() {
    const router = useRouter();
    const formcolumn  = [];
    const updleavelist  = [];
    const responseData  = [];


    const handleEditClick = (id) => {
        router.push(`/addleave/${id}`);
    };

    const refreshtable = "";

    const currentYear = new Date().getFullYear().toString();
    const optionsyear = [];
    for (let year = 2018; year <= currentYear; year++) {
        optionsyear.push({ value: year.toString(), label: year.toString() });
    }
    const [setYear, setYearValue] = useState(currentYear); // State to manage active tab index

    const onChangeYear = (value) => {
        if (value !== null) {
            setYearValue(value.value); // Update active tab index when a tab is clicked
        } else {
            setYearValue();
        }
    };

    return (
        <>
<Head>
        <title>{pageTitles.PayrollTaxDashboard}</title>
        <meta name="description" content={pageTitles.PayrollTaxDashboard} />
    </Head>
            <div className="main-wrapper leave_dashborad_page">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Tax Dashboard"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className="row mt-4">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <SelectComponent label={"Filter Data by Year"} placeholder={"Select Year..."} options={optionsyear} onChange={onChangeYear} value={setYear} />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <CustomDataTable
                                                            title={""}
                                                            data={updleavelist}
                                                            columnsdata={formcolumn}
                                                            ismodule={'leave'}
                                                            year={setYear}
                                                            refreshtable={refreshtable}
                                                            ifForvalue={'admin'}
                                                            dashboradApi={'/payroll/viewTaxDeductions'}
                                                            onEditClick={handleEditClick}
                                                            responseData={responseData}
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
