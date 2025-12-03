import React, { useState, useEffect } from 'react';
import LeaveList from '../Components/Leave/LeaveListings';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import Recall from '../Components/Popup/Recallmodal';
import { reorderColumns, reorderEntries, sortData } from '../../common/commonFunctions';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SelectComponent from '../Components/common/SelectOption/SelectComponent.jsx';
import View from '../Components/Popup/Leaveview';
import { FaTimes } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function TaxDashboard({ showOnlylist }) {
    const router = useRouter();
    const [leavelisting, setLeaveListing] = useState([]);
    const [formcolumn, setFormColumn] = useState([]);
    const [leavesummary, setLeaveSummary] = useState([]);
    const [updleavelist, setUpdLeaveList] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [toplist, setToplist] = useState({});

    const desiredOrder = ["srno", "id", "leaveType", "fromDate", "toDate", "numberofDays", "leaveReason", "status", "action"];

    const sortColumns = (columns) => {
        return columns.sort((a, b) => {
            return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
        });
    };



    const handleEditClick = (id) => {
        router.push(`/addleave/${id}`);
    };

    const [refreshtable, setRefreshtable] = useState("");





    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    const currentYear = new Date().getFullYear().toString();
    const optionsyear = [];
    for (let year = 2018; year <= currentYear; year++) {
        optionsyear.push({ value: year.toString(), label: year.toString() });
    }

    const [setMouth, setMonthValue] = useState(currentMonth); // State to manage active tab index
    const [setYear, setYearValue] = useState(currentYear); // State to manage active tab index

    const onChangeYear = (value) => {
        if (value !== null) {
            setYearValue(value.value); // Update active tab index when a tab is clicked
        } else {
            setYearValue();
        }
    };

    const handleHistoryClick = async (id) => {
    }

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
