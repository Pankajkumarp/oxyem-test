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
  const [isHistroyOpen, setHistroyOpen] = useState(false);
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
  const [isStatData, isSetStatData] = useState({});
  const fetchStatData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/performance/adminDashboardStats`);
      if (response) {
        const responseData = response.data.data
        isSetStatData(responseData)

      }
    } catch (error) {
    }
  };
  console.log("isStatData", isStatData)
  useEffect(() => {
    const mainElement = document.querySelector('body');
    fetchStatData()
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
        <title>Admin: 360° Performance Review – Track & Manage Evaluations</title>
        <meta name="description" content={"Admin: 360° Performance Review – Track & Manage Evaluations"} />
      </Head>
      <div className="main-wrapper">
        <PerformaceHistroy isOpen={isHistroyOpen} closeModal={closeHistroyClick} performanceId={performanceId} />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Admin Dashboard"} addlink={"/performance"} />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12 oxyem_perf oxyem_perf_admin">
                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-perform_dashborad performance_head_box">
                  <h3 className='performance_head_text'><FaAward /> Empowering Performance Excellence</h3>
                  <div className="row oxyem-top-box-design design-only-attendence design-only-timesheetemp design-only-performance_Review">
                    <div className="stats-info stats-info-cus stats-info-close">
                      <span className='top_lable_perform'>Cycle Initiate</span>
                      <h4 className='all_performance'>{isStatData ? isStatData['Cycle Intiated'] : "0"}</h4>
                      <h6>Cycle Initiation is pending</h6>
                    </div>
                    <div className="stats-info stats-info-cus stats-info-srev">
                      <span className='top_lable_perform'>Self Submission</span>
                      <h4 className='all_performance'>{isStatData ? isStatData['Self Submission'] : "0"}</h4>
                      <h6>Self Submission is pending</h6>
                    </div>
                    <div className="stats-info stats-info-cus stats-info-ban">
                      <span className='top_lable_perform'>Manager Review</span>
                      <h4 className='all_performance'>{isStatData ? isStatData['Manager Review'] : "0"}</h4>
                      <h6>Manager Review is pending</h6>
                    </div>
                    <div className="stats-info stats-info-cus stats-info-green">
                      <span className='top_lable_perform'>Approver Review</span>
                      <h4 className='all_performance'>{isStatData ? isStatData['Approver Review'] : "0"}</h4>
                      <h6>Approver Review is pending</h6>
                    </div>
                    <div className="stats-info stats-info-cus stats-info-orange">
                      <span className='top_lable_perform'>Published to Employee</span>
                      <h4 className='all_performance'>{isStatData ? isStatData['Published to Employee'] : "0"}</h4>
                      <h6>Published to Employee is pending</h6>
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
                                dashboradApi={'/performance/getPerformanceList'}
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
