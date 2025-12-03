import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../../Components/Datatable/tablewithApi.jsx';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegClock, FaTimes } from "react-icons/fa";
import View from '../../../Components/Popup/ShiftDashboardHistroy.jsx';
import Head from 'next/head';
import pageTitles from '../../../../common/pageTitles.js';

export default function index() {

    const router = useRouter();
    const [updleavelist, setUpdUserList] = useState([]);
    const [formcolumn, setFormColumn] = useState([]);
    const [listheader, setListHeaders] = useState([]);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistroyId, setIsHistroyId] = useState("");

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
                const response = await axiosJWT.get(`${apiUrl}/pendingShift`);
    
                const responsedata = response.data.data || {};
                const tablecolumn = responsedata.formcolumns || [];
                const listheader = responsedata.listheader || {};
                setListHeaders(listheader);
                
                const transformedArray = responsedata.shiftlist || [];
    
                const columnData = [
                    {
                        "lebel": "Sr No",
                        "name": "srno"
                    },
                    {
                        "lebel": "Id",
                        "name": "id",
                        "isfilter": true,
                        "issort": true,
                        "download": false,

                    },
                    {
                        "name": "idEmployee",
                        "lebel": "Employee",
                        "isfilter": true,
                        "issort": true
                    },
                    {
                        "name": "shifName",
                        "lebel": "Shift Name",
                        "isfilter": true,
                        "issort": true
                    },
                    {
                        "name": "isapplicable",
                        "lebel": "Allowance Applicable",
                        "isfilter": true,
                        "issort": true
                    },
                    {
                        "name": "punchdate",
                        "lebel": "Punch Date",
                        "isfilter": true,
                        "issort": true
                    },
                    {
                        "name": "monthyear",
                        "lebel": "Month",
                        "isfilter": true,
                        "issort": true
                    },
                    {
                        "name": "hrs",
                        "lebel": "#of Hrs",
                        "isfilter": true,
                        "issort": true
                    },
                    {
                        "name": "status",
                        "lebel": "Status",
                        "isfilter": true,
                        "issort": true
                    },
                    {
                        "name": "action",
                        "lebel": "Action",
                        "download": false,
                        
                    },
                ];

                const mappedArray = transformedArray.map((item, index) => {
                    const itemMap = {};
                    item.forEach(obj => {
                        itemMap[obj.name] = obj.value;
                    });
    
                    return columnData.map(column => {
                       if (column.name === 'action') {
                            return {
                                name: column.lebel,
                                value: [ "history",
                                         "aprvrej"
                                        ]
                                };
                        }
                        else {
                            return {
                                name: column.lebel,
                                value: itemMap[column.name] || ''  // Handle missing values
                            };
                        }
                    });
                });
                setUpdUserList(mappedArray); // Set the non-flattened array
                setFormColumn(columnData);
    
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
    }, []);
  return (
    <>
    <Head>
        <title>{pageTitles.ShiftManagementPendingApproval}</title>
        <meta name="description" content={pageTitles.ShiftManagementPendingApproval} />
    </Head>
    <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"} handleUpadateClick={handleUpadateClick} />
    
    <div className="main-wrapper">
        <div className="page-wrapper">
            <div className="content container-fluid">
                <Breadcrumbs maintext={"Pending Approval"} addlink={"/shift-management/create"}/>     
                <div className="row">
                    <div className="col-12 col-lg-12 col-xl-12">
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
                                                    dashboradApi={'/pendingShift'}
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
        <Toaster
                position="top-right"
                reverseOrder={false}

            />
    </div>

    </>
  )
}
