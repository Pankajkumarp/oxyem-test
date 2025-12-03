import { useState, useEffect } from 'react';
import EmployeeChart from '../Components/Charts/EmployeeChart';
import AttendanceChart from '../Components/Charts/AttendanceChart';
import LeaveChart from '../Components/Charts/LeaveChart';
import ClientChart from '../Components/Charts/ClientChart';
import TimesheetChart from '../Components/Charts/TimesheetChart';
import ProjectChart from '../Components/Charts/ProjectChart';
import FinancialChart from '../Components/Charts/FinancialChart.jsx';
import ClaimStats from '../Components/Charts/ClaimStats.jsx';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import CheckPermission from '../Components/common/CheckPermission/CheckPermission.jsx';

export default function CreateQuiz() {

    const [activeTab, setActiveTab] = useState("All"); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };
    return (
        <>
            <Head><title>{pageTitles.Dashboard}</title></Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">

                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <CheckPermission service="viewAdminDashboard" action="get">

                                                    <div className="card-body oxyem-mobile-card-body">
                                                        <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                                            <li class={`nav-item ${activeTab === "All" ? 'active' : ''}`}>
                                                                <a class={`nav-link`} onClick={() => handleTabClick("All")}>
                                                                    <div className="skolrup-profile-tab-link">All</div>
                                                                </a>
                                                            </li>
                                                            <li class={`nav-item ${activeTab === "Employees" ? 'active' : ''}`}>
                                                                <a class={`nav-link`} onClick={() => handleTabClick("Employees")}>
                                                                    <div className="skolrup-profile-tab-link">Employee</div>
                                                                </a>
                                                            </li>
                                                            <li class={`nav-item ${activeTab === "Projects" ? 'active' : ''}`}>
                                                                <a class={`nav-link`} onClick={() => handleTabClick("Projects")}>
                                                                    <div className="skolrup-profile-tab-link">Projects</div>
                                                                </a>
                                                            </li>
                                                            <li class={`nav-item ${activeTab === "Clients" ? 'active' : ''}`}>
                                                                <a class={`nav-link`} onClick={() => handleTabClick("Clients")}>
                                                                    <div className="skolrup-profile-tab-link">Clients</div>
                                                                </a>
                                                            </li>
                                                            <li class={`nav-item ${activeTab === "Financial" ? 'active' : ''}`}>
                                                                <a class={`nav-link`} onClick={() => handleTabClick("Financial")}>
                                                                    <div className="skolrup-profile-tab-link">Financial</div>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                        <div className="tab-content">
                                                            {activeTab === "All" &&
                                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                    <EmployeeChart activeTab={activeTab} />
                                                                    <LeaveChart activeTab={activeTab} />
                                                                    <AttendanceChart activeTab={activeTab} />
                                                                    <ClaimStats activeTab={activeTab} />
                                                                    {/* <TimesheetChart activeTab={activeTab} /> */}
                                                                </div>
                                                            }
                                                            {activeTab === "Employees" &&
                                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

                                                                    <TimesheetChart activeTab={activeTab} />
                                                                </div>
                                                            }
                                                            {activeTab === "Projects" &&
                                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                    <ProjectChart activeTab={activeTab} />
                                                                </div>
                                                            }
                                                            {activeTab === "Clients" &&
                                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                    <ClientChart activeTab={activeTab} />
                                                                </div>
                                                            }
                                                            {activeTab === "Financial" &&
                                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                    <FinancialChart activeTab={activeTab} />
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </CheckPermission>

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
