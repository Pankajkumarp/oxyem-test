import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegClock, FaTimes } from "react-icons/fa";
import View from '../../Components/Popup/AttendenceHistroy.jsx';
import Head from 'next/head';
import pageTitles from '../../../common/pageTitles.js';
export default function index() {

    const router = useRouter();
    const [updleavelist, setUpdUserList] = useState([]);
    const [formcolumn, setFormColumn] = useState([]);
    const [listheader, setListHeaders] = useState([]);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");
    

    const [activeTab, setActiveTab] = useState(0); // State to manage active tab index
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
                const response = await axiosJWT.get(`${apiUrl}/shiftmanage`, { params: {statsFor: 'admin' ,isFor:'stats'} });
                const responsedata = response.data.data || {};
                const listheader = responsedata.listheader || {};
                setListHeaders(listheader);
            } catch (error) {
            }
        };

    useEffect(() => {
        fetchData();
    }, []);
    

    const onViewClick = (id) => {
        router.push(`/employeeDashboard/${id}`);
    };

    const onDeleteClick = (id) => {
        
    };

    const handleApprrovereq = async (id, type, data, onSuccess) => {
        const apipayload ={
            "action": type,
            "idAttendance": id,
            "rejectReason":data
        }

        // console.log(onSuccess);
        const message = type === 'approved' 
        ? 'You have successfully <strong>Approved</strong>!'
        : 'You have successfully <strong>Rejected</strong>!';
        const errormessage = 'Error connecting to the backend. Please try after Sometime.';
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/shiftStatus`, apipayload);
            // Handle the response if needed
            if (response) {
                onSuccess("clear");
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <img src='/assets/img/proposal-icon.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                        <button
                            onClick={() => toast.dismiss(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
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
                        border: '1px solid #4caf50',
                        padding: '8px',
                        color: '#4caf50',
                    },
                });
                
                fetchData();
            }

        } catch (error) {
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
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
            // Handle the error if any
            
        }
    }
    
    const handleUpadateClick = async (id) => {
        router.push(`/attendance/${id}`);
    }

    

  return (
    <>
    <Head>
        <title>{pageTitles.ShiftManagementAllowanceDashboard}</title>
        <meta name="description" content={pageTitles.ShiftManagementAllowanceDashboard} />
    </Head>
    <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} handleUpadateClick={handleUpadateClick} datafor={'shift'}/>
    
    <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">

                        <Breadcrumbs maintext={"Allowance Dashboard"} />

                        <div className="row">

                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                    
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
                                            <></>
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
                                                    handleApprrovereq={handleApprrovereq}
                                                    onHistoryClick={handleHistoryClick}
                                                    dashboradApi={'/shiftmanage'}
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


