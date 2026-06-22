import React, { useEffect, useState, lazy, Suspense } from 'react';
import ProfileHeader from '../Components/EmployeeDashboard/Profile/ProfileHeader';
import StatHeader from '../Components/EmployeeDashboard/Profile/StatHeader';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbsdiscription';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Head from 'next/head';
import { MdDashboardCustomize } from "react-icons/md";
import { CgProfile, CgFileDocument } from "react-icons/cg";
import { GrProjects } from "react-icons/gr";
import styles from './emp.module.css';


const Personalinfo = lazy(() => import('../Components/EmployeeDashboard/Profile/Personalinfo'));
const EmergencyContact = lazy(() => import('../Components/EmployeeDashboard/Profile/EmergencyContact'));
const BankInfo = lazy(() => import('../Components/EmployeeDashboard/Profile/BankInfo'));
const DependentInfo = lazy(() => import('../Components/EmployeeDashboard/Profile/DependentInfo'));
const EducationInfo = lazy(() => import('../Components/EmployeeDashboard/Profile/EducationInfo'));
const ExperienceInfo = lazy(() => import('../Components/EmployeeDashboard/Profile/ExperienceInfo'));
const AddressInfo = lazy(() => import('../Components/EmployeeDashboard/Profile/AddressInfo'));
const Documents = lazy(() => import('../Components/EmployeeDashboard/Profile/Documents'));
const ProjectList = lazy(() => import('../Components/List/ProjectList'));
const Leave = lazy(() => import('../leave/index.page'));
const Finance = lazy(() => import('../employeeAllowance/DataTable.jsx'));
const EmployeeAsset = lazy(() => import('../employeeAsset/index.page.jsx'));

