import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import { Tooltip } from 'react-tooltip'
import { Toaster, toast } from 'react-hot-toast';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { ToastNotification, ToastContainer } from '../../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { FaTimes } from "react-icons/fa";
import dynamic from "next/dynamic";
import SelectComponent from '../../Components/common/SelectOption/SelectComponent.jsx';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Index() {
    const router = useRouter();
    const [isrefresh, setRefresh] = useState(true);
    const openDetailpopup = async () => {
        setIsModalOpen(true);
    };
        const [statusbar, setStatusBar] = useState();
            const [monthwiseBar, setMonthwiseBar] = useState();
            const [departmentwiseBar, setDepartmentwiseBar] = useState();

const [listheader, setListHeaders] = useState([]);
  const [status, setStatus] = useState();
      const [ischartopen, setIsChartOpen] = useState(false);
    const handleHistoryClick = async (id) => {
        setIsHistroyId(id);
        openDetailpopup();
    };
const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
    const handleTabClick = (index) => {
      setActiveTab(index); // Update active tab index when a tab is clicked
    };
    const onEditClick = (id) => {
        router.push(`/eSeparation/edit/${id}`);
    };
    const onViewClick = (id) => {
        router.push(`/eSeparation/view/${id}`);
    };

    const onDeleteClick = (id) => {
        // Delete action implementation
    };

    const handlerecallvalueClick = async (id) => {
        setIsRecallId(id);
        openRecallpopup();
    };

    const openRecallpopup = async () => {
        setIsModalOpenRe(true);
    };
	
	const onhandleConfirmClick = async (value) => {
		     try {
				const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/separation/confirm`, { params: { idSeparation: value } });
                if (response) {
					const message = response.data
					ToastNotification({ message: message });
					setRefreshForm(false)
					setTimeout(() => {
						setRefreshForm(true);
					}, 200);
				}
			} catch (error) {
            const errormessagel = error.response.data.errorMessage
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessagel }}></span>
                    <button
                        onClick={() => toast.dismiss(id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#FF000F',
                            marginLeft: 'auto',
                            cursor: 'pointer'
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
            ), {
                icon: null, // Disable default icon
                duration: 7000,
                style: {
                    border: '1px solid #FF000F',
                    padding: '8px',
                    color: '#FF000F',
                },
            });
        }
    };
     const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/separation/statscharts`, {
              params: { "isfor": "admin" ,  "isstats" : 1}
            });
                const responsedata = response.data.data || {};
               const listheader = responsedata || {};
                console.log(listheader);
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
   const statusDisplayMap = {
  submitted: "pending",
  approve: "approved",
  // Add more as needed
};
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
////////////////////////////////////

 useEffect(() => {
        if (setMouth && setYear && activeTab === 0) {
            const chartData = async () => {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                    const response = await axiosJWT.get(`${apiUrl}/separation/statscharts`, {
              params: { "isfor": "admin", "month": setMouth, "year": setYear}
            });

                  
                     const statuschart = response.data.data.statuswise;
                    const monthwisechart = response.data.data.monthwise;
                    const departmentwisechart = response.data.data.departmentwise;
                    console.log(statuschart)
                              

                    // Set up pie chart data for pricing
                    setStatusBar({
                        series: statuschart.data,
                        options: {
                            chart: { width: 450, type: 'pie' },
                            labels: statuschart.label,
                            colors: ['#26AF48', '#2196F3', '#FA7E12', '#cf59f1'],
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

                  

//                     // // Set bar chart for annual data
//                     if (
//   clientcountchart &&
//   Array.isArray(clientcountchart.data) &&
//   Array.isArray(clientcountchart.categories)
// ) {
  setMonthwiseBar({
                        series: [{
                            name: 'Based on Client',
                            data: monthwisechart.data
                        }],
                        options: {
                            chart: { type: 'bar', height: 350 },
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: '55%',
                                    endingShape: 'rounded',
                                },
                            },
                            colors: ['#26AF48', '#2196F3', '#FA7E12', '#FF4560', '#775DD0'],
                            dataLabels: { enabled: false },
                            xaxis: { categories: monthwisechart.label },
                            yaxis: { title: { text: '' } },
                            fill: { opacity: 1 },
                            tooltip: { y: { formatter: (val) => `${val} ` } },
                        },
                    });
//                     } else {
//   console.error("Invalid clientcount data: ", clientcountchart);
// }
 setDepartmentwiseBar({
                        series: [{
                            name: '  ',
                            data: departmentwisechart.data
                        }],
                        options: {
                            chart: { type: 'bar', height: 350 },
                            plotOptions: {
                                bar: {
                                    horizontal: false,
                                    columnWidth: '55%',
                                    endingShape: 'rounded',
                                },
                            },
                            colors: ['#26AF48', '#2196F3', '#FA7E12', '#FF4560', '#775DD0'],
                            dataLabels: { enabled: false },
                            xaxis: { categories: departmentwisechart.label },
                            yaxis: { title: { text: '' } },
                            fill: { opacity: 1 },
                            tooltip: { y: { formatter: (val) => `${val}` } },
                        },
                    });

                    setIsChartOpen(true);

                } catch (error) {
                    // Handle error

                }
            };

            chartData();
        }
    }, [setMouth, setYear, activeTab]);
//////////////////////////////////
 useEffect(() => {
          fetchData();
          // chartData();
      }, []);
    return (
        <>
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
                        onClick={() => handleTabClick(0)}
                      >
                        <div className="skolrup-profile-tab-link">
                          Summary Overview
                        </div>
                      </a>
                    </li>
                    <li
                      className={`nav-item ${activeTab === 1 ? "active" : ""}`}
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
                {activeTab === 0 && (
<>
   <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
{listheader &&
                              Object.keys(listheader).length > 0 && (
                                
                      <div className="">
                        <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">
                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
 onClick={() => {
                                      setStatus("submitted");
                                      setActiveTab(1);
                                    }}                               >
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
                               onClick={() => {
                                      // setEmptypefilter("Permanent");
                                      setStatus("approved");

                                      setActiveTab(1);
                                    }}
                            >
                              <div className="ox-colored-box-2">
                                <h4 className="month_attendence">
{listheader.approved}                                </h4>
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
                                        // setEmptypefilter("Contract");
                                      // setStatus("Active");

                                      setActiveTab(1);
                                    }}                            >
                              <div className="ox-colored-box-3">
                                <h4 className="notsubmit_attendence">
{listheader.leavingThisMonth}                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Leaving this month</h6>
                              </div>
                            </div>
                          </div>

                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
                            <div
                              className="stats-info stats-info-cus"
onClick={() => {
                                      // setEmptypefilter("Intern");
                                      // setStatus("Active");
                                      setActiveTab(1);
                                    }}                               >
                              <div className="ox-colored-box-4">
                                <h4 className="week_attendence">
{listheader.totalcount}       
                                </h4>
                              </div>
                              <div className="ox-box-text">
                                <h6>Total eSepration</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                     )}  
                    </div>

                  <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                      <div className="tab-content">
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
{ischartopen ? (
  <div className="row">

  <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
     <div className='oxy_chat_box'>
                                                                        <div className='graph-top-head'>
                                                                            <h3>Status</h3>
                                                                        </div>
                           <Chart options={statusbar.options} series={statusbar.series} type="pie" height={330} />

                          </div></div>
                          
                          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                             <div className='oxy_chat_box'>
                                                                        <div className='graph-top-head'>
                                                                            <h3>Monthly Trend</h3>
                                                                        </div>
                           <Chart options={monthwiseBar.options} series={monthwiseBar.series} type="bar" height={330}/>

                          </div></div>
                          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                             <div className='oxy_chat_box'>
                                                                        <div className='graph-top-head'>
                                                                            <h3>Department-wise</h3>
                                                                        </div>
                                                 <Chart options={departmentwiseBar.options} series={departmentwiseBar.series} type="bar" height={330} />

                          </div></div>
</div>
 ) : (<></>)}
                       </div>
                      </div>


</>
                                )}





                 {activeTab === 1 && (
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                   {typeof status === 'string' && (
                              <div className="active-filter-tag">
                                <span>{statusDisplayMap[status] || status}</span>

                                {/* <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span> */}

                                <button
                                  className="remove-filter-btn"
                                  onClick={() => {
                                    setStatus(null);    // Clear the filter
                                    fetchData();        // Reload full data
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            )}
                                                    <div className="row">

                                                    </div>


                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        {isrefresh && (
                                                            <CustomDataTable
                                                                title={""}
                                                                onViewClick={onViewClick}
                                                                onHistoryClick={handleHistoryClick}
                                                                onEditClick={onEditClick}
                                                                pagename={"addpayroll"}
                                                                dashboradApi={'/separation/initiateList'}
                                                                onDeleteClick={onDeleteClick}
																onConfirmClick={onhandleConfirmClick}
                                                              status={status}

                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                 )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
			<Toaster
                position="top-right"
                reverseOrder={false}
            />
            <Tooltip id="my-tooltip-breadcrumb" style={{ zIndex: 99999 }} />
        </>
    );
}
