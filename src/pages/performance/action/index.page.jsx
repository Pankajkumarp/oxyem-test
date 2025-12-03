import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import PerformaceHistroy from '../../Components/Popup/performaceHistroy';
import { FaAward } from "react-icons/fa";
import Head from 'next/head';
import { axiosJWT } from '../../Auth/AddAuthorization';
export default function opportunityView() {
  const router = useRouter();
  const [isrefresh, setRefresh] = useState(true);
  const [performanceId, setPerformanceId] = useState("");
  const [isHistroyOpen, setHistroyOpen] = useState(false); ({});
  const [isStatData, isSetStatData] = useState({});
  const fetchStatData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/performance/pendingStats`);
      if (response) {
        const responseData = response.data.data
        isSetStatData(responseData)

      }
    } catch (error) {
    }
  };
  const onViewClick = (id) => {
    router.push(`/performance/${id}`);
  };
  const onHistoryClick = async (id) => {
    setPerformanceId(id);
    setHistroyOpen(true)
  };
  const closeHistroyClick = (id) => {
    setHistroyOpen(false)
  };
  const onEditClick = (id) => {
    router.push(`/performance/${id}`);
  };
  useEffect(() => {
    const mainElement = document.querySelector('body');
    fetchStatData();
    if (mainElement) {
      mainElement.setAttribute('id', 'performance-module');
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute('id');
      }
    };
  }, []);
  return (
    <>
      <Head>
        <title>Your Pending Reviews | Performance 360</title>
        <meta name="description" content={"Your Pending Reviews | Performance 360"} />
      </Head>
      <div className="main-wrapper">
        <PerformaceHistroy isOpen={isHistroyOpen} closeModal={closeHistroyClick} performanceId={performanceId} />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Performance : Action Required"} addlink={"/performance"} />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12 oxyem_perf oxyem_perf_pending">
                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-perform_dashborad performance_head_box">
                  <h3 className='performance_head_text'><FaAward />  Empowering Performance Excellence — Action Needed</h3>
                  <div className="oxyem-top-box-design design-only-attendence design-only-timesheetemp design-only-performance_Review">
                    <div className="stats-info stats-info-cus stats-info-srev">
                      <span className='top_lable_perform'>Under Review</span>
                      <h4 className='all_performance'>{isStatData ? isStatData.reviewPending : "0"}</h4>
                      <h6>Performance review is pending</h6>
                    </div>
                    <div className="stats-info stats-info-cus stats-info-close">
                      <span className='top_lable_perform'>Closed</span>
                      <h4 className='all_performance'>{isStatData ? isStatData.reviewClosed : "0"}</h4>
                      <h6>Performance review is closed</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                            {isrefresh && (
                              <CustomDataTable
                                title={""}
                                onViewClick={onViewClick}
                                onHistoryClick={onHistoryClick}
                                onEditClick={onEditClick}
                                dashboradApi={'/performance/getPendingPerformanceList'}
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
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </div>
    </>
  );
}
