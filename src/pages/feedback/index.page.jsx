'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // for client-side chart rendering in Next.js
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { axiosJWT } from '../Auth/AddAuthorization';
import { useRouter } from 'next/router';
import { GrStatusGoodSmall } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import Popup from './Popup';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Index() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [chartData, setChartData] = useState({ active: 0, inactive: 0 });
  const router = useRouter();

  const fetchInfo = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/feedback/feedbackformList`);
      if (response.status === 200 && response.data.data) {
        setFeedbackList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching feedback forms:", error);
    }
  };

  const fetchInfoChart = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/feedback/graph`);
      if (response.status === 200 && response.data.data) {
        const { active, inactive } = response.data.data[0] || { active: 0, inactive: 0 };
        setChartData({ active, inactive });
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  useEffect(() => {
    setFeedbackList([]);
    fetchInfo();
  }, []);

  const handelRediret = (value) => {
    router.push(`/feedback-userresponse/${value}`);
  };

  const [isOpen, setOpen] = useState(false);
  const [idShare, setIdShare] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handelEditPopup = (value, status) => {
    setIdShare(value);
    setSelectedStatus(status);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);
  const refreshPage = () => fetchInfo();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (activeTab === 1) {
      fetchInfoChart();
    } else {
      fetchInfo();
    }
  }, [activeTab]);

  return (
    <>
      <Popup isOpen={isOpen} closeModal={closeModal} idShare={idShare} selectedStatus={selectedStatus} refreshPage={refreshPage} />
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Feedback Dashboard"} addlink={'/feedback-management'} />
            <div className="container py-3">
              <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab mb-3">
                <li className={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                  <a className="nav-link" onClick={() => handleTabClick(0)}>
                    <div className="skolrup-profile-tab-link">List</div>
                  </a>
                </li>
                <li className={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                  <a className="nav-link" onClick={() => handleTabClick(1)}>
                    <div className="skolrup-profile-tab-link">Chart</div>
                  </a>
                </li>
              </ul>
              {activeTab === 1 && (
                <div className="row" id='feedback-top-section'>
                  <div className="col-md-6">
                    
                    <div className="oxyem-top-box-design design-only-attendence">                                    
                        <div className="stats-info stats-info-cus">                                    
                          <p className='value'>{chartData.active}</p>
                          <p className='title'>Active</p>
                        </div>
                        <div className="stats-info stats-info-cus">                                  
                          <p className='value-inactive'>{chartData.inactive}</p>
                          <p className='title'>Inactive</p>
                        </div>
                                                        
                                                    </div>
</div>
                  <div className="col-md-6">
                    
                  <Chart type="bar"
                        series={[{
                              name: 'Users',
                              data: [chartData.active, chartData.inactive]
                        }]}
                        options={{
                              plotOptions: { bar: { distributed: true, borderRadius: 8 } },
                              xaxis: { categories: ['Active', 'Inactive'] },
                              colors: ['#28a745', '#dc3545']
                        }}
                      width={'400'}
                  />
                  </div>
                </div>
              )}

              {/* {activeTab === 0 && ( */}
                <div className="row g-4">
                  
                  {feedbackList.length > 0 ? (
                    feedbackList.map((form) => (
                      <div className="col-md-3" key={form.idFeedbackForm}>
                        <div
                          className="card h-100 border-0 shadow-sm hover-shadow"
                          style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              height: '100px',
                              background: 'linear-gradient(135deg, #d7effe, #eaf7ef, #f4faff)',
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="m-2" style={{ width: "20px" }}>
                                <GrStatusGoodSmall color={form?.status === "active" ? "green" : "red"} />
                              </p>
                              <p className="m-2 text-end" style={{ width: "20px" }}>
                                <FaEdit style={{ cursor: "pointer" }} size={18} onClick={() => handelEditPopup(form.idShare, form?.status)} />
                              </p>
                            </div>
                          </div>
                          <div className="p-3" onClick={() => handelRediret(form.idShare)}>
                            <p className="fw-bold mb-1">
                              <span>{form.title?.trim() || 'Untitled Form'}</span>
                            </p>
                            <p>Response {form.total_user_responses}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted mt-5">No forms available</div>
                  )}
                </div>
              {/* )} */}

              

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
