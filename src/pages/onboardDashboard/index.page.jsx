import React, { useState } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import View from './history';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
export default function onboardDashboard() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistroyId, setHistroyId] = useState(false);
    const onViewClick = (id) => {
        router.push(`/onboardDashboard/${id}`);
    };
    const onHistoryClick = (id) => {
        setHistroyId(id);
        setIsModalOpen(true);
    };
    const onEditClick = (id) => {

    };
    const handleApprrovereq = (id) => {

    };

    const closeDetailpopup = async () => {
        setIsModalOpen(false);
    };

    return (
        <>
        <Head><title>{pageTitles.OnboardDashboard}</title></Head>
        <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"}  datafor={'groups'}/>
            <div className="main-wrapper">
                <div className="page-wrapper" id="managejob">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Employee Onboarding Process"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title={""}
                                                            onViewClick={onViewClick}
                                                            onHistoryClick={onHistoryClick}
                                                            onEditClick={onEditClick}
                                                            handleApprrovereq={handleApprrovereq}
                                                            pagename={"addpayroll"}
                                                            dashboradApi={'/jobs/onboardlist'}
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
    );
}
