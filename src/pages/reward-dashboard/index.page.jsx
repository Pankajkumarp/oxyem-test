import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { FaThumbsUp } from "react-icons/fa6";
import Stats from './Stats';
import RewardList from './RewardList';
import { axiosJWT } from '../Auth/AddAuthorization';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function RewardsDashboard() {
    const [viewMode, setViewMode] = useState('submitted');
    const [activeTab, setActiveTab] = useState(0);
    const [ischartopen, setIsChartOpen] = useState(false);

    const [monthlyData, setMonthlyData] = useState();
        
        const [anualChartData, setAnualChartData] = useState({
            series: [],
            options: {}
        });
    
        const [anualChartLineData, setAnualChartLineData] = useState({
            series: [],
            options: {}
        });

    const handleTabClick = (index) => {
      setActiveTab(index); // Update active tab index when a tab is clicked
    };

    const chartData = async () => {
      try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(`${apiUrl}/reward/rewardChart`);
  
          const { awardview, pointview, rewardview } = response.data;
  
          // Bar Chart for Awards Type
          setAnualChartData({
            series: [{
                name: 'Awards',
                data: rewardview.map(item => item.count) // Counts of each award type
            }],
            options: {
                chart: { 
                    type: 'bar', 
                    height: 250,  // Adjust height if needed
                    width: '100%' // Makes sure it adjusts with the container
                },
                plotOptions: {
                    bar: {
                        columnWidth: '20%',  // Adjust this to make bars thinner (20% - 70%)
                    }
                },
                xaxis: { 
                    categories: rewardview.map(item => item.rewardDescription) 
                },
                colors: ['#bd78f0'],
                title: { text: '', align: 'center' },
            },
        });
        
  
          // Pie Chart for Awards View
          setMonthlyData({
              series: awardview.data,
              options: {
                chart: { width: 450, type: 'pie' },
                labels: awardview.label,
                colors: ['#26AF48', '#2196F3', '#FA7E12'],
                title: { text: '', align: 'center' },
                legend: { position: 'bottom' },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: { width: 300 },
                        legend: { position: 'bottom' },
                    },
                }],
            },
          });
  
          // Pie Chart for Rewards Points
          setAnualChartLineData({
              series: pointview.data,
              options: {
                chart: { width: 450, type: 'pie' },
                labels: pointview.label,
                colors: ['#26AF48', '#2196F3', '#FA7E12'],
                title: { text: '', align: 'center' },
                legend: { position: 'bottom' },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: { width: 300 },
                        legend: { position: 'bottom' },
                    },
                }],
            },
          });
  
          setIsChartOpen(true);
      } catch (error) {
          console.error("Error fetching chart data", error);
      }
  };
  
  

        useEffect(() => {
          chartData();
        }, [activeTab])

         useEffect(() => {
                const mainElement = document.querySelector('body');
                if (mainElement) {
                    mainElement.setAttribute('id', 'reward-module');
                }
                return () => {
                    if (mainElement) {
                        mainElement.removeAttribute('id');
                    }
                };
            }, []);
        
    return (
<>
<Head><title>{pageTitles.RewardDashboard}</title></Head>
<div className="main-wrapper">
      <div className="page-wrapper" id="reward-dashboard">
        <div className="content container-fluid">
        <Breadcrumbs maintext={"Rewards Dashboard"} addlink={"/rewards-management"}/>
          <div className="row">
            <div className="col-12 col-lg-12 col-xl-12">
             <div className="row">
              <div className="col-12 col-lg-12 col-xl-12 d-flex">
                <div className="card flex-fill comman-shadow oxyem-index ">
                  <div className="center-part">
                    <div className="card-body oxyem-mobile-card-body">
                      <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                        <div className="container">
                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                          <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                            <li className={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                              <a className={`nav-link`} onClick={() => handleTabClick(0)}>
                                <div className="skolrup-profile-tab-link">Stats</div>
                              </a>
                            </li>
                            <li className={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                              <a className={`nav-link`} onClick={() => handleTabClick(1)}>
                                <div className="skolrup-profile-tab-link">Chart</div>
                              </a>
                            </li>
                          </ul>
                          <p className="fs-7 fw-semibold mt-2 d-flex align-items-center text-center">
                            <span className="text-primary fs-3 me-2 thumb-line" >
                            <FaThumbsUp size={40} />
                            </span>
                            <span className='heading-emp-reward'>Boost cultural health with easy-to-use cutting-edge Recognition System</span>
                          </p>
                          {activeTab === 0 &&
                            <Stats apipath={'rewardPoint'}/>
                          }

                                     {activeTab === 1 &&
                                            <>
                                            {ischartopen ?(
                                              <>
                                                <div className="row">
                                                {/* Bar Chart - Awards Type */}
                                                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                    
                                                    <div className='graph-main-box'>
                                                                <div className='graph-top-head'>
                                                                <h3>Awards Type</h3>
                                                                </div>
                                                                {anualChartData.series.length > 0 && (
                                                            <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={330} />
                                                        )}
                                                            </div>
                                                </div>
                                            
                                                {/* Pie Chart - Awards View */}
                                                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                    <div className="graph-main-box">
                                                      <div className='graph-top-head'>
                                                        <h3>Awards View</h3>
                                                      </div>
                                                      <Chart options={monthlyData.options} series={monthlyData.series} type="pie" height={330} />
                                                    </div>
                                                    
                                                </div>
                                            
                                                {/* Pie Chart - Rewards Points */}
                                                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                                                    <div className="graph-main-box">
                                                    <div className='graph-top-head'>
                                                        <h3>Rewards Point</h3>
                                                        </div>
                                                        <Chart options={anualChartLineData.options} series={anualChartLineData.series} type="pie" height={330} />
                                                    </div>
                                                </div>
                                            </div>
                                            </>
                                            ):(<></>)}
                                            </>
                                        }
</div>
                <div className="mt-4">
                    <div className="view-toggle-buttons">
                        <ul className="nav-tabs nav nav-tabs-bottom oxyem-graph-tab mb-3">
                            <li className={`nav-item ${viewMode === "submitted" ? 'active' : ''}`}>
                               <a className="nav-link" onClick={() => setViewMode('submitted')}>
                                 <div className="skolrup-profile-tab-link">Submitted</div>
                              </a>
                            </li>
                            <li className={`nav-item ${viewMode === "received" ? 'active' : ''}`}>
                              <a className="nav-link" onClick={() => setViewMode('received')}>
                                 <div className="skolrup-profile-tab-link">Received</div>
                              </a>
                            </li>
                        </ul>
                    </div> 
                    <RewardList viewMode={viewMode}/>
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
    </div>
  </div>

  </>  
    );
}