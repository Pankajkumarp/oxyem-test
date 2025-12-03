
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/AssetTab.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Head from 'next/head';
import CustomDataTable from '../Components/Datatable/tablewithReport.jsx';
import { TiExport } from "react-icons/ti";
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function reports({ payrollForm }) {
    const router = useRouter();
    const [AdduserContent, setAdduserContent] = useState(payrollForm);
    const [enterField, setEnterField] = useState({});
    const [getValue, setGetValue] = useState({});
    const [reportTableType, setReportTableType] = useState("");
    const [reportTypeName, setReportTypeName] = useState("");
    const getsubmitformdata = async (value, myFile) => {
        const filteredValues = AdduserContent.section[0].Subsection[0].fields.reduce((acc, field) => {
            if (field.isVisible) {
                acc[field.name] = field.value?.value || field.value;
            }
            return acc;
        }, {});
        const report  = {...filteredValues };
        let filteredReport = Object.fromEntries(
            Object.entries(report).filter(([key, value]) => value !== "")
        );
        setEnterField(filteredReport)
        setReportTableType("reportType")
    };


    const handleExportClick = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const filteredValues = AdduserContent.section[0].Subsection[0].fields.reduce((acc, field) => {
                if (field.isVisible) {
                    acc[field.name] = field.value?.value || field.value;
                }
                return acc;
            }, {});
            const report  = {...filteredValues };
            let exportReport = Object.fromEntries(
                Object.entries(report).filter(([key, value]) => value !== "")
            );
            let response = await axiosJWT.get(`${apiUrl}/reports?isFor=export`, {
                params: {
                    ...exportReport
                },
                responseType: 'arraybuffer'
            });

            const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${reportTypeName}.xlsx`;
            link.click(); 
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error fetching the report:', error);
        }
    };
    

    const getChangesValue = (value) => {
        const result = {};
        value.forEach(subsection => {
            subsection.fields.forEach(field => {
                if (typeof field.value === 'object' && field.value !== null) {
                    result[field.name] = field.value.value;
                } else {
                    result[field.name] = field.value;
                }
            });
        });
        const filteredResult = Object.entries(result).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value;
            }
            return acc;
        }, {});
        setGetValue(filteredResult);
        const reportType = result.reportType;
        setReportTypeName(reportType)
        const updatedSections = AdduserContent.section.map(section => {
            return {
                ...section,
                Subsection: section.Subsection.map(subsection => {
                    return {
                        ...subsection,
                        fields: subsection.fields.map(field => {
                            if (reportType === "consolidatedLeaveReport" || reportType === "employeeAttendanceReport" || reportType === "employeeBOAReport") {
                                if (field.name === "startDate" || field.name === "endDate") {
                                    field.isVisible = false;
                                    field.validations = [];
                                }
                                if (field.name === "year") {
                                    field.validations = [
                                        {
                                            "message": "Year is required",
                                            "type": "required"
                                        }
                                    ];
                                }
                            } else {
                                if (field.name === "startDate" || field.name === "endDate") {
                                    field.isVisible = true;
                                    field.validations = [
                                        {
                                            "message": `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`,
                                            "type": "required"
                                        }
                                    ];
                                }
                                if (field.name === "year") {
                                    field.validations = [];
                                }
                            }
                            if (field.name === "status") {
                                field.documentType = reportType;
                            }
                            if (field.showFor) {
                                if (field.showFor.includes(reportType)) {
                                    return {
                                        ...field,
                                        isVisible: true
                                    };
                                } else {
                                    return {
                                        ...field,
                                        isVisible: false
                                    };
                                }
                            } else {
                                return {
                                    ...field
                                };
                            }
                        })
                    };
                })
            };
        });
        setAdduserContent(prevContent => ({
            ...prevContent,
            section: updatedSections
        }));
    }

    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'report-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        }; 
    }, []);
    return (
        <>
            <Head><title>Reports</title></Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <Breadcrumbs maintext={"Reports"} />
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <SecTab
                                                            AdduserContent={AdduserContent}
                                                            getsubmitformdatahitApi={getsubmitformdata}
                                                            getChangessField={getChangesValue}
                                                            pagename={"addAsset"}
															handleExportClick={handleExportClick}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-report-datatable-list">
                                                        {reportTableType !== "" ? (
                                                            <CustomDataTable
                                                                dashboradApi={'/reports'}
                                                                enterField={enterField}
                                                            />
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

                </div>
            </div>

            <ToastContainer />
        </>

    );
}
export async function getServerSideProps(context) {

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const payrollForm = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'reports' }, context);
    
    return {
        props: { payrollForm },
    }
}

