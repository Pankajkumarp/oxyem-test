import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import { ToastNotification, ToastContainer } from '../../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { axiosJWT } from '../../Auth/AddAuthorization';
import DeleteModal from '../../Components/Popup/PolicyDeleteModal';
import Head from 'next/head';
import pageTitles from '../../../common/pageTitles.js';
export default function adminPolicies() {
  const router = useRouter();
  const [isHistroyId, setIsHistroyId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenInfo, setIsModalInfoOpen] = useState(false);
  const [listheader, setListHeaders] = useState([]);
  
  const onViewClick = (id) => {
    setIsHistroyId(id);
    setIsModalInfoOpen(true)
  };
const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
      setActiveTab(index); // Update active tab index when a tab is clicked
    };
  const openDetailpopup = async () => { setIsModalOpen(true); };

  const closeDetailpopup = async () => { setIsModalOpen(false) }

  const closeInfopopup = async () => { setIsModalInfoOpen(false) }

  const onHistoryClick = async (id) => {
    setIsHistroyId(id);
    openDetailpopup();
  };

  const onEditClick = (id) => {
    {
      router.push(`policies/admin/${id}`);

    }
  };
  const handleApprrovereq = (id) => { };

  const handleDecommissionreq = async (data) => {
    const formattedData = {
      idAsset: [data.idEmployee] // Set idEmployee in idAsset array
    };

    data.section.forEach(section => {
      section.fields.forEach(field => {
        // Skip radio objects
        if (field.type === 'Radiot&c' || field.type === 'ClaimDoc') { return; }

        if (typeof field.attributeValue === 'object' && 'value' in field.attributeValue) {
          formattedData[field.name] = field.attributeValue.value;
        } else {
          formattedData[field.name] = field.attributeValue;
        }
      });
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/decommissionAsset';
      const response = await axiosJWT.post(apiUrl, formattedData);

      if (response.status === 200) {
        ToastNotification({ message: response.data.message });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
        ToastNotification({ message: errorMessage });
      } else {
        ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
      }
    }
  };


  const [isPolicyId, setIsPolicyId] = useState("");
  const [isPModalOpen, setPIsModalOpen] = useState(false);

  const onDeleteClick = (id) => {
    setIsPolicyId(id);
    setPIsModalOpen(true)
  };
  const closeDetailpopupRe = (id) => {
    setPIsModalOpen(false)
  };
  const [isDeleted, setIsDeleted] = useState(true);
  const CallDeleteApi = async (data) => {
    setIsDeleted(false)
    const apiUrle = process.env.NEXT_PUBLIC_API_BASE_URL;
        const apiUrl = apiUrle + '/policy/policyDeallocate';
        const response = await axiosJWT.post(apiUrl, data);
        if(response){
          setPIsModalOpen(false)
          setIsDeleted(true)
        }
  };

    useEffect(() => {
            const mainElement = document.querySelector('body');
            if (mainElement) {
                mainElement.setAttribute('id', 'policies-module');
            }
            return () => {
                if (mainElement) {
                    mainElement.removeAttribute('id');
                }
            };
        }, []);
   const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/policy/policystats`);
                const responsedata = response.data.data || {};
               const listheader = responsedata || {};
                console.log(listheader);
               setListHeaders(listheader);
             } catch (error) {
    
            }
        };

 useEffect(() => {
      console.log("User changed to tab:", activeTab);
          fetchData();

  }, [activeTab]);

  return (
    <>
    <Head><title>{pageTitles.PolicyDashboard}</title></Head>
    <DeleteModal isOpen={isPModalOpen} closeModal={closeDetailpopupRe} policyid={isPolicyId} CallDeleteApi={CallDeleteApi}/>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Policy Dashboard"} addlink={"/policy-management"} />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">

<div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                  <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                    
                    <li
                      className={`nav-item ${activeTab === 0 ? "active" : ""}`}
                    >
                      <a
                        className={`nav-link`}
                        onClick={() => handleTabClick(1)}
                      >
                        <div className="skolrup-profile-tab-link">Detailed Records</div>
                      </a>
                    </li>
                  </ul>
                  {/* <br></br> */}
                </div>

<>
   <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
{listheader &&
                              Object.keys(listheader).length > 0 && (
                      <div className="">
                        <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">
                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
                               >
                              <div className="ox-colored-box-1">
                                <h4 className="all_attendence">
{listheader.total}                            
    </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Total Policies</h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
                              
                            >
                              <div className="ox-colored-box-2">
                                <h4 className="month_attendence">
                                 {listheader.active}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Active Policies</h6>
                              </div>
                            </div>
                          </div>

                           <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
        <div className="stats-info stats-info-cus">
          <div className='ox-colored-box-4'>
            <h4 className='week_attendence'>
              {listheader.draft}
            </h4>
          </div>
          <div className='ox-box-text'><h6>Draft</h6></div>
        </div>
      </div>

      {/* Others */}
      <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
        <div className="stats-info stats-info-cus">
          <div className='ox-colored-box-3'>
            <h4 className='notsubmit_attendence '>
              {listheader.expired}
            </h4>
          </div>
          <div className='ox-box-text'><h6>Expired Policies</h6></div>
        </div>
      </div>
                        </div>
                      </div>
)} 
                    </div>

                 


</>





                <div className="row">
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                          {isDeleted && (
                            <CustomDataTable
                              title={""}
                              onViewClick={onViewClick}
                              onHistoryClick={onHistoryClick}
                              onEditClick={onEditClick}
                              handleApprrovereq={handleApprrovereq}
                              handleDecommissionreq={handleDecommissionreq}
                              pagename={"addpayroll"}
                              dashboradApi={'/policy/policylist'}
                              onDeleteClick={onDeleteClick}
                            />
                          )}
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
