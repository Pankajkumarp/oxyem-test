import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import View from '../../Components/Popup/ShiftManagementHistory.jsx';
import Head from 'next/head';
import pageTitles from '../../../common/pageTitles.js';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import SelectComponent from '../../Components/common/SelectOption/SelectComponent.jsx';

export default function index() {

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");
        const [listheader, setListHeaders] = useState([]);
    
    const openDetailpopup = async () => {
        setIsModalOpen(true)
    }
    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }

    const handleHistoryClick = async (id) => {

        
        setIsHistroyId(id)
        
        openDetailpopup()
        return
    }


    const [ischartopen, setIsChartOpen] = useState(false);
    const [monthlyData, setMonthlyData] = useState();
    
    const [anualChartData, setAnualChartData] = useState({
        series: [],
        options: {}
    });


    const [activeTab, setActiveTab] = useState(1); // State to manage active tab index
    
const handleTabClick = (index) => {
      setActiveTab(index); // Update active tab index when a tab is clicked
    };
    const onViewClick = (id) => {

        router.push(`/employeeDashboard/${id}`);
    };

    const onDeleteClick = (id) => {
        
      };

      const handleUpadateClick = async (id) => {
        router.push(`/attendance/${id}`);
    }

 const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/empAttendanceShift`, { params: {statsFor: 'admin' ,isFor:'stats'} });
                const responsedata = response.data.data || {};
                const listheader = responsedata.listheader || {};
                                console.log(listheader)

                setListHeaders(listheader);
    
            } catch (error) {
                
            }
        };

    const optionsmonth = [
        { value: 'Jan', label: 'January' },
        { value: 'Feb', label: 'February' },
        { value: 'Mar', label: 'March' },
        { value: 'Apr', label: 'April' },
        { value: 'May', label: 'May' },
        { value: 'Jun', label: 'June' },
        { value: 'Jul', label: 'July' },
        { value: 'Aug', label: 'August' },
        { value: 'Sep', label: 'September' },
        { value: 'Oct', label: 'October' },
        { value: 'Nov', label: 'November' },
        { value: 'Dec', label: 'December' },
    ];
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    const currentYear = new Date().getFullYear().toString();
    const optionsyear = [];
    for (let year = 2000; year <= currentYear; year++) {
        optionsyear.push({ value: year.toString(), label: year.toString() });
    }

    const [setMouth, setMonthValue] = useState(currentMonth); 
    const [setYear, setYearValue] = useState(currentYear);

    const onChangeYear = (value) => {
        if (value !== null) {
            setYearValue(value.value); // Update active tab index when a tab is clicked
        } else {
            setYearValue();
        }
    };

    const onChangeMonth = (value) => {
        if (value !== null) {
            setMonthValue(value.value); // Update active tab index when a tab is clicked
        } else {
            setMonthValue();
        }
    };


    useEffect(() => {
        if (setMouth && setYear) {

    const chartData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            // const response = await axiosJWT.get(`${apiUrl}/shiftGarph`, {
            //     params: { isGraph: 'admin' }
            // });

            const response = await axiosJWT.get(`${apiUrl}/shiftGarph`, 
                    { params: { "month": setMouth, "year": setYear, "isGraph":"admin"} 
                });
    
            const monthchart = response.data.data.shifftData;
            const annualchart = response.data.data.shiftDepart;
    
            // Transform annualchart data into series
            const categories = [];
            const seriesData = {};
    
            // Initialize series data structure
            for (const region in annualchart) {
                if (!categories.includes(region)) {
                    categories.push(region);
                }
                for (const department in annualchart[region]) {
                    if (!seriesData[department]) {
                        seriesData[department] = [];
                    }
                    seriesData[department].push(annualchart[region][department]);
                }
            }
    
            // Convert seriesData object to series array for ApexCharts
            const series = Object.keys(seriesData).map(department => ({
                name: department,
                data: seriesData[department]
            }));
    
            setMonthlyData({
                series: monthchart.data,
                options: {
                    chart: { width: 450, type: 'pie' },
                    labels: monthchart.label,
                    colors: ['#26AF48', '#2196F3', '#FA7E12','#cf59f1'],
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
    
            setAnualChartData({
                series: series,
                options: {
                    chart: { type: 'bar', height: 350 },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            endingShape: 'rounded',
                            dataLabels: { position: 'top' },
                        },
                    },
                    colors: ['#26AF48', '#2196F3', '#FA7E12', '#FF4560', '#775DD0'],
                    dataLabels: { enabled: false },
                    title: { text: '', align: 'left' },
                    stroke: { show: true, width: 1, colors: ['transparent'] },
                    xaxis: {
                        categories: categories
                    },
                    yaxis: { title: { text: 'Count' } },
                    fill: { opacity: 1 },
                    tooltip: { y: {} },
                },
            });
    
            setIsChartOpen(true);
    
        } catch (error) {
            // console.error('Error fetching chart data:', error);
        }
    };
    chartData();
}
}, [setMouth, setYear]);

    useEffect(() => {
        fetchData();
    }, [activeTab]);  
useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'shifts-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, [activeTab]);
  return (
    <>
    <Head>
        <title>{pageTitles.ShiftManagementDashboard}</title>
        <meta name="description" content={pageTitles.ShiftManagementDashboard} />
    </Head>
    <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} handleUpadateClick={handleUpadateClick} />
    
    <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Dashboard (Shift)"} addlink={"/admin/add-shift"}/>

                    

                        <div className="row">

                            <div className="col-12 col-lg-12 col-xl-12">
                              <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                    <ul className="nav-tabs nav nav-tabs-bottom justify-content-end oxyem-graph-tab">
                                        <li className={`nav-item ${activeTab === 0 ? 'active' : ''}`}>
                                            <a className={`nav-link`} onClick={() => handleTabClick(0)}>
                                                <div className="skolrup-profile-tab-link">Summary Overview</div>
                                            </a>
                                        </li>
                                        <li className={`nav-item ${activeTab === 1 ? 'active' : ''}`}>
                                            <a className={`nav-link`} onClick={() => handleTabClick(1)}>
                                                <div className="skolrup-profile-tab-link">Detailed Records</div>
                                            </a>
                                        </li>
                                    </ul>
                                    </div>

                                    {/* <div className="tab-content"> */}

                                        {activeTab === 0 &&
                                       <>
                                        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                                                                <div className="tab-content">  

   {listheader && Object.keys(listheader).length > 0 &&
                                                                     <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">  
                                                  
                                                     <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
 onClick={() => {
                                      // setStatus("Active");
                                      setActiveTab(1);
                                    }}                               >
                              <div className="ox-colored-box-1">
                                <h4 className="all_attendence">
                                  {listheader.applicableEmployee}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>No. of employee applicable in shift</h6>
                              </div>
                            </div>
                          </div>
                                                     <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
 onClick={() => {
                                      // setStatus("Active");
                                      setActiveTab(1);
                                    }}                               >
                              <div className="ox-colored-box-2">
                                <h4 className="month_attendence">
                                  {listheader.aprvdmonth}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Approved</h6>
                              </div>
                            </div>
                          </div>
                                                    
                                                     <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
 onClick={() => {
                                      // setStatus("Active");
                                      setActiveTab(1);
                                    }}                               >
                              <div className="ox-colored-box-3">
                                <h4 className="notsubmit_attendence">
                                  {listheader.rejectedmonth}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Rejected</h6>
                              </div>
                            </div>
                          </div>
                                                                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
 onClick={() => {
                                      // setStatus("Active");
                                      setActiveTab(1);
                                    }}                               >
                              <div className="ox-colored-box-4">
                                <h4 className="week_attendence">
                                  {listheader.submittedmonth}
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Submitted</h6>
                              </div>
                            </div>
                          </div>
                                                </div>
                                               
                                                 }  </div>
                                                
</div>
 <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                      <div className="tab-content">
                                                
                                               {ischartopen ?(
                                                <div>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <SelectComponent label={"Filter Data by Year"} placeholder={"Select Year..."} options={optionsyear} onChange={onChangeYear} value={setYear} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <SelectComponent label={"Filter Data by Month"} placeholder={"Select Month..."} options={optionsmonth} onChange={onChangeMonth} value={setMouth} />
                                                            </div>
                                                        </div>
    
                                                    </div>
                                                    
                                                    <div className="row">
                                                    
                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                            <div className='graph-main-box'>
                                                                <div className='graph-top-head'>
                                                                <h3>Department wise shifts</h3>
                                                                </div>
                                                                {anualChartData.series.length > 0 && (
                                                                    <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={252} width="100%" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                            <div className='graph-main-box'>
                                                                <div className='graph-top-head'>
                                                                <h3>Shift type</h3>
                                                                </div>
                                                                <Chart options={monthlyData.options} series={monthlyData.series} type="pie" width={300} height={300} />
                                                            </div>
                                                        </div>



                                                    </div>
                                                    
                                                </div>
                                            ):(<></>)}  
                                            </div>
                                            </div>
                                            </>
                                        }
                                        {activeTab === 1 &&
                                           <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                    <CustomDataTable
                                                            title={""}
                                                            onViewClick={onViewClick}
															onDeleteClick={onDeleteClick}
                                                            onHistoryClick={handleHistoryClick}
                                                            dashboradApi={'/userShiftList'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                        }
                                    {/* </div> */}

                                {/* </div> */}
                                
                                
                            </div>
                        </div>


                    </div>

                </div>
            </div>

            </>
  )
}
