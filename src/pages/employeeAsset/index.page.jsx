import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import HistroyView from '../Components/Popup/assetHistroy';
import ViewPopup from '../Components/Popup/assetDetail';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import View from './history';
import Info from './assetInfo';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';

export default function employeeAsset({ showOnlylist, isFor }) {
    const router = useRouter();

    const [isModalOpenview, setIsModalOpenview] = useState(false);
    const [isviewIdv, setIsViewIdv] = useState("");
    const onViewClick = async (id) => {
        setIsViewIdv(id)
        openDetailpopupview()
    }
    const openDetailpopupview = async () => {
        setIsModalOpenview(true)
    }
    const closeDetailpopupview = async () => {
        setIsModalOpenview(false)
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isviewId, setIsViewId] = useState("");

    const onHistoryClick = async (id) => {
        setIsViewId(id)
        openDetailpopup()
    }
    const openDetailpopup = async () => {
        setIsModalOpen(true)
    }
    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }
    const onEditClick = (id) => {

    };
    const handleApprrovereq = (id) => {

    };

    const [assetStatsEmp, setAssetStatsEmp] = useState({});

    const fetchAssetStats = async () => {
        try {
            console.log("Fetching asset stats for employee...");
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            // 🔹 Later replace dummy with real API call
            const response = await axiosJWT.get(`${apiUrl}/asset/allocationstats`, { params: { "isFor": "employee" }});
            const responsedata = response.data.data || {};
            console.log("Asset stats fetched:", responsedata);
            // ✅ Dummy stats data (based on your provided table)
            // const responsedata = {
            //     totalHardware: 1,
            //     totalSoftware: 0,
            //     totalActive: 1,
            //     allocated: 1,
            // };

            setAssetStatsEmp(responsedata);
        } catch (error) {
            console.error("Error fetching asset stats:", error);
        }
    };

    useEffect(() => {
        fetchAssetStats();
    }, []);

    const [searchfilter, setSearchfilter] = useState({});
    const [activeStatus, setActiveStatus] = useState(null);
    const [activeTableTab, setActiveTableTab] = useState("");

    const handleShowDataForStatus = (filterKey) => {
        setActiveTab(1); // switch to table tab
        setActiveTableTab(filterKey);
        setActiveStatus(filterKey);

        if (filterKey === "clr") {
            setSearchfilter({});
            setActiveStatus(null);
        } else {
            let filter = {};

            switch (filterKey) {
                case "Active":
                    setSearchfilter({ status: "allocated" });

                    break;
                case "Hardware":
                    setSearchfilter({ assetsCategories: "Hardware" });
                    break;
                case "Software":
                    setSearchfilter({ assetsCategories: "Software" });
                    break;
                case "allocated":
                    setSearchfilter({ status: "allocated" });
                    break;
            }
        }
    };


    return (
        <>
            <Head><title>{pageTitles.AssetDashboardEmployee}</title></Head>
            <Info isOpen={isModalOpenview} closeModal={closeDetailpopupview} isHistroyId={isviewIdv} />
            {/* <ViewPopup isOpen={isModalOpenview} closeModal={closeDetailpopupview} isviewId={isviewIdv} section={"employeeLeave"} /> */}
            <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isviewId} section={"adminAttendance"} datafor={'groups'} />


            <div className="main-wrapper">
                <div className="">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Dashborad (Employee Asset)"} addlink={"/addAssets"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-graph-sec">
                                    <div className="">
                                        <div>
                                            {assetStatsEmp && Object.keys(assetStatsEmp)?.length > 0 &&
                                                <div className="oxyem-top-box-design design-only-attendence leave-top-data-main row stats-grid mt-3">

                                                    {/* 🔹 Total Hardware */}
                                                    <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                        <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Hardware")}>
                                                            <img src='/assets/img/hardware.png' alt="hardware" />
                                                            <div className='ox-colored-box-1'>
                                                                <h4 className='all_attendence'>
                                                                    {assetStatsEmp.totalHardware}<br />
                                                                    {/* <span className="leave-days-label">Assets</span> */}
                                                                </h4>
                                                            </div>
                                                            <div className='ox-box-text'><h6>Hardware</h6></div>
                                                        </div>
                                                    </div>

                                                    {/* 🔹 Total Software */}
                                                    <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                        <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Software")}>
                                                            <img src='/assets/img/software.png' alt="software" />
                                                            <div className='ox-colored-box-2'>
                                                                <h4 className='month_attendence'>
                                                                    {assetStatsEmp.totalSoftware}<br />
                                                                    {/* <span className="leave-days-label">Assets</span> */}
                                                                </h4>
                                                            </div>
                                                            <div className='ox-box-text'><h6>Software</h6></div>
                                                        </div>
                                                    </div>

                                                    {/* 🔹 Total Available */}
                                                    <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                        <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Available")}>
                                                            <img src='/assets/img/available.png' alt="available" />
                                                            <div className='ox-colored-box-3'>
                                                                <h4 className='notsubmit_attendence'>
                                                                    {assetStatsEmp.totalActive}<br />
                                                                    {/* <span className="leave-days-label">Assets</span> */}
                                                                </h4>
                                                            </div>
                                                            <div className='ox-box-text'><h6>Active</h6></div>
                                                        </div>
                                                    </div>

                                                    {/* 🔹 Total Assets Amount */}
                                                    <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                                        <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("allocated")}>
                                                            <img src='/assets/img/money.png' alt="amount" />
                                                            <div className='ox-colored-box-4'>
                                                                <h4 className='week_attendence'>
                                                                    {assetStatsEmp?.allocated}
                                                                </h4>
                                                            </div>
                                                            <div className='ox-box-text'><h6>Allocated</h6></div>
                                                        </div>
                                                    </div>

                                                </div>
                                            }

                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-md-6">{activeStatus !== null && (
                                                        <div className="active-filter-tag">
                                                            <span> {typeof activeStatus === "string"
                                                                ? activeStatus?.charAt(0).toUpperCase() + activeStatus.slice(1)
                                                                : activeStatus}</span>
                                                            <button onClick={() => handleShowDataForStatus('clr')} className="remove-filter-btn">×</button>
                                                        </div>
                                                    )}</div>
                                                    {showOnlylist === 'showOnlylist' ?
                                                        <div className="row">
                                                            <div className="col-12 col-lg-12 col-xl-12">
                                                                <div className="row">
                                                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                                                        <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                                                                            <div className="center-part">
                                                                                <div className="card-body oxyem-mobile-card-body">
                                                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                                        {isFor === "admin" ?

                                                                                            <CustomDataTable
                                                                                                title={""}
                                                                                                onViewClick={onViewClick}
                                                                                                onHistoryClick={onHistoryClick}
                                                                                                onEditClick={onEditClick}
                                                                                                handleApprrovereq={handleApprrovereq}
                                                                                                pagename={"employeeAsset"}
                                                                                                dashboradApi={'/asset/myAssets'}
                                                                                                empId={router.query.id}
                                                                                            />

                                                                                            :

                                                                                            <CustomDataTable
                                                                                                title={""}
                                                                                                onViewClick={onViewClick}
                                                                                                onHistoryClick={onHistoryClick}
                                                                                                onEditClick={onEditClick}
                                                                                                handleApprrovereq={handleApprrovereq}
                                                                                                pagename={"employeeAsset"}
                                                                                                dashboradApi={'/asset/myAssets'}
                                                                                            />}



                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <>



                                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                <CustomDataTable
                                                                    title={""}
                                                                    onViewClick={onViewClick}
                                                                    onHistoryClick={onHistoryClick}
                                                                    onEditClick={onEditClick}
                                                                    handleApprrovereq={handleApprrovereq}
                                                                    pagename={"employeeAsset"}
                                                                    dashboradApi={'/asset/myAssets'}
                                                                    searchfilter={searchfilter}
                                                                />
                                                            </div>



                                                        </>
                                                    }
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