export default function ProfilePage() {
  const [empId, setEmpId] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // Default active tab
  const [refressAddressApi, setRefressAddressApi] = useState(false);
  const [showbutton, setUserStatus] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/employees/getLoggedInEmployee`);

        const EmployeeId = response.data.data.idEmployee;
        const isActive = response.data.data.isActive;

        setEmpId(EmployeeId);
        setUserStatus(isActive);


      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const hitAddressApi = (value) => {
    setRefressAddressApi(value);
  };

 const section2 = true;
  const [section3, setsection3] = useState(false);
  const [section4, setsection4] = useState(false);

  useEffect(() => {

    const handleScroll = () => {
      // if (!section2 && window.scrollY > 0) {  // Adjust scroll position as needed
      //   setsection2(true);   
      // }
      if (!section3 && window.scrollY > 0) {  // Adjust scroll position as needed
        setsection3(true);
      }
      if (!section4 && window.scrollY > 100) {  // Adjust scroll position as needed
        setsection4(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/employees`;

  const [contactNumber, setContactNumber] = useState("");
      const getContactNumber = (value) => {
    setContactNumber(value);
  };

  return (
    <>
      <Head>
        <title>Employee Information Dashboard | Oxytal</title>
        <meta name="description" content={"Explore the employee dashboard for quick access to employee information and workplace updates."} />
      </Head>
      <div className="main-wrapper ">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col">
                  <Breadcrumbs
                    maintext={"Employee Dashboard Overview"}
                    discription={"This dashboard provides a summary of employee information, activities, and organizational updates."}
                    icon={<MdDashboardCustomize />}
                  />
                </div>
              </div>
            </div>

            <div className="profile-top-section">
              <ProfileHeader empId={empId} apiBaseUrl={apiBaseUrl} hitAddressApi={hitAddressApi} showbutton={showbutton} contactNumber={contactNumber}/>
            </div>
            <div className="profile-top-stat">
              <StatHeader empId={empId} apiBaseUrl={apiBaseUrl} hitAddressApi={hitAddressApi} showbutton={showbutton} />
            </div>

            <div className="card tab-box mt-1 mb-2">
              <div className={`${styles.tabBox} row user-tabs`}>
                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                  <ul className={`nav nav-tabs nav-tabs-bottom ${styles.tabNav}`}>
                    <li className={`nav-item ${styles.tabNavItem}`}>
                      <a
                        className={`
    nav-link
    ${styles.tabNavLink}
    ${activeTab === 'profile' ? `active ${styles.isActive}` : ''}
  `}
                        onClick={() => handleTabChange('profile')}
                      >
                        <CgProfile />  Profile
                      </a>
                    </li>
                    <li className={`nav-item ${styles.tabNavItem}`}>
                      <a
                        className={`
    nav-link
    ${styles.tabNavLink}
    ${activeTab === 'documents' ? `active ${styles.isActive}` : ''}
  `}
                        onClick={() => handleTabChange('documents')}
                      >
                        <CgFileDocument /> Documents
                      </a>
                    </li>
                    <li className={`nav-item ${styles.tabNavItem}`}>
                      <a
                       className={`
    nav-link
    ${styles.tabNavLink}
    ${activeTab === 'projects' ? `active ${styles.isActive}` : ''}
  `}
                        onClick={() => handleTabChange('projects')}
                      >
                        <GrProjects /> Projects
                      </a>
                    </li>
                    <li className={`nav-item ${styles.tabNavItem}`}>
                      <a
                        className={`
    nav-link
    ${styles.tabNavLink}
    ${activeTab === 'leave' ? `active ${styles.isActive}` : ''}
  `}
                        onClick={() => handleTabChange('leave')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="5" width="18" height="16" rx="2" />
                          <path d="M16 3V7" />
                          <path d="M8 3V7" />
                          <path d="M3 11H21" />
                          <path d="M10 16H16" />
                          <path d="M13 13L16 16L13 19" />
                        </svg>
                        Leave
                      </a>
                    </li>
                    <li className={`nav-item ${styles.tabNavItem}`}>
                      <a
                        className={`
    nav-link
    ${styles.tabNavLink}
    ${activeTab === 'finance' ? `active ${styles.isActive}` : ''}
  `}
                        onClick={() => handleTabChange('finance')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 20V10" />
                          <path d="M12 20V4" />
                          <path d="M18 20V14" />
                          <path d="M4 20H20" />
                        </svg>
                        Finance
                      </a>
                    </li>
                    <li className={`nav-item ${styles.tabNavItem}`}>
                      <a
                        className={`
    nav-link
    ${styles.tabNavLink}
    ${activeTab === 'assets' ? `active ${styles.isActive}` : ''}
  `}
                        onClick={() => handleTabChange('assets')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="6" width="18" height="14" rx="2" ry="2" />
                          <path d="M7 10H17" />
                          <circle cx="16" cy="15" r="1" />
                        </svg>
                        Assets
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={`tab-content ${styles.tabDataBox}`}>
              {activeTab === 'profile' && (
                <Suspense fallback={<div>
                  <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div></div>}>
                  <div id="emp_profile" className="pro-overview tab-pane fade show active">
                    <div className="row mb-3">

                      {/* LEFT COLUMN */}
                      <div className="col-md-4 d-flex flex-column gap-3">
                        <div className="card profile-box flex-fill">
                          <Personalinfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton} />
                        </div>

                        {section2 && (
                          <div className="card profile-box flex-fill">
                            <AddressInfo
                              empId={empId}
                              apiBaseUrl={apiBaseUrl}
                              refressAddressApi={refressAddressApi}
                              showbutton={showbutton}
                            />
                          </div>
                        )}

                        
                      </div>

                      {/* CENTER COLUMN */}
                      <div className="col-md-4">
                        <div className="card profile-box mb-3">
                          <EmergencyContact empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton} getContactNumber={getContactNumber}/>
                        </div>
{section3 && (
                          <div className="card profile-box flex-fill mb-3">
                            <EducationInfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton} />
                          </div>
                        )}
                        {section3 && (
                          <div className="card profile-box flex-fill">
                            <ExperienceInfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton} />
                          </div>
                        )}
                      </div>
                      {/* RIGHT COLUMN */}
                      <div className="col-md-4">
                        {section4 && (
                          <div className="card profile-box flex-fill mb-3">
                            <BankInfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton} />
                          </div>
                        )}
                        {section2 && (
                          <div className="card profile-box mb-3">
                            <DependentInfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>




                </Suspense>
              )}

              {activeTab === 'projects' && (
                <Suspense fallback={<div><div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div></div>}>
                  <div id="emp_projects" className="pro-overview tab-pane fade show active">
                    <ProjectList />
                  </div>
                </Suspense>
              )}

              {activeTab === 'leave' && (
                <Suspense fallback={<div><div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div></div>}>
                  <div id="emp_leave" className="pro-overview tab-pane fade show active">
                    <Leave showOnlylist={'showOnlylist'} />
                  </div>
                </Suspense>
              )}
              {activeTab === 'finance' && (
                <Suspense fallback={<div><div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div></div>}>
                  <Finance empID={activeTab === 'finance' ? empId : ""} section={"userlist"} />
                </Suspense>
              )}
              {activeTab === 'documents' && (
                <Suspense fallback={<div><div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div></div>}>
                  <div id="emp_documents" className="pro-overview tab-pane fade show active">
                    <div className="row mb-3">
                      <div className="col-md-12 d-flex">
                        <div className="card profile-box flex-fill">
                          <Documents empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Suspense>
              )}

              {activeTab === 'assets' && (
                <Suspense fallback={<div><div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                </div></div>}>
                  <div id="emp_leave" className="pro-overview tab-pane fade show active">
                    <EmployeeAsset showOnlylist={'showOnlylist'} />
                  </div>
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
