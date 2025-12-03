import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { Toaster } from 'react-hot-toast';
import moment from 'moment-timezone';
import TopData from './topdata.jsx';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
export default function TaxProjection() {
    const [financialTable, setFinancialTable] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [allocationInfo, setAllocationInfo] = useState([]);
    const [Heading, setHeading] = useState('');
    const [topheader, setTopHeader] = useState([]);
    const [fullData, setFullData] = useState([]);

    const fetchData = async (empId) => {
        try {
            const response = await axiosJWT.post(`${apiUrl}/payroll/taxProjection`, {
                "idEmployee": empId,
                "financialYear": getCurrentFinancialYear()
            });

            if (response && response.data) {
                if (Object.keys(response.data.data.finalProjection).length === 0) {
                    setErrorMessage(response.data.message);
                } else {
                    setFinancialTable(response.data.data.finalProjection || {});
                    setHeading(response.data.data?.heading || '');
                    setTopHeader(response.data.data?.header || []);
                    setFullData(response.data.data);
                    setErrorMessage('');

                }
            }
        } catch (error) {
            // console.error('Error fetching data:', error);
        }
    };

    // Get the current financial year dynamically
    const getCurrentFinancialYear = () => {
        const currentDate = moment();
        const currentYear = currentDate.year();
        return currentDate.month() >= 3 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;
    };

    useEffect(() => {
        const fetchProfileOptions = async () => {
            try {
                const response = await axiosJWT.get(`${apiUrl}/employees/getLoggedInEmployee`);
                if (response && response.data) {
                    const empId = response.data.data.idEmployee;
                    fetchData(empId);
                }
            } catch (error) {
                // console.error('Error fetching profile options:', error);
            }
        };
        fetchProfileOptions();
    }, []);

    

    return (
        <>
        <Head><title>{pageTitles.TaxProjection}</title></Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid" id="taxprojection">
                        <Breadcrumbs maintext={"Tax Projection"} addlink={"/updateProjection"} />

                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        {errorMessage ? (
                                            <div className="alert alert-warning alert-dismissible fade show">{errorMessage}</div>
                                        ) : (
                                            <TopData
                                                data={financialTable}
                                                allocationInfo={allocationInfo}
                                                heading={Heading}
                                                topheader={topheader}
                                                fullData={fullData}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}
