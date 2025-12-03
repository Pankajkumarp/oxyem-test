import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import SeparationRecallmodal from '../Components/Popup/SeparationRecallmodal';
import { axiosJWT } from '../Auth/AddAuthorization';
import SearchFilter from '../Components/SearchFilter/SearchFilter.jsx';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import dynamic from "next/dynamic";
import SelectComponent from '../Components/common/SelectOption/SelectComponent.jsx';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Index() {
    const router = useRouter();
    const [idSeparation, setIdSeparation] = useState("");
    const [isrefresh, setRefresh] = useState(true);
    const onViewClick = (id) => {
        router.push(`/eSeparation/view/${id}`);
    };
    const [listheader, setListHeaders] = useState([]);
      const [status, setStatus] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handlerecallvalueClick = async (id) => {
        setIdSeparation(id);
        openRecallpopup();
    };
 const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
      setActiveTab(index); // Update active tab index when a tab is clicked
    };
    const openRecallpopup = async () => {
        setIsModalOpen(true);
    };
    const closeRecallClick = async () => {
        setIsModalOpen(false);
    };
    const handleRecallData = async (value) => {
        const payload = {
            "idSeparation": value.id,
            "recallReason": value.reason
        }
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/separation/recallInitiate';
            const response = await axiosJWT.post(apiUrl, payload);

            if (response.status === 200) {
                const message = 'You have successfully <strong>Recall Your Separation Document</strong>!';
                ToastNotification({ message: message });
                closeRecallClick();
                setRefresh(false)
                setTimeout(() => {
                    setRefresh(true);
                }, 400);
            }
        } catch (error) {

        }
    };
    const [searchfilter, setSearchfilter] = useState({});
          const searchFilterData = async (value) => {
              console.log("value", value)
              setSearchfilter(value);
          }
     const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/separation/statscharts`,
            {
              params: { "isfor": "self" }
            });
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
        <Head><title>{pageTitles.ESeparation}</title></Head>
            <SeparationRecallmodal isOpen={isModalOpen} closeModal={closeRecallClick} id={idSeparation} title={"Recall separation document"} filedName={"Recall Reason"} placeholder={"Enter Recall Reason"} onSubmit={handleRecallData} />
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext="eSeparation Dashboard" addlink="/initiate-separation" />
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
{listheader.pending}                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Pending</h6>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
                              
                            >
                              <div className="ox-colored-box-2">
                                <h4 className="month_attendence">
                                 {listheader.approved}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Approved</h6>
                              </div>
                            </div>
                          </div>

                         
                        </div>
                      </div>
)} 
                    </div>

                 


</>




               
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                 
                                                    <div className="row">

                                                    </div>


                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        {isrefresh && (
                                                            <CustomDataTable
                                                                title={""}
                                                                onViewClick={onViewClick}
                                                                pagename={"addpayroll"}
                                                                dashboradApi={'/separation/myInitiateList'}
                                                                handlerecallvalueClick={handlerecallvalueClick}
                                                                status={status}
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
            <Toaster
                position="top-right"
                reverseOrder={false}

            />
        </>
    );
}
