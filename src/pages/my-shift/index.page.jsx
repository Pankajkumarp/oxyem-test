import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs.jsx';
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import View from '../Components/Popup/AttendenceHistroy.jsx';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import SelectComponent from '../Components/common/SelectOption/SelectComponent.jsx';

export default function index() {

    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");
    
    const [updleavelist, setUpdUserList] = useState([]);
    const [formcolumn, setFormColumn] = useState([]);
    const [listheader, setListHeaders] = useState([]);

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
    

    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };

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
    

    
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/empAttendanceShift`, { params: {statsFor: '' ,isFor:'stats'} });
                const responsedata = response.data.data || {};
                const listheader = responsedata.listheader || {};
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

    const chartData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/shiftGarph`, {
                params: { isFor: 'self' }
            });

            const monthchart = response.data.data.allData;
            const annualchart = response.data.data.month;
            const annualchartLine = response.data.data.annual;

            setMonthlyData({
                series: monthchart.data,
                options: {
                    chart: { width: 450, type: 'pie' },
                    labels: monthchart.label,
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

        // console.log(annualchart);

            setAnualChartData({
                series: [{
                    name: '',
                    data: annualchart.data
                  }],
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
                    colors: ['#26AF48', '#2196F3', '#FA7E12'],
                    dataLabels: { enabled: false },
                    title: { text: '', align: 'left' },
                    stroke: { show: true, width: 1, colors: ['transparent'] },
                    xaxis: {
                        categories: annualchart.label
                    },
                    yaxis: { title: { text: '' } },
                    fill: { opacity: 1 },
                    tooltip: { y: {} },
                },
            });

            setAnualChartLineData({
                series: [{
                    name: annualchartLine[0].name,
                    data: annualchartLine[0].data
                }],

                options: {
                    chart: {
                        height: 350,
                        type: 'line',
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 1,
                        curve: 'straight',
                        colors: ['#156082']  // Specify the line color you want here
                    },
                    markers: {
                        colors: '#156082'  // Specify the hover pointer color here
                    },
                    title: {
                        text: '',
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'],
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: [
                                        'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                                        'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'
                                    ],
                    }
                },
                
            });

            setIsChartOpen(true);

        } catch (error) {
            
        }
    };


    

useEffect(() => {
    fetchData();
    chartData();
}, []);
    



    const onViewClick = (id) => {

        router.push(`/employeeDashboard/${id}`);
    };

    const onDeleteClick = (id) => {
        
      };

      const handleUpadateClick = async (id) => {
        router.push(`/attendance/${id}`);
    }

      

  return (
    <>
    <Head>
        <title>{pageTitles.ShiftManagementMyDashboard}</title>
        <meta name="description" content={pageTitles.ShiftManagementMyDashboard} />
    </Head>
    <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} handleUpadateClick={handleUpadateClick} datafor={'shift'}/>
    
    <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">

                        <Breadcrumbs maintext={"Dashboard (Shift)"} />

                        <div className="row">

                            <div className="col-12 col-lg-12 col-xl-12">
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
                                    <div className="tab-content">

                                        {activeTab === 0 &&
                                            <div>
                                                {listheader && Object.keys(listheader).length > 0 &&
                                                    <div className="oxyem-top-box-design design-only-attendence" style={{marginBottom:'30px'}}>  
                                                    <div className="stats-info stats-info-cus shift-heading-box" >
                                                        <h6>No. of employee applicable in shift</h6>
                                                        <h4 className='month_attendence'>{listheader.applicableEmployee}</h4>
                                                    </div>
                                                    <div className="stats-info stats-info-cus shift-heading-box">                                        
                                                        <h6>Approved</h6>
                                                        <h4 className='week_attendence'>{listheader.aprvdmonth }</h4>
                                                    </div>
                                                    <div className="stats-info stats-info-cus shift-heading-box">                                        
                                                        <h6>Rejected</h6>
                                                        <h4 className='week_attendence'>{listheader.rejectedmonth }</h4>
                                                    </div>
                                                    <div className="stats-info stats-info-cus shift-heading-box">                                
                                                        <h6>Submitted</h6>
                                                        <h4 className='week_attendence'>{listheader.submittedmonth}</h4>
                                                    </div>
                                                </div>
                                                }


                                            </div>
                                        }
                                        {activeTab === 1 &&
                                            <>
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
                                                    
                                                    <div className="col-md-4">
                                                            <div className='graph-main-box'>
                                                                <div className='graph-top-head'>
                                                                <h3>Applicable Status</h3>
                                                                </div>
                                                                {anualChartData.series.length > 0 && (
                                                                    <Chart options={anualChartData.options} series={anualChartData.series} type="bar" height={252} width="100%" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="col-md-4">
                                                            <div className='graph-main-box'>
                                                                <div className='graph-top-head'>
                                                                <h3>Allowance Status count</h3>
                                                                </div>
                                                                <Chart options={monthlyData.options} series={monthlyData.series} type="pie" height={330} />
                                                            </div>
                                                        </div>


                                                        <div className="col-md-4">
                                                            <div className='graph-main-box'>
                                                                <div className='graph-top-head'>
                                                                <h3>Annual Trend</h3>
                                                                </div>
                                                                <Chart options={anualChartLineData.options} series={anualChartLineData.series} type="line" height={330} />
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            ):(<></>)}
                                            </>
                                        }
                                    </div>

                                </div>
                                
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                    <CustomDataTable
                                                    title={""}
                                                    data={updleavelist}
                                                    columnsdata={formcolumn}
                                                    onViewClick={onViewClick}
			    									onDeleteClick={onDeleteClick}
                                                    onHistoryClick={handleHistoryClick}
                                                    dashboradApi={'/empAttendanceShift'}   
                                                />
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
  )
}
