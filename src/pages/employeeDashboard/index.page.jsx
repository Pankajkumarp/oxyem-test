import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/router';
import ProfileHeader from '../Components/EmployeeDashboard/Profile/ProfileHeader';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';

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
  const router = useRouter();
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
  
            // console.log(response);
            setUserStatus(isActive);
            
  
        } catch (error) {
            // console.error("Error fetching data", error);
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

  const [section2, setsection2] = useState(true);
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

  return (
    <>
    <Head><title>{pageTitles.Dashboard}</title></Head>
      <div className="main-wrapper ">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col">
                  <Breadcrumbs maintext={"Employee Dashboard"} />
                </div>
              </div>
            </div>

            <div className="card mb-0">
              <ProfileHeader empId={empId} apiBaseUrl={apiBaseUrl} hitAddressApi={hitAddressApi} showbutton={showbutton}/>
            </div>

            <div className="card tab-box mt-1 mb-2">
              <div className="row user-tabs">
                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                  <ul className="nav nav-tabs nav-tabs-bottom">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => handleTabChange('profile')}
                      >
                        Profile
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => handleTabChange('documents')}
                      >
                        Documents
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => handleTabChange('projects')}
                      >
                        Projects
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'leave' ? 'active' : ''}`}
                        onClick={() => handleTabChange('leave')}
                      >
                        Leave
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'finance' ? 'active' : ''}`}
                        onClick={() => handleTabChange('finance')}
                      >
                        Finance
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'assets' ? 'active' : ''}`}
                        onClick={() => handleTabChange('assets')}
                      >
                        Assets
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="tab-content">
              {activeTab === 'profile' && (
                <Suspense fallback={<div>
                  <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
                </div></div>}>
                  <div id="emp_profile" className="pro-overview tab-pane fade show active">

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="card profile-box flex-fill">
                          <Personalinfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton}/>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex">
                        <div className="card profile-box flex-fill">
                          <EmergencyContact empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton}/>
                        </div>
                      </div>
                    </div>
                    {!section2 ? null : (
                    <div className="row mb-3">
                      <div className="col-md-6 d-flex">
                        <div className="card profile-box flex-fill">
                          <BankInfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton}/>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex">
                        <div className="card profile-box flex-fill">
                          <DependentInfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton}/>
                        </div>
                      </div>
                    </div>
                    )}
{!section3 ? null : (
                    <div className="row mb-3">
                      <div className="col-md-6 d-flex">
                        <div className="card profile-box flex-fill">
                          <EducationInfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton}/>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex">
                        <div className="card profile-box flex-fill">
                          <ExperienceInfo empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton}/>
                        </div>
                      </div>
                    </div>
)}

{!section4 ? null : (
                    <div className="row mb-3">
                      <div className="col-md-6 d-flex">
                        <div className="card profile-box flex-fill">
                          <AddressInfo empId={empId} apiBaseUrl={apiBaseUrl} refressAddressApi={refressAddressApi} showbutton={showbutton}/>
                        </div>
                      </div>
                    </div>
)}

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
                <Finance empID={activeTab === 'finance' ? empId : ""} section={"userlist"}/>
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
                          <Documents empId={empId} apiBaseUrl={apiBaseUrl} showbutton={showbutton}/>
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
